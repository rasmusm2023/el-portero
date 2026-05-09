"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { LogOut, Plus, RefreshCcw, Save, Trash2, Upload } from "lucide-react";
import { useAdminAuth } from "@/components/admin/AdminAuthProvider";
import { PageShell } from "@/components/layout/PageShell";
import {
  adminBtnBlue,
  adminBtnCaution,
  adminBtnGreen,
  adminBtnNeutral,
  adminBtnSignOut,
  adminCalloutSuccess,
} from "@/lib/adminUiStyles";
import { alacarteMenuCategories } from "@/data/alacarteMenu";
import { brunchMenuCategories } from "@/data/brunchMenu";
import { drinksMenuCategories } from "@/data/drinksMenu";
import type { EditableMenuDoc, EditableMenuKind } from "@/lib/editableMenuTypes";
import {
  dietaryTagOptionsForMenuIds,
  DRINKS_MENU_DIETARY_TAG_IDS,
  FOOD_MENU_DIETARY_TAG_IDS,
  normalizeDietaryTagIds,
  type DietaryTagId,
} from "@/lib/dietaryTags";
import { staticCategoriesToEditableDraft } from "@/lib/editableMenuSeed";
import { getFirebaseFirestore } from "@/lib/firebase/client";
import {
  readEditableMenu,
  setEditableMenuPublished,
  upsertEditableMenu,
} from "@/lib/firebase/editableMenuStore";
import { unknownErrorMessage } from "@/lib/unknownErrorMessage";

const TABS: { kind: EditableMenuKind; label: string }[] = [
  { kind: "alacarte", label: "À la carte" },
  { kind: "drinks", label: "Drinks" },
  { kind: "brunch", label: "Brunch" },
];

function seedFor(kind: EditableMenuKind): EditableMenuDoc {
  switch (kind) {
    case "alacarte":
      return staticCategoriesToEditableDraft(alacarteMenuCategories);
    case "drinks":
      return staticCategoriesToEditableDraft(drinksMenuCategories);
    case "brunch":
      return staticCategoriesToEditableDraft(brunchMenuCategories);
  }
}

function normalizeDraft(input: EditableMenuDoc): EditableMenuDoc {
  return {
    title: input.title ?? "",
    isPublished: Boolean(input.isPublished),
    categories: (input.categories ?? []).map((c, ci) => ({
      position: ci,
      title: c.title ?? "",
      items: (c.items ?? []).map((it, ii) => ({
        position: ii,
        name: it.name ?? "",
        description: it.description ?? "",
        price: it.price ?? "",
        dietaryTagIds: normalizeDietaryTagIds(it.dietaryTagIds),
      })),
    })),
  };
}

export function EditableMenusAdminPage() {
  const router = useRouter();
  const { user, ready, signOutUser } = useAdminAuth();

  const [tab, setTab] = useState<EditableMenuKind>("alacarte");
  const [draft, setDraft] = useState<EditableMenuDoc>(() => seedFor("alacarte"));
  const [published, setPublished] = useState(false);

  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const load = useCallback(async () => {
    setError(null);
    setMessage(null);
    setBusy(true);
    try {
      const db = getFirebaseFirestore();
      const existing = await readEditableMenu(db, tab);
      if (existing) {
        setDraft(normalizeDraft(existing));
        setPublished(Boolean(existing.isPublished));
      } else {
        setDraft(seedFor(tab));
        setPublished(false);
      }
    } catch (err) {
      console.error(err);
      setError(unknownErrorMessage(err, "Could not load menu."));
    } finally {
      setBusy(false);
    }
  }, [tab]);

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
      const payload = normalizeDraft({ ...draft, isPublished: published });
      await upsertEditableMenu(db, tab, payload);
      setMessage("Saved. Guests only see published menus.");
    } catch (err) {
      console.error(err);
      setError(unknownErrorMessage(err, "Save failed."));
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
      const payload = normalizeDraft({ ...draft, isPublished: true });
      await upsertEditableMenu(db, tab, payload);
      setPublished(true);
      setMessage("Published — visible on the website.");
    } catch (err) {
      console.error(err);
      setError(unknownErrorMessage(err, "Publish failed."));
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
      setMessage("Unpublished — hidden from guests (draft kept).");
    } catch (err) {
      console.error(err);
      setError(unknownErrorMessage(err, "Unpublish failed."));
    } finally {
      setBusy(false);
    }
  }

  function addCategory() {
    setDraft((d) => {
      const next = normalizeDraft(d);
      next.categories.push({
        position: next.categories.length,
        title: `Section ${next.categories.length + 1}`,
        items: [
          {
            position: 0,
            name: "",
            description: "",
            price: "",
            dietaryTagIds: [],
          },
        ],
      });
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
    setDraft((d) => {
      const next = normalizeDraft(d);
      const cat = next.categories[ci];
      if (!cat) return next;
      cat.items.push({
        position: cat.items.length,
        name: "",
        description: "",
        price: "",
        dietaryTagIds: [],
      });
      return normalizeDraft(next);
    });
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

  function removeItem(ci: number, ii: number) {
    setDraft((d) => {
      const next = normalizeDraft(d);
      const cat = next.categories[ci];
      if (!cat) return next;
      cat.items.splice(ii, 1);
      return normalizeDraft(next);
    });
  }

  const tabLabel = useMemo(() => TABS.find((x) => x.kind === tab)?.label ?? tab, [tab]);

  if (!ready || !user) {
    return (
      <PageShell title="Menus" intro="Loading…">
        <p className="text-sm text-paper/70">Checking sign-in…</p>
      </PageShell>
    );
  }

  return (
    <PageShell
      title="Menus"
      intro="Choose à la carte, drinks, or brunch. Save keeps your draft; Publish shows it on the site."
      maxWidthClassName="w-full max-w-[min(100%,112rem)]"
    >
      <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-3">
          <Link
            href="/admin/dashboard"
            className={`inline-flex items-center justify-center ${adminBtnNeutral}`}
          >
            Dashboard
          </Link>
          <button
            type="button"
            className={`inline-flex items-center justify-center ${adminBtnNeutral}`}
            onClick={() => void load()}
            disabled={busy}
          >
            <span className="inline-flex items-center gap-2">
              <RefreshCcw className="size-4" aria-hidden />
              Reload
            </span>
          </button>
        </div>
        <button type="button" className={adminBtnSignOut} onClick={onLogout} disabled={busy}>
          <span className="inline-flex items-center gap-2">
            <LogOut className="size-4" aria-hidden />
            Sign out
          </span>
        </button>
      </div>

      <div className="mb-8 flex flex-wrap gap-2 border-b border-border pb-4">
        {TABS.map(({ kind, label }) => (
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
            {label}
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
        <div className="rounded-none border border-border bg-paper-dark/35 p-6">
          <h2 className="font-display text-xl font-medium text-paper">Status · {tabLabel}</h2>
          <p className="mt-3 text-sm text-paper/65 leading-relaxed">
            Unpublished menus fall back to demo content on the public site until you publish.
          </p>
          <div className="mt-6 space-y-2 text-sm">
            <p>
              <span className="text-paper/60">Published:</span>{" "}
              <span className="font-semibold text-paper">{published ? "Yes" : "No"}</span>
            </p>
          </div>
          <div className="mt-8 flex flex-col gap-3">
            <button type="button" className={`w-full ${adminBtnGreen}`} onClick={() => void onPublish()} disabled={busy}>
              <span className="inline-flex items-center justify-center gap-2">
                <Upload className="size-4" aria-hidden />
                Publish
              </span>
            </button>
            <button
              type="button"
              className={`w-full ${adminBtnCaution}`}
              onClick={() => void onUnpublish()}
              disabled={busy || !published}
            >
              Unpublish
            </button>
          </div>
        </div>

        <div className="rounded-none border border-border bg-paper-dark/35 p-6">
          <label className="block text-sm font-medium text-paper">Menu title (shown on the page when set)</label>
          <input
            value={draft.title}
            onChange={(e) => setDraft((d) => ({ ...d, title: e.target.value }))}
            placeholder='e.g. "Spring à la carte"'
            className="mt-2 w-full rounded-none border border-paper/15 bg-paper/8 px-3 py-2 text-paper shadow-sm placeholder:text-paper/40 focus:border-gold/45 focus:outline-none focus:ring-1 focus:ring-gold/20"
            disabled={busy}
          />

          <div className="mt-10 space-y-12">
            {draft.categories.map((cat, ci) => (
              <section key={ci} className="border-t border-border pt-10 first:border-t-0 first:pt-0">
                <div className="flex flex-wrap items-end justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <label className="block text-sm font-medium text-paper">Section title</label>
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
                  </div>
                  <button
                    type="button"
                    className={`inline-flex items-center gap-2 ${adminBtnCaution}`}
                    onClick={() => removeCategory(ci)}
                    disabled={busy || draft.categories.length <= 1}
                  >
                    <Trash2 className="size-4" aria-hidden />
                    Remove section
                  </button>
                </div>

                <div className="mt-8 space-y-10">
                  {cat.items.map((item, ii) => (
                    <div key={ii} className="rounded-none border border-paper/10 bg-paper/5 p-4">
                      <div className="mb-4 flex justify-end">
                        <button
                          type="button"
                          className={`inline-flex items-center gap-2 text-xs ${adminBtnNeutral}`}
                          onClick={() => removeItem(ci, ii)}
                          disabled={busy || cat.items.length <= 1}
                        >
                          <Trash2 className="size-3.5" aria-hidden />
                          Remove dish
                        </button>
                      </div>
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="sm:col-span-2">
                          <label className="block text-sm font-medium text-paper">Name</label>
                          <input
                            value={item.name}
                            onChange={(e) =>
                              setDraft((d) => {
                                const next = normalizeDraft(d);
                                const it = next.categories[ci]?.items[ii];
                                if (it) it.name = e.target.value;
                                return next;
                              })
                            }
                            className="mt-2 w-full rounded-none border border-paper/15 bg-paper/8 px-3 py-2 text-paper shadow-sm focus:border-gold/45 focus:outline-none focus:ring-1 focus:ring-gold/20"
                            disabled={busy}
                          />
                        </div>
                        <div className="sm:col-span-2">
                          <label className="block text-sm font-medium text-paper">Description</label>
                          <textarea
                            value={item.description}
                            onChange={(e) =>
                              setDraft((d) => {
                                const next = normalizeDraft(d);
                                const it = next.categories[ci]?.items[ii];
                                if (it) it.description = e.target.value;
                                return next;
                              })
                            }
                            rows={3}
                            className="mt-2 w-full rounded-none border border-paper/15 bg-paper/8 px-3 py-2 text-paper shadow-sm focus:border-gold/45 focus:outline-none focus:ring-1 focus:ring-gold/20"
                            disabled={busy}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-paper">Price</label>
                          <input
                            value={item.price}
                            onChange={(e) =>
                              setDraft((d) => {
                                const next = normalizeDraft(d);
                                const it = next.categories[ci]?.items[ii];
                                if (it) it.price = e.target.value;
                                return next;
                              })
                            }
                            placeholder="e.g. 24 or €24"
                            className="mt-2 w-full rounded-none border border-paper/15 bg-paper/8 px-3 py-2 text-paper shadow-sm focus:border-gold/45 focus:outline-none focus:ring-1 focus:ring-gold/20"
                            disabled={busy}
                          />
                        </div>
                        <div className="sm:col-span-2">
                          <p className="block text-sm font-medium text-paper">Dietary tags</p>
                          <p className="mt-0.5 text-xs text-paper/55">
                            {tab === "drinks"
                              ? "Optional — e.g. alcohol-free mocktails, gluten-free beer, vegan or dairy-free ingredients."
                              : "Optional — select any that apply."}
                          </p>
                          <div className="mt-3 flex flex-wrap gap-2">
                            {dietaryTagOptions.map((opt) => {
                              const selected = item.dietaryTagIds.includes(opt.id);
                              const Icon = opt.Icon;
                              return (
                                <button
                                  key={opt.id}
                                  type="button"
                                  disabled={busy}
                                  aria-pressed={selected}
                                  onClick={() => toggleDietaryTag(ci, ii, opt.id)}
                                  className={[
                                    "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-2 text-left text-xs font-semibold tracking-[0.06em] uppercase transition-colors",
                                    selected
                                      ? opt.pillClass
                                      : "border-dashed border-paper/20 bg-paper/5 text-paper/45 hover:border-paper/35 hover:bg-paper/10 hover:text-paper/75",
                                  ].join(" ")}
                                >
                                  <Icon className="size-3.5 shrink-0" strokeWidth={2} aria-hidden />
                                  {opt.label}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  className={`mt-6 inline-flex items-center gap-2 ${adminBtnNeutral}`}
                  onClick={() => addItem(ci)}
                  disabled={busy}
                >
                  <Plus className="size-4" aria-hidden />
                  Add dish
                </button>
              </section>
            ))}
          </div>

          <button
            type="button"
            className={`mt-10 inline-flex items-center gap-2 ${adminBtnNeutral}`}
            onClick={addCategory}
            disabled={busy}
          >
            <Plus className="size-4" aria-hidden />
            Add section
          </button>

          <div className="mt-10">
            <button type="button" className={`w-full ${adminBtnBlue}`} onClick={() => void onSave()} disabled={busy}>
              <span className="inline-flex items-center justify-center gap-2">
                <Save className="size-4" aria-hidden />
                Save changes
              </span>
            </button>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
