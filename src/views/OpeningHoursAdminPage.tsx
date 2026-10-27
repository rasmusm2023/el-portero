"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { LayoutDashboard, Loader2, LogOut, RefreshCcw, Save } from "lucide-react";
import { useAdminAuth } from "@/components/admin/AdminAuthProvider";
import {
  DeskNotice,
  deskField,
  deskGhost,
  deskHint,
  deskLabel,
  deskPanel,
  deskPrimary,
  deskTimeSelect,
} from "@/components/admin/events/EventsDesk";
import { PageShell } from "@/components/layout/PageShell";
import { t, type Locale, type MessageKey } from "@/i18n/strings";
import { useLocale } from "@/i18n/useLocale";
import { getFirebaseFirestore } from "@/lib/firebase/client";
import {
  readOpeningHours,
  setOpeningHoursPublished,
  upsertOpeningHours,
} from "@/lib/firebase/openingHoursStore";
import {
  DEFAULT_OPENING_HOURS,
  normalizeDaySchedule,
  normalizeOpeningHours,
  openingHoursSnapshot,
  OPENING_HOURS_DAY_KEYS,
  type OpeningHoursDayKey,
  type OpeningHoursDoc,
} from "@/lib/openingHoursTypes";
import { OPENING_HOURS_TIME_OPTIONS } from "@/lib/openingHoursTimeOptions";
import { unknownErrorMessage } from "@/lib/unknownErrorMessage";

const DAY_ADMIN_LABEL_KEYS: Record<OpeningHoursDayKey, MessageKey> = {
  mon: "admin.openingHours.day.mon",
  tue: "admin.openingHours.day.tue",
  wed: "admin.openingHours.day.wed",
  thu: "admin.openingHours.day.thu",
  fri: "admin.openingHours.day.fri",
  sat: "admin.openingHours.day.sat",
  sun: "admin.openingHours.day.sun",
};

function dayAdminLabel(locale: Locale, dayKey: OpeningHoursDayKey): string {
  return t(locale, DAY_ADMIN_LABEL_KEYS[dayKey]);
}

function patchSnapshotPublished(snapshot: string | null, isPublished: boolean): string | null {
  if (!snapshot) return snapshot;
  try {
    const parsed = JSON.parse(snapshot) as OpeningHoursDoc;
    return openingHoursSnapshot({ ...parsed, isPublished });
  } catch {
    return snapshot;
  }
}

function patchDayRow(
  draft: OpeningHoursDoc,
  dayKey: OpeningHoursDayKey,
  patch: Partial<{ closed: boolean; open: string; close: string }>,
): OpeningHoursDoc {
  const next = normalizeOpeningHours(draft);
  const target = next.rows.find((r) => r.dayKey === dayKey);
  if (!target) return next;
  Object.assign(target, normalizeDaySchedule({ ...target, ...patch }));
  return next;
}

export function OpeningHoursAdminPage() {
  const router = useRouter();
  const { locale } = useLocale();
  const { user, ready, signOutUser } = useAdminAuth();

  const [draft, setDraft] = useState<OpeningHoursDoc>(() => DEFAULT_OPENING_HOURS);
  const [published, setPublished] = useState(false);
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [savedSnapshot, setSavedSnapshot] = useState<string | null>(null);

  const load = useCallback(async () => {
    setError(null);
    setMessage(null);
    setBusy(true);
    setLoading(true);
    try {
      const db = getFirebaseFirestore();
      const existing = await readOpeningHours(db);
      if (existing) {
        const normalized = normalizeOpeningHours(existing);
        const pub = Boolean(existing.isPublished);
        setDraft(normalized);
        setPublished(pub);
        setSavedSnapshot(openingHoursSnapshot({ ...normalized, isPublished: pub }));
      } else {
        setDraft(DEFAULT_OPENING_HOURS);
        setPublished(false);
        setSavedSnapshot(openingHoursSnapshot(DEFAULT_OPENING_HOURS));
      }
    } catch (err) {
      console.error(err);
      setError(unknownErrorMessage(err, t(locale, "admin.openingHours.loadError")));
    } finally {
      setBusy(false);
      setLoading(false);
    }
  }, [locale]);

  useEffect(() => {
    if (!ready || !user) return;
    void load();
  }, [ready, user, load]);

  const hasUnsavedChanges = useMemo(() => {
    if (savedSnapshot === null) return false;
    return openingHoursSnapshot({ ...draft, isPublished: published }) !== savedSnapshot;
  }, [draft, published, savedSnapshot]);

  const saveEnabled = !busy && hasUnsavedChanges;

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
      const payload = normalizeOpeningHours({ ...draft, isPublished: published });
      await upsertOpeningHours(db, payload);
      setSavedSnapshot(openingHoursSnapshot(payload));
      setMessage(t(locale, "admin.openingHours.saved"));
    } catch (err) {
      console.error(err);
      setError(unknownErrorMessage(err, t(locale, "admin.openingHours.saveError")));
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
      const payload = normalizeOpeningHours({ ...draft, isPublished: true });
      await upsertOpeningHours(db, payload);
      setPublished(true);
      setSavedSnapshot(openingHoursSnapshot(payload));
      setMessage(t(locale, "admin.openingHours.publishedSuccess"));
    } catch (err) {
      console.error(err);
      setError(unknownErrorMessage(err, t(locale, "admin.openingHours.publishError")));
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
      await setOpeningHoursPublished(db, false);
      setPublished(false);
      setSavedSnapshot((prev) => patchSnapshotPublished(prev, false));
      setMessage(t(locale, "admin.openingHours.unpublishedSuccess"));
    } catch (err) {
      console.error(err);
      setError(unknownErrorMessage(err, t(locale, "admin.openingHours.unpublishError")));
    } finally {
      setBusy(false);
    }
  }

  if (!ready || !user) {
    return (
      <PageShell
        tone="admin"
        title={t(locale, "admin.openingHours.title")}
        intro={t(locale, "admin.openingHours.intro")}
      >
        <p className={deskHint}>{t(locale, "admin.checkingSignIn")}</p>
      </PageShell>
    );
  }

  return (
    <PageShell
      tone="admin"
      title={t(locale, "admin.openingHours.title")}
      intro={t(locale, "admin.openingHours.intro")}
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
        <button type="button" className={deskGhost} onClick={() => void onLogout()} disabled={busy}>
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
        <div className="grid min-w-0 items-start gap-6 xl:grid-cols-12 xl:gap-8">
          <aside className="min-w-0 xl:sticky xl:top-[calc(var(--header-h)+1rem)] xl:col-span-4 xl:self-start 2xl:col-span-3">
            <div className={deskPanel}>
              <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3.5">
                <p className="text-xs font-medium text-slate-500">
                  {t(locale, "admin.openingHours.statusTitle")}
                </p>
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
                  {t(locale, "admin.openingHours.statusIntro")}
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
              <p
                className={`mt-3 text-sm ${hasUnsavedChanges ? "font-medium text-amber-700" : "text-slate-500"}`}
              >
                {hasUnsavedChanges
                  ? t(locale, "admin.menus.unsavedChanges")
                  : t(locale, "admin.menus.allSaved")}
              </p>
            </div>
          </aside>

          <div className="min-w-0 xl:col-span-8 2xl:col-span-9">
            <div className={deskPanel}>
              <h2 className="text-base font-semibold text-slate-900">
                {t(locale, "admin.openingHours.scheduleTitle")}
              </h2>
              <p className={`mt-1 max-w-2xl ${deskHint}`}>
                {t(locale, "admin.openingHours.scheduleIntro")}
              </p>

              <ul className="mt-6 space-y-3">
                {OPENING_HOURS_DAY_KEYS.map((dayKey) => {
                  const row = draft.rows.find((r) => r.dayKey === dayKey);
                  if (!row) return null;
                  const dayName = dayAdminLabel(locale, dayKey);
                  return (
                    <li
                      key={dayKey}
                      className="rounded-lg border border-slate-200 bg-slate-50 p-3 sm:p-4"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <p className="text-sm font-semibold text-slate-900">{dayName}</p>
                        <p className="flex items-center gap-2 text-sm text-slate-600">
                          <span
                            className={`size-2 shrink-0 rounded-full ${
                              row.closed ? "bg-slate-400" : "bg-emerald-500"
                            }`}
                            aria-hidden
                          />
                          {row.closed ? (
                            t(locale, "admin.openingHours.statusClosed")
                          ) : (
                            <span className="tabular-nums">
                              {row.open}
                              <span className="px-1.5 text-slate-300" aria-hidden>
                                —
                              </span>
                              {row.close}
                            </span>
                          )}
                        </p>
                      </div>
                      <div className="mt-4 flex flex-wrap items-end gap-3">
                        <div className="w-full sm:w-36">
                          <label className={deskLabel} htmlFor={`oh-status-${dayKey}`}>
                            {t(locale, "admin.openingHours.dayStatus")}
                          </label>
                          <select
                            id={`oh-status-${dayKey}`}
                            value={row.closed ? "closed" : "open"}
                            onChange={(e) =>
                              setDraft((d) =>
                                patchDayRow(d, dayKey, { closed: e.target.value === "closed" }),
                              )
                            }
                            className={`${deskField} cursor-pointer`}
                            disabled={busy}
                          >
                            <option value="open">{t(locale, "admin.openingHours.statusOpen")}</option>
                            <option value="closed">{t(locale, "admin.openingHours.statusClosed")}</option>
                          </select>
                        </div>
                        <div className={row.closed ? "opacity-45" : undefined}>
                          <label className={deskLabel} htmlFor={`oh-open-${dayKey}`}>
                            {t(locale, "admin.openingHours.openFrom")}
                          </label>
                          <select
                            id={`oh-open-${dayKey}`}
                            value={row.open}
                            onChange={(e) =>
                              setDraft((d) => patchDayRow(d, dayKey, { open: e.target.value }))
                            }
                            className={deskTimeSelect}
                            disabled={busy || row.closed}
                          >
                            {OPENING_HOURS_TIME_OPTIONS.map((time) => (
                              <option key={time} value={time}>
                                {time}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className={row.closed ? "opacity-45" : undefined}>
                          <label className={deskLabel} htmlFor={`oh-close-${dayKey}`}>
                            {t(locale, "admin.openingHours.openUntil")}
                          </label>
                          <select
                            id={`oh-close-${dayKey}`}
                            value={row.close}
                            onChange={(e) =>
                              setDraft((d) => patchDayRow(d, dayKey, { close: e.target.value }))
                            }
                            className={deskTimeSelect}
                            disabled={busy || row.closed}
                          >
                            {OPENING_HOURS_TIME_OPTIONS.map((time) => (
                              <option key={time} value={time}>
                                {time}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </div>
      )}
    </PageShell>
  );
}
