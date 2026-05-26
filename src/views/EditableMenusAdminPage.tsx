"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
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
  LayoutDashboard,
  LogOut,
  Plus,
  RefreshCcw,
  Save,
  Trash2,
  Upload,
  UtensilsCrossed,
  Wine,
} from "lucide-react";
import { MenuEditorVisibilityButton } from "@/components/admin/menu-editor/MenuEditorChrome";
import { EditableMenuItemFields } from "@/components/admin/menu-editor/EditableMenuItemFields";
import { SortableMenuItem } from "@/components/admin/menu-editor/SortableMenuItem";
import { SortableMenuSection } from "@/components/admin/menu-editor/SortableMenuSection";
import { useMenuEditorExpansion } from "@/hooks/useMenuEditorExpansion";
import { useAdminAuth } from "@/components/admin/AdminAuthProvider";
import { PageShell } from "@/components/layout/PageShell";
import { t, type Locale } from "@/i18n/strings";
import { useLocale } from "@/i18n/useLocale";
import {
  adminBtnBlue,
  adminBtnCaution,
  adminBtnDanger,
  adminBtnGreen,
  adminBtnNeutral,
  adminBtnSignOut,
  adminCalloutSuccess,
} from "@/lib/adminUiStyles";
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
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [savedSnapshot, setSavedSnapshot] = useState<string | null>(null);
  const [savedContentSnapshot, setSavedContentSnapshot] = useState<string | null>(null);

  const {
    isSectionCollapsed,
    isItemCollapsed,
    toggleSection,
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
    }
  }, [tab, locale]);

  useEffect(() => {
    if (!ready || !user) return;
    void load();
  }, [ready, user, tab, load]);

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
      setMessage(t(locale, "admin.menus.unpublishedSuccess"));
    } catch (err) {
      console.error(err);
      setError(unknownErrorMessage(err, t(locale, "admin.menus.unpublishError")));
    } finally {
      setBusy(false);
    }
  }

  function addCategory() {
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
  }

  function moveCategory(from: number, to: number) {
    setDraft((d) => {
      const next = normalizeDraft(d);
      next.categories = arrayMove(next.categories, from, to);
      return normalizeDraft(next);
    });
    onCategoriesReordered(from, to);
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
  }

  const tabLabel = useMemo(() => menuTabLabel(locale, tab), [locale, tab]);

  if (!ready || !user) {
    return (
      <PageShell title={t(locale, "admin.menus.title")} intro={t(locale, "admin.loading")}>
        <p className="text-sm text-paper/70">{t(locale, "admin.checkingSignIn")}</p>
      </PageShell>
    );
  }

  return (
    <>
    <PageShell
      title={t(locale, "admin.menus.title")}
      intro={t(locale, "admin.menus.intro")}
      maxWidthClassName="w-full max-w-[min(100%,112rem)]"
    >
      <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-3">
          <Link
            href="/admin/dashboard"
            className={`inline-flex items-center justify-center ${adminBtnNeutral}`}
          >
            <span className="inline-flex items-center gap-2">
              <LayoutDashboard className="size-4" aria-hidden />
              {t(locale, "admin.dashboard")}
            </span>
          </Link>
          <button
            type="button"
            className={`inline-flex items-center justify-center ${adminBtnNeutral}`}
            onClick={() => void load()}
            disabled={busy}
          >
            <span className="inline-flex items-center gap-2">
              <RefreshCcw className="size-4" aria-hidden />
              {t(locale, "admin.menus.reload")}
            </span>
          </button>
        </div>
        <button type="button" className={adminBtnSignOut} onClick={onLogout} disabled={busy}>
          <span className="inline-flex items-center gap-2">
            <LogOut className="size-4" aria-hidden />
            {t(locale, "admin.signOut")}
          </span>
        </button>
      </div>

      <div className="mb-8 flex flex-wrap gap-2 border-b border-border pb-4">
        {MENU_TABS.map((kind) => (
          <button
            key={kind}
            type="button"
            disabled={busy}
            onClick={() => setTab(kind)}
            className={[
              "rounded-none border px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em]",
              tab === kind
                ? "border-emerald-600 bg-emerald-950/40 text-emerald-100"
                : "border-border bg-paper/5 text-paper/70 hover:border-paper/25",
            ].join(" ")}
          >
            <span className="inline-flex items-center gap-2">
              <MenuTabIcon kind={kind} />
              {menuTabLabel(locale, kind)}
            </span>
          </button>
        ))}
      </div>

      {error ? (
        <div className="mb-4 rounded-none border border-red-400/25 bg-red-950/25 px-4 py-3 text-sm text-red-100">
          {error}
        </div>
      ) : null}
      {message ? <div className={`mb-4 ${adminCalloutSuccess}`}>{message}</div> : null}

      <div className="grid gap-6 lg:grid-cols-[minmax(0,22rem)_minmax(0,1fr)]">
        <aside className="lg:sticky lg:top-[calc(var(--header-h)+1rem)] lg:self-start">
        <div className="rounded-none border border-border bg-paper-dark/35 p-6">
          <h2 className="font-display text-xl font-medium text-paper">
            {t(locale, "admin.menus.status")} · {tabLabel}
          </h2>
          <p className="mt-3 text-sm text-paper/65 leading-relaxed">
            {t(locale, "admin.menus.statusIntro")}
          </p>
          <div className="mt-6 space-y-2 text-sm">
            <p>
              <span className="text-paper/60">{t(locale, "admin.menus.publishedLabel")}</span>{" "}
              <span className="font-semibold text-paper">
                {published ? t(locale, "admin.menus.yes") : t(locale, "admin.menus.no")}
              </span>
            </p>
          </div>
          <div className="mt-8 flex flex-col gap-3">
            <button type="button" className={`w-full ${adminBtnGreen}`} onClick={() => void onPublish()} disabled={busy}>
              <span className="inline-flex items-center justify-center gap-2">
                <Upload className="size-4" aria-hidden />
                {t(locale, "admin.menus.publish")}
              </span>
            </button>
            <button
              type="button"
              className={`w-full ${adminBtnCaution}`}
              onClick={() => void onUnpublish()}
              disabled={busy || !published}
            >
              {t(locale, "admin.menus.unpublish")}
            </button>
            <button
              type="button"
              className={`w-full ${saveEnabled ? adminBtnBlue : adminBtnNeutral}`}
              onClick={() => void onSave()}
              disabled={!saveEnabled}
              aria-disabled={!saveEnabled}
            >
              <span className="inline-flex items-center justify-center gap-2">
                <Save className="size-4" aria-hidden />
                {t(locale, "admin.events.saveChanges")}
              </span>
            </button>
          </div>
        </div>
        </aside>

        <div className="rounded-none border border-border bg-paper-dark/35 p-6">
          <label className="block text-sm font-medium text-paper">
            {t(locale, "admin.menus.menuTitleLabel")}
          </label>
          <input
            value={draft.title}
            onChange={(e) => setDraft((d) => ({ ...d, title: e.target.value }))}
            placeholder={t(locale, "admin.menus.menuTitlePlaceholder")}
            className="mt-2 w-full rounded-none border border-paper/15 bg-paper/8 px-3 py-2 text-paper shadow-sm placeholder:text-paper/40 focus:border-gold/45 focus:outline-none focus:ring-1 focus:ring-gold/20"
            disabled={busy}
          />

          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={categorySortableIds} strategy={verticalListSortingStrategy}>
              <div className="mt-10 space-y-6">
                {draft.categories.map((cat, ci) => {
                  const itemSortableIds = cat.items.map((_, ii) => itemSortableId(ci, ii));
                  const sectionCollapsed = isSectionCollapsed(ci);

                  return (
                    <SortableMenuSection
                      key={categorySortableId(ci)}
                      ci={ci}
                      collapsed={sectionCollapsed}
                      hidden={cat.hidden}
                      busy={busy}
                      expandLabel={t(locale, "admin.menus.expandSection")}
                      collapseLabel={t(locale, "admin.menus.collapseSection")}
                      dragLabel={t(locale, "admin.menus.dragSection")}
                      meta={sectionMetaLabel(locale, tab, cat)}
                      onToggleCollapse={() => toggleSection(ci)}
                      visibilityButton={
                        <MenuEditorVisibilityButton
                          hidden={cat.hidden}
                          hideLabel={t(locale, "admin.menus.hideBtn")}
                          showLabel={t(locale, "admin.menus.showBtn")}
                          disabled={!visibilityControlsEnabled}
                          disabledTitle={saveBeforeHideTitle}
                          onToggle={() => toggleCategoryHidden(ci)}
                        />
                      }
                      title={
                        <label className="block w-full text-sm font-medium text-paper">
                          {t(locale, "admin.menus.sectionTitleLabel")}
                          <input
                            value={cat.title}
                            onChange={(e) =>
                              setDraft((d) => {
                                const next = normalizeDraft(d);
                                const c = next.categories[ci];
                                if (c) c.title = e.target.value;
                                return next;
                              })
                            }
                            className="mt-2 w-full rounded-none border border-paper/15 bg-paper/8 px-3 py-2 text-paper shadow-sm focus:border-gold/45 focus:outline-none focus:ring-1 focus:ring-gold/20"
                            disabled={busy}
                          />
                        </label>
                      }
                      actions={
                        <button
                          type="button"
                          className={`inline-flex items-center gap-2 ${adminBtnDanger}`}
                          onClick={() => void confirmRemoveCategory(ci)}
                          disabled={busy || draft.categories.length <= 1}
                        >
                          <Trash2 className="size-4" aria-hidden />
                          {t(locale, "admin.menus.removeSection")}
                        </button>
                      }
                    >
                      <SortableContext items={itemSortableIds} strategy={verticalListSortingStrategy}>
                        <div className="space-y-4">
                          {cat.items.map((item, ii) => (
                            <SortableMenuItem
                              key={itemSortableId(ci, ii)}
                              ci={ci}
                              ii={ii}
                              collapsed={isItemCollapsed(ci, ii)}
                              hidden={item.hidden}
                              busy={busy}
                              expandLabel={t(locale, "admin.menus.expandItem")}
                              collapseLabel={t(locale, "admin.menus.collapseItem")}
                              dragLabel={t(locale, "admin.menus.dragItem")}
                              summary={itemSummaryLabel(locale, tab, item)}
                              onToggleCollapse={() => toggleItem(ci, ii)}
                              visibilityButton={
                                <MenuEditorVisibilityButton
                                  hidden={item.hidden}
                                  hideLabel={t(locale, "admin.menus.hideBtn")}
                                  showLabel={t(locale, "admin.menus.showBtn")}
                                  disabled={!visibilityControlsEnabled}
                                  disabledTitle={saveBeforeHideTitle}
                                  onToggle={() => toggleItemHidden(ci, ii)}
                                />
                              }
                              actions={
                                <button
                                  type="button"
                                  className={`inline-flex items-center gap-2 ${adminBtnDanger}`}
                                  onClick={() => void confirmRemoveItem(ci, ii)}
                                  disabled={busy || cat.items.length <= 1}
                                >
                                  <Trash2 className="size-3.5" aria-hidden />
                                  {t(
                                    locale,
                                    tab === "drinks"
                                      ? "admin.menus.removeDrink"
                                      : "admin.menus.removeDish",
                                  )}
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
                                    const it = next.categories[ci]?.items[ii];
                                    if (it) it.name = value;
                                    return next;
                                  })
                                }
                                onNameExtensionChange={(value) =>
                                  setDraft((d) => {
                                    const next = normalizeDraft(d);
                                    const it = next.categories[ci]?.items[ii];
                                    if (it) it.nameExtension = value;
                                    return next;
                                  })
                                }
                                onDescriptionChange={(value) =>
                                  setDraft((d) => {
                                    const next = normalizeDraft(d);
                                    const it = next.categories[ci]?.items[ii];
                                    if (it) it.description = value;
                                    return next;
                                  })
                                }
                                onPriceChange={(value) =>
                                  setDraft((d) => {
                                    const next = normalizeDraft(d);
                                    const it = next.categories[ci]?.items[ii];
                                    if (it) it.price = value;
                                    return next;
                                  })
                                }
                                onToggleDietaryTag={(id) => toggleDietaryTag(ci, ii, id)}
                                onToggleAllergen={(id) => toggleAllergen(ci, ii, id)}
                                onAddPriceOption={() => addPriceOption(ci, ii)}
                                onUpdatePriceOption={(pi, field, value) =>
                                  updatePriceOption(ci, ii, pi, field, value)
                                }
                                onRemovePriceOption={(pi) => removePriceOption(ci, ii, pi)}
                              />
                            </SortableMenuItem>
                          ))}
                        </div>
                      </SortableContext>

                      <button
                        type="button"
                        className={`mt-6 inline-flex items-center gap-2 ${adminBtnBlue}`}
                        onClick={() => addItem(ci)}
                        disabled={busy}
                      >
                        <Plus className="size-4" aria-hidden />
                        {t(
                          locale,
                          tab === "drinks" ? "admin.menus.addDrink" : "admin.menus.addDish",
                        )}
                      </button>
                    </SortableMenuSection>
                  );
                })}
              </div>
            </SortableContext>
          </DndContext>

          <button
            type="button"
            className={`mt-10 inline-flex items-center gap-2 ${adminBtnNeutral}`}
            onClick={addCategory}
            disabled={busy}
          >
            <Plus className="size-4" aria-hidden />
            {t(locale, "admin.menus.addSection")}
          </button>
        </div>
      </div>
    </PageShell>
    {confirmDialog}
    </>
  );
}
