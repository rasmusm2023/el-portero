"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import {
  ChevronRight,
  LayoutDashboard,
  Loader2,
  LogOut,
  Plus,
  RefreshCcw,
  Save,
  Trash2,
  UtensilsCrossed,
  Wine,
} from "lucide-react";
import { MenuEditorVisibilityButton } from "@/components/admin/menu-editor/MenuEditorChrome";
import { EditableMenuItemFields } from "@/components/admin/menu-editor/EditableMenuItemFields";
import { SortableMenuItem } from "@/components/admin/menu-editor/SortableMenuItem";
import { SortableSectionOutline } from "@/components/admin/menu-editor/SortableMenuSection";
import {
  DeskNotice,
  deskDanger,
  deskField,
  deskGhost,
  deskHint,
  deskLabel,
  deskPanel,
  deskPrimary,
} from "@/components/admin/events/EventsDesk";
import { useMenuEditorExpansion } from "@/hooks/useMenuEditorExpansion";
import { useAdminAuth } from "@/components/admin/AdminAuthProvider";
import { PageShell } from "@/components/layout/PageShell";
import { t, type Locale } from "@/i18n/strings";
import { useLocale } from "@/i18n/useLocale";
import { dinnerMenuCategories } from "@/data/dinnerMenu";
import { drinksMenuCategories } from "@/data/drinksMenu";
import {
  normalizePriceOptions,
  type EditableMenuDoc,
  type EditableMenuKind,
} from "@/lib/editableMenuTypes";
import {
  dietaryTagOptionsForMenuIds,
  DRINKS_MENU_DIETARY_TAG_IDS,
  FOOD_MENU_DIETARY_TAG_IDS,
  normalizeDietaryTagIds,
  type DietaryTagId,
} from "@/lib/dietaryTags";
import { normalizeAllergenIds, type AllergenId } from "@/lib/menuAllergens";
import { staticCategoriesToEditableDraft } from "@/lib/editableMenuSeed";
import { getFirebaseFirestore } from "@/lib/firebase/client";
import {
  readEditableMenu,
  setEditableMenuPublished,
  upsertEditableMenu,
} from "@/lib/firebase/editableMenuStore";
import { useAdminConfirm } from "@/hooks/useAdminConfirm";
import {
  categorySortableId,
  itemSortableId,
  parseCategorySortableId,
  parseItemSortableId,
} from "@/lib/menuEditorIds";
import { menuContentSnapshot, menuDraftSnapshot } from "@/lib/menuEditorSnapshot";
import { unknownErrorMessage } from "@/lib/unknownErrorMessage";

const MENU_TABS: EditableMenuKind[] = ["dinner", "drinks"];

function menuTabLabel(locale: Locale, kind: EditableMenuKind): string {
  return kind === "dinner"
    ? t(locale, "admin.menus.tabDinner")
    : t(locale, "admin.menus.tabDrinks");
}

function MenuTabIcon({ kind }: { kind: EditableMenuKind }) {
  if (kind === "dinner") {
    return <UtensilsCrossed className="size-4 shrink-0" aria-hidden />;
  }
  return <Wine className="size-4 shrink-0" aria-hidden />;
}

function menuDishCountPhrase(locale: Locale, count: number): string {
  if (locale === "es") {
    return count === 1 ? "1 plato" : `${count} platos`;
  }
  if (locale === "sv") {
    return count === 1 ? "1 rätt" : `${count} rätter`;
  }
  if (locale === "de") {
    return count === 1 ? "1 Gericht" : `${count} Gerichte`;
  }
  if (locale === "fr") {
    return count === 1 ? "1 plat" : `${count} plats`;
  }
  return count === 1 ? "1 dish" : `${count} dishes`;
}

function menuItemCountPhrase(locale: Locale, kind: EditableMenuKind, count: number): string {
  if (kind === "drinks") {
    if (locale === "es") {
      return count === 1 ? "1 bebida" : `${count} bebidas`;
    }
    if (locale === "sv") {
      return count === 1 ? "1 dryck" : `${count} drycker`;
    }
    if (locale === "de") {
      return count === 1 ? "1 Getränk" : `${count} Getränke`;
    }
    if (locale === "fr") {
      return count === 1 ? "1 boisson" : `${count} boissons`;
    }
    return count === 1 ? "1 drink" : `${count} drinks`;
  }
  return menuDishCountPhrase(locale, count);
}

function itemSummaryLabel(
  locale: Locale,
  kind: EditableMenuKind,
  item: { name: string; price: string; hidden: boolean },
): string {
  const name =
    item.name.trim() ||
    t(locale, kind === "drinks" ? "admin.menus.untitledDrink" : "admin.menus.untitledDish");
  const price = item.price.trim();
  const base = price ? `${name} · ${price}` : name;
  return item.hidden ? `${base} · ${t(locale, "admin.menus.hiddenFromGuests")}` : base;
}

function sectionMetaLabel(
  locale: Locale,
  kind: EditableMenuKind,
  cat: { hidden: boolean; items: { hidden: boolean }[] },
): string {
  const countPhrase = menuItemCountPhrase(locale, kind, cat.items.length);
  if (cat.hidden) {
    return `${countPhrase} · ${t(locale, "admin.menus.hiddenFromGuests")}`;
  }
  const hiddenItems = cat.items.filter((it) => it.hidden).length;
  if (hiddenItems > 0) {
    return `${countPhrase} · ${t(locale, "admin.menus.hiddenItemsCount").replace("{count}", String(hiddenItems))}`;
  }
  return countPhrase;
}

function patchSnapshotPublished(snapshot: string | null, isPublished: boolean): string | null {
  if (!snapshot) return snapshot;
  try {
    const parsed = JSON.parse(snapshot) as { isPublished?: boolean };
    parsed.isPublished = isPublished;
    return JSON.stringify(parsed);
  } catch {
    return snapshot;
  }
}

function remapMovedIndex(current: number, from: number, to: number): number {
  if (current === from) return to;
  if (from < to && current > from && current <= to) return current - 1;
  if (from > to && current >= to && current < from) return current + 1;
  return current;
}

function seedFor(kind: EditableMenuKind): EditableMenuDoc {
  switch (kind) {
    case "dinner":
      return staticCategoriesToEditableDraft(dinnerMenuCategories);
    case "drinks":
      return staticCategoriesToEditableDraft(drinksMenuCategories);
  }
}

/**
 * Coerces a `priceOptions` value into the array shape without dropping rows whose
 * `label` or `price` is still blank — that lets the admin type into a fresh row
 * without it disappearing between keystrokes. Final cleanup happens in
 * {@link cleanDraftForSave}.
 */
function coercePriceOptionsShape(value: unknown): { label: string; price: string }[] {
  if (!Array.isArray(value)) return [];
  return value.map((entry) => {
    const row = (entry ?? {}) as Record<string, unknown>;
    return {
      label: typeof row.label === "string" ? row.label : "",
      price: typeof row.price === "string" ? row.price : "",
    };
  });
}

/**
 * Final pass before Save / Publish — strips partially filled `priceOptions` rows so
 * guests never see something like "Small  " with no price.
 */
function cleanDraftForSave(input: EditableMenuDoc): EditableMenuDoc {
  return {
    ...input,
    categories: input.categories.map((c) => ({
      ...c,
      items: c.items.map((it) => ({
        ...it,
        nameExtension: (it.nameExtension ?? "").trim(),
        priceOptions: normalizePriceOptions(it.priceOptions),
      })),
    })),
  };
}

function normalizedPersistedPayload(doc: EditableMenuDoc, isPublished: boolean): EditableMenuDoc {
  return cleanDraftForSave(normalizeDraft({ ...doc, isPublished }));
}

/** Full snapshot (includes hide flags) — baseline for Save button. */
function persistedMenuSnapshot(doc: EditableMenuDoc, isPublished: boolean): string {
  return menuDraftSnapshot(normalizedPersistedPayload(doc, isPublished), isPublished);
}

/** Content-only snapshot (hide flags ignored) — baseline for “save before hide” gating. */
function persistedContentSnapshot(doc: EditableMenuDoc, isPublished: boolean): string {
  return menuContentSnapshot(normalizedPersistedPayload(doc, isPublished), isPublished);
}

function normalizeDraft(input: EditableMenuDoc): EditableMenuDoc {
  return {
    title: input.title ?? "",
    isPublished: Boolean(input.isPublished),
    categories: (input.categories ?? []).map((c, ci) => ({
      position: ci,
      hidden: Boolean(c.hidden),
      title: c.title ?? "",
      items: (c.items ?? []).map((it, ii) => ({
        position: ii,
        hidden: Boolean(it.hidden),
        name: it.name ?? "",
        nameExtension: typeof it.nameExtension === "string" ? it.nameExtension : "",
        description: it.description ?? "",
        price: it.price ?? "",
        // Keep partial rows during editing (label OR price blank) — they're dropped
        // at save time via `cleanDraftForSave` so the published menu stays tidy.
        priceOptions: coercePriceOptionsShape(it.priceOptions),
        dietaryTagIds: normalizeDietaryTagIds(it.dietaryTagIds),
        allergenIds: normalizeAllergenIds(it.allergenIds),
      })),
    })),
  };
}

export function EditableMenusAdminPage() {
  const router = useRouter();
  const { locale } = useLocale();
  const { confirm, dialog: confirmDialog } = useAdminConfirm(locale);
  const { user, ready, signOutUser } = useAdminAuth();

  const [tab, setTab] = useState<EditableMenuKind>("dinner");
  const [draft, setDraft] = useState<EditableMenuDoc>(() => seedFor("dinner"));
  const [published, setPublished] = useState(false);

  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState<number | null>(0);
  const [publishedByKind, setPublishedByKind] = useState<
    Partial<Record<EditableMenuKind, boolean>>
  >({});
  const [focusedItem, setFocusedItem] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [savedSnapshot, setSavedSnapshot] = useState<string | null>(null);
  const [savedContentSnapshot, setSavedContentSnapshot] = useState<string | null>(null);

  const {
    isItemCollapsed,
    toggleItem,
    onCategoriesReordered,
    onItemsReordered,
    expandItem,
  } = useMenuEditorExpansion(tab);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const categorySortableIds = useMemo(
    () => draft.categories.map((_, ci) => categorySortableId(ci)),
    [draft.categories],
  );

  const hasUnsavedChanges = useMemo(() => {
    if (savedSnapshot === null) return false;
    return persistedMenuSnapshot(draft, published) !== savedSnapshot;
  }, [draft, published, savedSnapshot]);

  const hasUnsavedContent = useMemo(() => {
    if (savedContentSnapshot === null) return true;
    return persistedContentSnapshot(draft, published) !== savedContentSnapshot;
  }, [draft, published, savedContentSnapshot]);

  const visibilityControlsEnabled = !busy && !hasUnsavedContent;
  const saveEnabled = !busy && hasUnsavedChanges;

  const saveBeforeHideTitle = t(locale, "admin.menus.saveBeforeHide");

  const load = useCallback(async () => {
    setError(null);
    setMessage(null);
    setBusy(true);
    setLoading(true);
    try {
      const db = getFirebaseFirestore();
      const existing = await readEditableMenu(db, tab);
      if (existing) {
        const normalized = normalizeDraft(existing);
        const pub = Boolean(existing.isPublished);
        setDraft(normalized);
        setPublished(pub);
        const baseline = persistedMenuSnapshot(normalized, pub);
        setSavedSnapshot(baseline);
        setSavedContentSnapshot(persistedContentSnapshot(normalized, pub));
      } else {
        const seeded = seedFor(tab);
        setDraft(seeded);
        setPublished(false);
        setSavedSnapshot(persistedMenuSnapshot(seeded, false));
        setSavedContentSnapshot(persistedContentSnapshot(seeded, false));
      }
    } catch (err) {
      console.error(err);
      setError(unknownErrorMessage(err, t(locale, "admin.menus.loadError")));
    } finally {
      setBusy(false);
      setLoading(false);
    }
  }, [tab, locale]);

  useEffect(() => {
    if (!ready || !user) return;
    void load();
  }, [ready, user, tab, load]);

  useEffect(() => {
    if (!ready || !user) return;
    let cancelled = false;
    void (async () => {
      try {
        const db = getFirebaseFirestore();
        const [dinner, drinks] = await Promise.all([
          readEditableMenu(db, "dinner"),
          readEditableMenu(db, "drinks"),
        ]);
        if (cancelled) return;
        setPublishedByKind((prev) => ({
          ...prev,
          dinner: Boolean(dinner?.isPublished),
          drinks: Boolean(drinks?.isPublished),
        }));
      } catch (err) {
        console.error(err);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [ready, user]);

  useEffect(() => {
    if (loading) return;
    setPublishedByKind((prev) => ({ ...prev, [tab]: published }));
  }, [tab, published, loading]);

  const skipEditorScroll = useRef(true);

  useEffect(() => {
    setActiveSection(0);
    setFocusedItem(null);
    skipEditorScroll.current = true;
  }, [tab]);

  useEffect(() => {
    setActiveSection((current) => {
      if (current == null) return null;
      if (draft.categories.length === 0) return null;
      return Math.min(current, draft.categories.length - 1);
    });
  }, [draft.categories.length]);

  useEffect(() => {
    if (loading || activeSection == null) return;
    if (focusedItem != null) {
      document
        .getElementById(`menu-item-${itemSortableId(activeSection, focusedItem)}`)
        ?.scrollIntoView({ block: "nearest", inline: "nearest" });
      return;
    }
    if (skipEditorScroll.current) {
      skipEditorScroll.current = false;
      return;
    }
    document.getElementById("menu-section-editor")?.scrollIntoView({ block: "start" });
  }, [focusedItem, activeSection, loading]);

  const dietaryTagOptions = useMemo(
    () =>
      dietaryTagOptionsForMenuIds(
        tab === "drinks" ? DRINKS_MENU_DIETARY_TAG_IDS : FOOD_MENU_DIETARY_TAG_IDS,
      ),
    [tab],
  );

  async function onLogout() {
    setBusy(true);
    try {
      await signOutUser();
      router.push("/admin");
    } finally {
      setBusy(false);
    }
  }

  async function onSave() {
    setError(null);
    setMessage(null);
    setBusy(true);
    try {
      const db = getFirebaseFirestore();
      const payload = cleanDraftForSave(
        normalizeDraft({ ...draft, isPublished: published }),
      );
      await upsertEditableMenu(db, tab, payload);
      setSavedSnapshot(persistedMenuSnapshot(payload, published));
      setSavedContentSnapshot(persistedContentSnapshot(payload, published));
      setMessage(t(locale, "admin.menus.saved"));
    } catch (err) {
      console.error(err);
      setError(unknownErrorMessage(err, t(locale, "admin.menus.saveError")));
    } finally {
      setBusy(false);
    }
  }

  async function onPublish() {
    setError(null);
    setMessage(null);
    setBusy(true);
    try {
      const db = getFirebaseFirestore();
      const payload = cleanDraftForSave(
        normalizeDraft({ ...draft, isPublished: true }),
      );
      await upsertEditableMenu(db, tab, payload);
      setPublished(true);
      setSavedSnapshot(persistedMenuSnapshot(payload, true));
      setSavedContentSnapshot(persistedContentSnapshot(payload, true));
      setMessage(t(locale, "admin.menus.publishedSuccess"));
    } catch (err) {
      console.error(err);
      setError(unknownErrorMessage(err, t(locale, "admin.menus.publishError")));
    } finally {
      setBusy(false);
    }
  }

  async function onUnpublish() {
    setError(null);
    setMessage(null);
    setBusy(true);
    try {
      const db = getFirebaseFirestore();
      await setEditableMenuPublished(db, tab, false);
      setPublished(false);
      setSavedSnapshot((prev) => patchSnapshotPublished(prev, false));
      setSavedContentSnapshot((prev) => patchSnapshotPublished(prev, false));
      setMessage(t(locale, "admin.menus.unpublishedSuccess"));
    } catch (err) {
      console.error(err);
      setError(unknownErrorMessage(err, t(locale, "admin.menus.unpublishError")));
    } finally {
      setBusy(false);
    }
  }

  function selectSection(ci: number) {
    setFocusedItem(null);
    setActiveSection((current) => (current === ci ? null : ci));
  }

  function selectItem(ci: number, ii: number) {
    setActiveSection(ci);
    setFocusedItem(ii);
    expandItem(ci, ii);
  }

  function addCategory() {
    const nextIndex = draft.categories.length;
    setDraft((d) => {
      const next = normalizeDraft(d);
      next.categories.push({
        position: next.categories.length,
        hidden: false,
        title: `Section ${next.categories.length + 1}`,
        items: [
          {
            position: 0,
            hidden: false,
            name: "",
            nameExtension: "",
            description: "",
            price: "",
            priceOptions: [],
            dietaryTagIds: [],
            allergenIds: [],
          },
        ],
      });
      return next;
    });
    setActiveSection(nextIndex);
    setFocusedItem(0);
    expandItem(nextIndex, 0);
  }

  function toggleCategoryHidden(ci: number) {
    setDraft((d) => {
      const next = normalizeDraft(d);
      const cat = next.categories[ci];
      if (cat) cat.hidden = !cat.hidden;
      return next;
    });
  }

  function toggleItemHidden(ci: number, ii: number) {
    setDraft((d) => {
      const next = normalizeDraft(d);
      const it = next.categories[ci]?.items[ii];
      if (it) it.hidden = !it.hidden;
      return next;
    });
  }

  function removeCategory(ci: number) {
    setDraft((d) => {
      const next = normalizeDraft(d);
      next.categories.splice(ci, 1);
      return normalizeDraft(next);
    });
  }

  function addItem(ci: number) {
    let newIndex = 0;
    setDraft((d) => {
      const next = normalizeDraft(d);
      const cat = next.categories[ci];
      if (!cat) return next;
      newIndex = cat.items.length;
      cat.items.push({
        position: cat.items.length,
        hidden: false,
        name: "",
        nameExtension: "",
        description: "",
        price: "",
        priceOptions: [],
        dietaryTagIds: [],
        allergenIds: [],
      });
      return normalizeDraft(next);
    });
    expandItem(ci, newIndex);
    setActiveSection(ci);
    setFocusedItem(newIndex);
  }

  function moveCategory(from: number, to: number) {
    setDraft((d) => {
      const next = normalizeDraft(d);
      next.categories = arrayMove(next.categories, from, to);
      return normalizeDraft(next);
    });
    onCategoriesReordered(from, to);
    setActiveSection((current) => (current == null ? null : remapMovedIndex(current, from, to)));
  }

  function moveItem(ci: number, from: number, to: number) {
    setDraft((d) => {
      const next = normalizeDraft(d);
      const cat = next.categories[ci];
      if (!cat) return next;
      cat.items = arrayMove(cat.items, from, to);
      return normalizeDraft(next);
    });
    onItemsReordered(ci, from, to);
    if (ci === activeSection) {
      setFocusedItem((current) => (current == null ? null : remapMovedIndex(current, from, to)));
    }
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const activeId = String(active.id);
    const overId = String(over.id);

    const fromCat = parseCategorySortableId(activeId);
    const toCat = parseCategorySortableId(overId);
    if (fromCat != null && toCat != null) {
      moveCategory(fromCat, toCat);
      return;
    }

    const fromItem = parseItemSortableId(activeId);
    const toItem = parseItemSortableId(overId);
    if (fromItem && toItem && fromItem.ci === toItem.ci) {
      moveItem(fromItem.ci, fromItem.ii, toItem.ii);
    }
  }

  function toggleDietaryTag(ci: number, ii: number, id: DietaryTagId) {
    setDraft((d) => {
      const next = normalizeDraft(d);
      const it = next.categories[ci]?.items[ii];
      if (!it) return next;
      const cur = it.dietaryTagIds;
      it.dietaryTagIds = cur.includes(id)
        ? cur.filter((x) => x !== id)
        : [...cur, id];
      it.dietaryTagIds = normalizeDietaryTagIds(it.dietaryTagIds);
      return next;
    });
  }

  function toggleAllergen(ci: number, ii: number, id: AllergenId) {
    setDraft((d) => {
      const next = normalizeDraft(d);
      const it = next.categories[ci]?.items[ii];
      if (!it) return next;
      const cur = it.allergenIds;
      it.allergenIds = cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id];
      it.allergenIds = normalizeAllergenIds(it.allergenIds);
      return next;
    });
  }

  const allergensEnabled = tab !== "drinks";
  const priceOptionsEnabled = tab === "drinks";

  function addPriceOption(ci: number, ii: number) {
    setDraft((d) => {
      const next = normalizeDraft(d);
      const it = next.categories[ci]?.items[ii];
      if (!it) return next;
      it.priceOptions = [...it.priceOptions, { label: "", price: "" }];
      return next;
    });
  }

  function updatePriceOption(
    ci: number,
    ii: number,
    pi: number,
    field: "label" | "price",
    value: string,
  ) {
    setDraft((d) => {
      const next = normalizeDraft(d);
      const it = next.categories[ci]?.items[ii];
      const entry = it?.priceOptions[pi];
      if (!entry) return next;
      entry[field] = value;
      return next;
    });
  }

  function removePriceOption(ci: number, ii: number, pi: number) {
    setDraft((d) => {
      const next = normalizeDraft(d);
      const it = next.categories[ci]?.items[ii];
      if (!it) return next;
      it.priceOptions = it.priceOptions.filter((_, idx) => idx !== pi);
      return next;
    });
  }

  function removeItem(ci: number, ii: number) {
    setDraft((d) => {
      const next = normalizeDraft(d);
      const cat = next.categories[ci];
      if (!cat) return next;
      cat.items.splice(ii, 1);
      return normalizeDraft(next);
    });
  }

  async function confirmRemoveCategory(ci: number) {
    const cat = draft.categories[ci];
    if (!cat) return;
    const section = cat.title.trim() || t(locale, "admin.menus.untitledSection");
    const countPhrase = menuItemCountPhrase(locale, tab, cat.items.length);
    const msg = t(locale, "admin.menus.removeSectionConfirm")
      .replace("{section}", section)
      .replace("{countPhrase}", countPhrase);
    const ok = await confirm({
      message: msg,
      confirmLabel: t(locale, "admin.confirm.remove"),
    });
    if (!ok) return;
    removeCategory(ci);
    setActiveSection((current) => {
      if (current == null) return null;
      if (ci < current) return current - 1;
      if (ci === current) return Math.max(0, current - 1);
      return current;
    });
    setFocusedItem(null);
  }

  async function confirmRemoveItem(ci: number, ii: number) {
    const item = draft.categories[ci]?.items[ii];
    if (!item) return;
    const dish =
      item.name.trim() ||
      t(locale, tab === "drinks" ? "admin.menus.untitledDrink" : "admin.menus.untitledDish");
    const msg = t(
      locale,
      tab === "drinks" ? "admin.menus.removeDrinkConfirm" : "admin.menus.removeDishConfirm",
    ).replace("{dish}", dish);
    const ok = await confirm({
      message: msg,
      confirmLabel: t(locale, "admin.confirm.remove"),
    });
    if (!ok) return;
    removeItem(ci, ii);
    if (ci === activeSection) {
      setFocusedItem((current) => {
        if (current == null) return null;
        if (ii < current) return current - 1;
        if (ii === current) return null;
        return current;
      });
    }
  }

  const tabLabel = useMemo(() => menuTabLabel(locale, tab), [locale, tab]);

  if (!ready || !user) {
    return (
      <PageShell tone="admin" title={t(locale, "admin.menus.title")} intro={t(locale, "admin.menus.intro")}>
        <p className={`text-sm ${deskHint}`}>{t(locale, "admin.checkingSignIn")}</p>
      </PageShell>
    );
  }

  const sectionIndex = activeSection;
  const activeCategory = sectionIndex != null ? draft.categories[sectionIndex] : undefined;
  const sectionTitle = activeCategory
    ? activeCategory.title.trim() || t(locale, "admin.menus.untitledSection")
    : "";
  const focusedDish =
    activeCategory && focusedItem != null ? activeCategory.items[focusedItem] : undefined;
  const focusedLabel = focusedDish
    ? focusedDish.name.trim() ||
      t(locale, tab === "drinks" ? "admin.menus.untitledDrink" : "admin.menus.untitledDish")
    : null;
  const itemSortableIds =
    activeCategory && sectionIndex != null
      ? activeCategory.items.map((_, ii) => itemSortableId(sectionIndex, ii))
      : [];

  return (
    <>
      <PageShell
        tone="admin"
        title={t(locale, "admin.menus.title")}
        intro={t(locale, "admin.menus.intro")}
        maxWidthClassName="w-full max-w-[min(100%,112rem)]"
      >
        <div className="mb-6 flex flex-wrap items-center gap-2">
          <Link href="/admin/dashboard" className={deskGhost}>
            <LayoutDashboard className="size-3.5" aria-hidden />
            {t(locale, "admin.dashboard")}
          </Link>
          <button type="button" className={deskGhost} onClick={() => void load()} disabled={busy}>
            <RefreshCcw className={`size-3.5 ${loading ? "animate-spin" : ""}`} aria-hidden />
            {t(locale, "admin.menus.reload")}
          </button>
          <button type="button" className={deskGhost} onClick={onLogout} disabled={busy}>
            <LogOut className="size-3.5" aria-hidden />
            {t(locale, "admin.signOut")}
          </button>
        </div>

        {message || error ? (
          <div className="mb-6 space-y-3">
            {message ? <DeskNotice tone="success">{message}</DeskNotice> : null}
            {error ? <DeskNotice tone="error">{error}</DeskNotice> : null}
          </div>
        ) : null}

        {loading ? (
          <div className={deskPanel}>
            <p className="flex items-center gap-2.5 text-sm text-slate-600">
              <Loader2 className="size-4 animate-spin text-blue-600" aria-hidden />
              {t(locale, "admin.loading")}
            </p>
          </div>
        ) : (
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <div className="grid min-w-0 items-start gap-6 xl:grid-cols-12 xl:gap-8">
              <aside className="flex min-w-0 flex-col gap-4 xl:sticky xl:top-[calc(var(--header-h)+1rem)] xl:col-span-4 xl:max-h-[calc(100dvh-var(--header-h)-2rem)] xl:self-start 2xl:col-span-3">
                <div className={deskPanel}>
                  <h2 className="px-1.5 text-sm font-semibold text-slate-900">
                    {t(locale, "admin.menus.outline")}
                  </h2>
                  <div className="mt-3 space-y-1.5">
                    {MENU_TABS.map((kind) => {
                      const selected = tab === kind;
                      const kindPublished = publishedByKind[kind];
                      return (
                        <button
                          key={kind}
                          type="button"
                          disabled={busy}
                          onClick={() => setTab(kind)}
                          aria-pressed={selected}
                          className={[
                            "flex w-full cursor-pointer items-center gap-3 rounded-lg border p-2 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50",
                            selected
                              ? "border-blue-200 bg-blue-50 shadow-[inset_3px_0_0_0_#2563eb]"
                              : "border-slate-200 bg-slate-50 hover:border-slate-300 hover:bg-slate-100",
                          ].join(" ")}
                        >
                          <span
                            className={[
                              "flex size-9 shrink-0 items-center justify-center rounded-md",
                              selected ? "bg-white text-blue-700 shadow-sm" : "bg-slate-100 text-slate-500",
                            ].join(" ")}
                          >
                            <MenuTabIcon kind={kind} />
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className="block text-sm font-medium text-slate-900">
                              {menuTabLabel(locale, kind)}
                            </span>
                            {kindPublished == null ? null : (
                              <span className="mt-0.5 flex items-center gap-1.5 text-xs text-slate-500">
                                <span
                                  className={`size-1.5 rounded-full ${
                                    kindPublished ? "bg-emerald-500 status-breathe" : "bg-slate-400"
                                  }`}
                                  aria-hidden
                                />
                                {kindPublished
                                  ? t(locale, "admin.menus.visibleOnSite")
                                  : t(locale, "admin.menus.hiddenOnSite")}
                              </span>
                            )}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className={`${deskPanel} flex min-h-0 flex-col xl:flex-1 xl:overflow-hidden`}>
                  <div className="flex flex-wrap items-center justify-between gap-3 px-1.5">
                    <div className="flex items-baseline gap-2.5">
                      <h2 className="text-sm font-semibold text-slate-900">
                        {t(locale, "admin.menus.sectionsLabel")}
                      </h2>
                      <span className="rounded-md bg-slate-100 px-1.5 py-0.5 font-mono text-xs tabular-nums text-slate-500">
                        {draft.categories.length}
                      </span>
                    </div>
                    <button type="button" className={deskPrimary} onClick={addCategory} disabled={busy}>
                      <Plus className="size-3.5" aria-hidden />
                      {t(locale, "admin.menus.addSection")}
                    </button>
                  </div>
                  <p className={`mt-2 px-1.5 ${deskHint}`}>{t(locale, "admin.menus.connectionHint")}</p>
                  <SortableContext items={categorySortableIds} strategy={verticalListSortingStrategy}>
                    <ul className="mt-4 max-h-[min(46vh,22rem)] space-y-1.5 overflow-y-auto [scrollbar-color:rgba(15,23,42,0.28)_transparent] [scrollbar-width:thin] xl:max-h-none xl:min-h-0 xl:flex-1">
                      {draft.categories.length === 0 ? (
                        <li className="rounded-lg border border-dashed border-slate-200 px-4 py-8 text-center">
                          <p className={deskHint}>{t(locale, "admin.menus.noSection")}</p>
                        </li>
                      ) : (
                        draft.categories.map((cat, ci) => (
                          <SortableSectionOutline
                            key={categorySortableId(ci)}
                            ci={ci}
                            title={cat.title.trim() || t(locale, "admin.menus.untitledSection")}
                            meta={sectionMetaLabel(locale, tab, cat)}
                            selected={sectionIndex === ci}
                            hidden={cat.hidden}
                            busy={busy}
                            dragLabel={t(locale, "admin.menus.dragSection")}
                            deleteLabel={t(locale, "admin.menus.removeSection")}
                            hiddenLabel={t(locale, "admin.menus.hiddenFromGuests")}
                            deleteDisabled={draft.categories.length <= 1}
                            items={cat.items.map((item, ii) => ({
                              ii,
                              label:
                                item.name.trim() ||
                                t(
                                  locale,
                                  tab === "drinks"
                                    ? "admin.menus.untitledDrink"
                                    : "admin.menus.untitledDish",
                                ),
                              hidden: item.hidden,
                              selected: sectionIndex === ci && focusedItem === ii,
                            }))}
                            onSelect={() => selectSection(ci)}
                            onSelectItem={(ii) => selectItem(ci, ii)}
                            onDelete={() => void confirmRemoveCategory(ci)}
                          />
                        ))
                      )}
                    </ul>
                  </SortableContext>
                </div>

                <div className={deskPanel}>
                  <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3.5">
                    <p className="text-xs font-medium text-slate-500">{t(locale, "admin.menus.status")}</p>
                    <p className="mt-1 flex items-center gap-2 text-sm font-medium text-slate-900">
                      <span
                        className={`size-2 shrink-0 rounded-full ${
                          published ? "bg-emerald-500 status-breathe" : "bg-slate-400"
                        }`}
                        aria-hidden
                      />
                      {published
                        ? t(locale, "admin.menus.visibleOnSite")
                        : t(locale, "admin.menus.hiddenOnSite")}
                    </p>
                    <p className="mt-1 text-sm leading-relaxed text-slate-500">
                      {t(locale, "admin.menus.statusIntro")}
                    </p>
                  </div>
                  <div className="mt-3 flex flex-col gap-2">
                    {published ? (
                      <button
                        type="button"
                        className={`w-full ${deskGhost}`}
                        onClick={() => void onUnpublish()}
                        disabled={busy}
                      >
                        {t(locale, "admin.menus.unpublish")}
                      </button>
                    ) : (
                      <button
                        type="button"
                        className={`w-full ${deskPrimary}`}
                        onClick={() => void onPublish()}
                        disabled={busy}
                      >
                        {t(locale, "admin.menus.publish")}
                      </button>
                    )}
                    <button
                      type="button"
                      className={`w-full ${published ? deskPrimary : deskGhost}`}
                      onClick={() => void onSave()}
                      disabled={!saveEnabled}
                    >
                      {busy ? (
                        <Loader2 className="size-3.5 animate-spin" aria-hidden />
                      ) : (
                        <Save className="size-3.5" aria-hidden />
                      )}
                      {t(locale, "admin.events.saveChanges")}
                    </button>
                  </div>
                  <p className={`mt-3 text-sm ${hasUnsavedChanges ? "font-medium text-amber-700" : "text-slate-500"}`}>
                    {hasUnsavedChanges
                      ? t(locale, "admin.menus.unsavedChanges")
                      : t(locale, "admin.menus.allSaved")}
                  </p>
                </div>
              </aside>

              <div className="min-w-0 space-y-6 xl:col-span-8 2xl:col-span-9">
                <div className={deskPanel}>
                  <nav aria-label={t(locale, "admin.menus.breadcrumb")} className="flex flex-wrap items-center gap-1.5 text-sm">
                    <span className="font-medium text-slate-500">{tabLabel}</span>
                    {sectionTitle ? (
                      <>
                        <ChevronRight className="size-3.5 text-slate-300" aria-hidden />
                        <span className="font-medium text-slate-900">{sectionTitle}</span>
                      </>
                    ) : null}
                    {focusedLabel ? (
                      <>
                        <ChevronRight className="size-3.5 text-slate-300" aria-hidden />
                        <span className="max-w-[16rem] truncate text-slate-700">{focusedLabel}</span>
                      </>
                    ) : null}
                  </nav>
                  <div className="mt-5 max-w-xl">
                    <label className={deskLabel} htmlFor="menu-title">
                      {t(locale, "admin.menus.menuTitleLabel")}
                    </label>
                    <input
                      id="menu-title"
                      value={draft.title}
                      onChange={(e) => setDraft((d) => ({ ...d, title: e.target.value }))}
                      placeholder={t(locale, "admin.menus.menuTitlePlaceholder")}
                      className={deskField}
                      disabled={busy}
                    />
                    <p className={`mt-2 ${deskHint}`}>{t(locale, "admin.menus.menuTitleHint")}</p>
                  </div>
                </div>

                {sectionIndex != null && activeCategory ? (
                  <div id="menu-section-editor" className={`${deskPanel} scroll-mt-[calc(var(--header-h)+1rem)]`}>
                    <div className="flex items-start gap-3">
                      <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-semibold text-slate-600">
                        {sectionIndex + 1}
                      </span>
                      <div className="min-w-0">
                        <h2 className="text-base font-semibold text-slate-900">
                          {t(locale, "admin.menus.editingSection")}
                        </h2>
                        <p className={`mt-1 ${deskHint}`}>{sectionTitle}</p>
                      </div>
                    </div>

                    <div className="mt-5 max-w-xl">
                      <label className={deskLabel} htmlFor="section-title">
                        {t(locale, "admin.menus.sectionTitleLabel")}
                      </label>
                      <input
                        id="section-title"
                        value={activeCategory.title}
                        onChange={(e) =>
                          setDraft((d) => {
                            const next = normalizeDraft(d);
                            const c = next.categories[sectionIndex];
                            if (c) c.title = e.target.value;
                            return next;
                          })
                        }
                        className={deskField}
                        disabled={busy}
                      />
                    </div>

                    <div className="mt-5 flex flex-col gap-3 rounded-lg border border-slate-200 bg-slate-50 px-4 py-3.5 sm:flex-row sm:items-center sm:justify-between">
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-slate-900">
                          {activeCategory.hidden
                            ? t(locale, "admin.menus.hiddenFromGuests")
                            : t(locale, "admin.menus.shownToGuests")}
                        </p>
                        <p className={`mt-1 ${deskHint}`}>
                          {visibilityControlsEnabled
                            ? sectionMetaLabel(locale, tab, activeCategory)
                            : saveBeforeHideTitle}
                        </p>
                      </div>
                      <div className="flex flex-wrap items-center gap-2">
                        <MenuEditorVisibilityButton
                          hidden={activeCategory.hidden}
                          hideLabel={t(locale, "admin.menus.hideBtn")}
                          showLabel={t(locale, "admin.menus.showBtn")}
                          disabled={!visibilityControlsEnabled}
                          disabledTitle={saveBeforeHideTitle}
                          onToggle={() => toggleCategoryHidden(sectionIndex)}
                        />
                        <button
                          type="button"
                          className={deskDanger}
                          onClick={() => void confirmRemoveCategory(sectionIndex)}
                          disabled={busy || draft.categories.length <= 1}
                        >
                          <Trash2 className="size-3.5" aria-hidden />
                          {t(locale, "admin.menus.removeSection")}
                        </button>
                      </div>
                    </div>

                    <SortableContext items={itemSortableIds} strategy={verticalListSortingStrategy}>
                      <div className="relative mt-6 space-y-3 border-l border-slate-200 pl-4 sm:pl-5">
                        {activeCategory.items.map((item, ii) => (
                          <SortableMenuItem
                            key={itemSortableId(sectionIndex, ii)}
                            ci={sectionIndex}
                            ii={ii}
                            collapsed={isItemCollapsed(sectionIndex, ii)}
                            hidden={item.hidden}
                            selected={focusedItem === ii}
                            busy={busy}
                            expandLabel={t(locale, "admin.menus.expandItem")}
                            collapseLabel={t(locale, "admin.menus.collapseItem")}
                            dragLabel={t(locale, "admin.menus.dragItem")}
                            contextLabel={`${tabLabel} · ${sectionTitle}`}
                            summary={itemSummaryLabel(locale, tab, item)}
                            onToggleCollapse={() => {
                              const opening = isItemCollapsed(sectionIndex, ii);
                              toggleItem(sectionIndex, ii);
                              setFocusedItem(opening ? ii : null);
                            }}
                            visibilityButton={
                              <MenuEditorVisibilityButton
                                hidden={item.hidden}
                                hideLabel={t(locale, "admin.menus.hideBtn")}
                                showLabel={t(locale, "admin.menus.showBtn")}
                                disabled={!visibilityControlsEnabled}
                                disabledTitle={saveBeforeHideTitle}
                                onToggle={() => toggleItemHidden(sectionIndex, ii)}
                              />
                            }
                            actions={
                              <button
                                type="button"
                                title={t(
                                  locale,
                                  tab === "drinks" ? "admin.menus.removeDrink" : "admin.menus.removeDish",
                                )}
                                aria-label={t(
                                  locale,
                                  tab === "drinks" ? "admin.menus.removeDrink" : "admin.menus.removeDish",
                                )}
                                className="inline-flex size-8 cursor-pointer items-center justify-center rounded-md text-slate-400 transition-colors hover:bg-red-50 hover:text-red-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 disabled:cursor-not-allowed disabled:opacity-40"
                                onClick={() => void confirmRemoveItem(sectionIndex, ii)}
                                disabled={busy || activeCategory.items.length <= 1}
                              >
                                <Trash2 className="size-3.5" aria-hidden />
                              </button>
                            }
                          >
                            <EditableMenuItemFields
                              locale={locale}
                              tab={tab}
                              item={item}
                              busy={busy}
                              priceOptionsEnabled={priceOptionsEnabled}
                              allergensEnabled={allergensEnabled}
                              dietaryTagOptions={dietaryTagOptions}
                              onNameChange={(value) =>
                                setDraft((d) => {
                                  const next = normalizeDraft(d);
                                  const it = next.categories[sectionIndex]?.items[ii];
                                  if (it) it.name = value;
                                  return next;
                                })
                              }
                              onNameExtensionChange={(value) =>
                                setDraft((d) => {
                                  const next = normalizeDraft(d);
                                  const it = next.categories[sectionIndex]?.items[ii];
                                  if (it) it.nameExtension = value;
                                  return next;
                                })
                              }
                              onDescriptionChange={(value) =>
                                setDraft((d) => {
                                  const next = normalizeDraft(d);
                                  const it = next.categories[sectionIndex]?.items[ii];
                                  if (it) it.description = value;
                                  return next;
                                })
                              }
                              onPriceChange={(value) =>
                                setDraft((d) => {
                                  const next = normalizeDraft(d);
                                  const it = next.categories[sectionIndex]?.items[ii];
                                  if (it) it.price = value;
                                  return next;
                                })
                              }
                              onToggleDietaryTag={(id) => toggleDietaryTag(sectionIndex, ii, id)}
                              onToggleAllergen={(id) => toggleAllergen(sectionIndex, ii, id)}
                              onAddPriceOption={() => addPriceOption(sectionIndex, ii)}
                              onUpdatePriceOption={(pi, field, value) =>
                                updatePriceOption(sectionIndex, ii, pi, field, value)
                              }
                              onRemovePriceOption={(pi) => removePriceOption(sectionIndex, ii, pi)}
                            />
                          </SortableMenuItem>
                        ))}
                      </div>
                    </SortableContext>

                    <button
                      type="button"
                      className={`mt-5 ${deskGhost}`}
                      onClick={() => addItem(sectionIndex)}
                      disabled={busy}
                    >
                      <Plus className="size-3.5" aria-hidden />
                      {t(locale, tab === "drinks" ? "admin.menus.addDrink" : "admin.menus.addDish")}
                    </button>
                  </div>
                ) : (
                  <div className={deskPanel}>
                    <p className={deskHint}>
                      {draft.categories.length === 0
                        ? t(locale, "admin.menus.noSection")
                        : t(locale, "admin.menus.chooseSection")}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </DndContext>
        )}
      </PageShell>
      {confirmDialog}
    </>
  );
}
