"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useAdminAuth } from "@/components/admin/AdminAuthProvider";
import { PageShell } from "@/components/layout/PageShell";
import {
  adminBtnCaution,
  adminBtnGreen,
  adminBtnNeutral,
  adminCalloutSuccess,
} from "@/lib/adminUiStyles";
import { LUNCH_DISH_SLOT_LABELS } from "@/lib/lunchDishSlots";
import { getMadridWeekStartYmd } from "@/lib/madridWeek";
import { addDaysToYmd, formatYmdLongEnglish } from "@/lib/madridMonday";
import type { WeeklyMenu } from "@/lib/weeklyMenuTypes";
import { getFirebaseFirestore } from "@/lib/firebase/client";
import { readWeeklyMenuCurrent, setWeeklyMenuCurrentPublished, upsertWeeklyMenuCurrent } from "@/lib/firebase/weeklyMenuStore";
import { unknownErrorMessage } from "@/lib/unknownErrorMessage";

type DishDraft = {
  title: string;
  description: string;
  price: string;
  dietaryTags: string;
};

type ScheduleMode = "nextMonday" | "immediate";

function emptyDishes(): DishDraft[] {
  return Array.from({ length: 5 }, () => ({
    title: "",
    description: "",
    price: "",
    dietaryTags: "",
  }));
}

function dishesFromMenu(menu: WeeklyMenu): DishDraft[] {
  const base = emptyDishes();
  const sorted = [...(menu.items ?? [])].sort((a, b) => a.position - b.position);
  for (let i = 0; i < 5; i++) {
    const it = sorted.find((x) => x.position === i + 1);
    base[i] = {
      title: it?.name ?? "",
      description: it?.description ?? "",
      price: it?.price ?? "",
      dietaryTags: it?.dietaryTags ?? "",
    };
  }
  return base;
}

export function LunchMenuAdminPage() {
  const router = useRouter();
  const { user, ready, signOutUser } = useAdminAuth();
  const madridMonday = useMemo(() => getMadridWeekStartYmd(), []);
  const nextMondayYmd = useMemo(() => addDaysToYmd(madridMonday, 7), [madridMonday]);
  const nextMondayLabel = useMemo(() => formatYmdLongEnglish(nextMondayYmd), [nextMondayYmd]);

  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const [scheduleMode, setScheduleMode] = useState<ScheduleMode>("nextMonday");
  const [title, setTitle] = useState("");
  const [dishes, setDishes] = useState<DishDraft[]>(() => emptyDishes());
  const [published, setPublished] = useState(false);
  const [updatedAt, setUpdatedAt] = useState<string | null>(null);
  const [visibleOnSiteNow, setVisibleOnSiteNow] = useState(false);

  async function load() {
    setError(null);
    setMessage(null);
    setBusy(true);
    try {
      const db = getFirebaseFirestore();
      const menu = await readWeeklyMenuCurrent(db);
      if (!menu) {
        // First run: keep current UI state (empty draft) but set a sensible schedule.
        setScheduleMode("nextMonday");
        setPublished(false);
        setUpdatedAt(null);
        setVisibleOnSiteNow(false);
        return;
      }
      setTitle(menu.title ?? "");
      setPublished(Boolean(menu.isPublished));
      setUpdatedAt(menu.updatedAtUtc ?? null);
      const eff = menu.effectiveWeekStartDate || menu.weekStartDate || madridMonday;
      setScheduleMode(eff === madridMonday ? "immediate" : "nextMonday");
      setDishes(dishesFromMenu(menu));
      setVisibleOnSiteNow(Boolean(menu.isPublished) && eff === madridMonday);
    } catch (err) {
      console.error(err);
      setError(unknownErrorMessage(err, "Could not load lunch menu from Firestore."));
    } finally {
      setBusy(false);
    }
  }

  useEffect(() => {
    if (!ready || !user) return;
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready, user]);

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
      const missingTitle = dishes.findIndex((d) => !d.title?.trim());
      if (missingTitle !== -1) {
        setError(
          `Add a dish title for each row (missing on "${LUNCH_DISH_SLOT_LABELS[missingTitle]}").`,
        );
        return;
      }

      const effectiveYmd = scheduleMode === "immediate" ? madridMonday : nextMondayYmd;

      const items = dishes.map((d, idx) => ({
        position: idx + 1,
        name: d.title.trim(),
        description: d.description?.trim() ?? "",
        price: d.price?.trim() ?? "",
        dietaryTags: d.dietaryTags?.trim() ?? "",
      }));

      const db = getFirebaseFirestore();
      const menu: WeeklyMenu = {
        weekStartDate: effectiveYmd,
        effectiveWeekStartDate: effectiveYmd,
        title,
        isPublished: published,
        updatedAtUtc: "",
        items,
      };
      await upsertWeeklyMenuCurrent(db, menu);
      setUpdatedAt(null);
      setVisibleOnSiteNow(Boolean(menu.isPublished) && effectiveYmd === madridMonday);
      setMessage("Saved as a draft. Guests won’t see it until you click “Publish”.");
    } catch (err) {
      console.error(err);
      setError(unknownErrorMessage(err, "Save failed."));
    } finally {
      setBusy(false);
    }
  }

  async function onPublish(nextPublished: boolean) {
    setError(null);
    setMessage(null);
    setBusy(true);
    try {
      const db = getFirebaseFirestore();
      await setWeeklyMenuCurrentPublished(db, nextPublished);
      setPublished(nextPublished);
      const effectiveYmd = scheduleMode === "immediate" ? madridMonday : nextMondayYmd;
      setVisibleOnSiteNow(Boolean(nextPublished) && effectiveYmd === madridMonday);
      setMessage(nextPublished ? "Published." : "Unpublished (hidden from guests).");
    } catch (err) {
      console.error(err);
      setError(unknownErrorMessage(err, "Publish failed."));
    } finally {
      setBusy(false);
    }
  }

  if (!ready || !user) {
    return (
      <PageShell title="Lunch menu" intro="Loading…">
        <p className="text-sm text-ink-muted">Checking sign-in…</p>
      </PageShell>
    );
  }

  const effectiveYmdForDisplay = scheduleMode === "immediate" ? madridMonday : nextMondayYmd;

  return (
    <PageShell
      title="Lunch menu"
      intro="Update the 5 dishes, then publish when ready."
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
            Reload
          </button>
        </div>
        <button
          type="button"
          className={`inline-flex items-center justify-center ${adminBtnNeutral}`}
          onClick={onLogout}
          disabled={busy}
        >
          Sign out
        </button>
      </div>

      {error ? (
        <div className="mb-4 rounded-none border border-red-500/30 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      ) : null}
      {message ? (
        <div className={`mb-4 ${adminCalloutSuccess}`}>
          {message}
        </div>
      ) : null}

      <div className="grid gap-4 lg:grid-cols-3">
        <div
          className={`rounded-none border border-slate-300 bg-paper p-6 lg:col-span-1 ${
            visibleOnSiteNow && published
              ? "border-l-4 border-l-emerald-600"
              : "border-l-4 border-l-slate-400"
          }`}
        >
          <h2 className="font-display text-2xl font-medium text-ink">Status</h2>
          <p className="mt-3 text-sm text-ink-muted leading-relaxed">Guests see this only after you publish.</p>
          <div className="mt-6 space-y-2 text-sm">
            <p>
              <span className="text-ink-muted">Published:</span>{" "}
              <span className="font-semibold text-ink">{published ? "Yes" : "No"}</span>
            </p>
            <p>
              <span className="text-ink-muted">Website timing:</span>{" "}
              <span className="font-semibold text-ink">
                {scheduleMode === "immediate" ? "Immediately (this week)" : `Next Monday (${nextMondayYmd})`}
              </span>
            </p>
            <p>
              <span className="text-ink-muted">Effective Monday (saved):</span>{" "}
              <span className="font-mono font-semibold text-ink">{effectiveYmdForDisplay}</span>
            </p>
            <p>
              <span className="text-ink-muted">Today’s Madrid week start:</span>{" "}
              <span className="font-semibold text-ink">{madridMonday}</span>
            </p>
            <p>
              <span className="text-ink-muted">Visible on website now:</span>{" "}
              <span
                className={`font-semibold ${visibleOnSiteNow ? "text-emerald-800" : "text-slate-600"}`}
              >
                {visibleOnSiteNow ? "Yes — live" : "No"}
              </span>
            </p>
            {updatedAt ? (
              <p className="text-xs text-ink-muted">Last updated: {new Date(updatedAt).toLocaleString()}</p>
            ) : null}
          </div>

          <div className="mt-8 flex flex-col gap-3">
            <button
              type="button"
              className={`w-full ${adminBtnGreen}`}
              onClick={() => void onPublish(true)}
              disabled={busy || published}
            >
              Publish
            </button>
            <button
              type="button"
              className={`w-full ${adminBtnCaution}`}
              onClick={() => void onPublish(false)}
              disabled={busy || !published}
            >
              Unpublish
            </button>
          </div>
        </div>

        <div className="rounded-none border border-slate-300 bg-paper p-6 lg:col-span-2">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-ink">Optional title</label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder='Example: "This week at El Portero"'
                className="mt-2 w-full rounded-none border border-border bg-paper px-3 py-2 text-ink shadow-sm focus:border-ink/35 focus:outline-none focus:ring-1 focus:ring-ink/20"
                disabled={busy}
              />
            </div>

            <div className="sm:col-span-2">
              <p className="block text-sm font-medium text-ink">When should this appear on the website?</p>
              <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => setScheduleMode("nextMonday")}
                  className={`flex-1 rounded-none border px-4 py-4 text-left transition-colors disabled:opacity-50 ${
                    scheduleMode === "nextMonday"
                      ? "border-sky-700 bg-sky-100 text-sky-950 shadow-md ring-2 ring-sky-500/50"
                      : "border-slate-300 bg-white text-ink hover:border-sky-400 hover:bg-sky-50/50"
                  }`}
                >
                  <span className="text-xs font-semibold tracking-[0.22em] uppercase text-sky-900">Recommended</span>
                  <span className="mt-2 block font-display text-lg font-medium leading-snug">
                    Next Monday
                    <span className="mt-1 block font-sans text-sm font-normal text-sky-900/85">
                      {nextMondayLabel} ({nextMondayYmd})
                    </span>
                  </span>
                </button>
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => setScheduleMode("immediate")}
                  className={`flex-1 rounded-none border px-4 py-4 text-left transition-colors disabled:opacity-50 ${
                    scheduleMode === "immediate"
                      ? "border-amber-700 bg-amber-100 text-amber-950 shadow-md ring-2 ring-amber-500/50"
                      : "border-dashed border-slate-300 bg-amber-50/30 text-ink-muted hover:border-amber-400 hover:bg-amber-50/60 hover:text-ink"
                  }`}
                >
                  <span className="text-xs font-semibold tracking-[0.22em] uppercase text-amber-900">
                    Emergency / fix
                  </span>
                  <span className="mt-2 block font-display text-lg font-medium leading-snug text-amber-950">
                    Immediately
                    <span className="mt-1 block font-sans text-sm font-normal text-amber-900/80">
                      Use only for urgent fixes
                    </span>
                  </span>
                </button>
              </div>
            </div>
          </div>

          <div className="mt-10 space-y-8">
            {LUNCH_DISH_SLOT_LABELS.map((slotLabel, idx) => (
              <section key={slotLabel} className="border-t border-border pt-8 first:border-t-0 first:pt-0">
                <h3 className="font-display text-2xl font-medium text-ink">{slotLabel}</h3>

                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-ink">Dish title (what guests see)</label>
                    <input
                      value={dishes[idx]?.title ?? ""}
                      onChange={(e) =>
                        setDishes((d) => {
                          const next = [...d];
                          next[idx] = { ...next[idx], title: e.target.value };
                          return next;
                        })
                      }
                      placeholder='Example: "Spaghetti carbonara"'
                      className="mt-2 w-full rounded-none border border-border bg-paper px-3 py-2 text-ink shadow-sm focus:border-ink/35 focus:outline-none focus:ring-1 focus:ring-ink/20"
                      disabled={busy}
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-ink">Description</label>
                    <textarea
                      value={dishes[idx]?.description ?? ""}
                      onChange={(e) =>
                        setDishes((d) => {
                          const next = [...d];
                          next[idx] = { ...next[idx], description: e.target.value };
                          return next;
                        })
                      }
                      rows={3}
                      className="mt-2 w-full rounded-none border border-border bg-paper px-3 py-2 text-ink shadow-sm focus:border-ink/35 focus:outline-none focus:ring-1 focus:ring-ink/20"
                      disabled={busy}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-ink">Price (optional)</label>
                    <input
                      value={dishes[idx]?.price ?? ""}
                      onChange={(e) =>
                        setDishes((d) => {
                          const next = [...d];
                          next[idx] = { ...next[idx], price: e.target.value };
                          return next;
                        })
                      }
                      className="mt-2 w-full rounded-none border border-border bg-paper px-3 py-2 text-ink shadow-sm focus:border-ink/35 focus:outline-none focus:ring-1 focus:ring-ink/20"
                      disabled={busy}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-ink">Tags (optional)</label>
                    <input
                      value={dishes[idx]?.dietaryTags ?? ""}
                      onChange={(e) =>
                        setDishes((d) => {
                          const next = [...d];
                          next[idx] = { ...next[idx], dietaryTags: e.target.value };
                          return next;
                        })
                      }
                      placeholder="GF, V, etc."
                      className="mt-2 w-full rounded-none border border-border bg-paper px-3 py-2 text-ink shadow-sm focus:border-ink/35 focus:outline-none focus:ring-1 focus:ring-ink/20"
                      disabled={busy}
                    />
                  </div>
                </div>
              </section>
            ))}
          </div>

          <div className="mt-10 space-y-2">
            <button
              type="button"
              className={`w-full ${adminBtnGreen}`}
              onClick={() => void onSave()}
              disabled={busy}
            >
              Save draft
            </button>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
