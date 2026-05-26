"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Clock, LayoutDashboard, LogOut, RefreshCcw, Save, Upload } from "lucide-react";
import { useAdminAuth } from "@/components/admin/AdminAuthProvider";
import { PageShell } from "@/components/layout/PageShell";
import { t, type Locale, type MessageKey } from "@/i18n/strings";
import { useLocale } from "@/i18n/useLocale";
import {
  adminBtnBlue,
  adminBtnCaution,
  adminBtnGreen,
  adminBtnNeutral,
  adminBtnSignOut,
  adminCalloutSuccess,
  adminTextMuted,
} from "@/lib/adminUiStyles";
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

const fieldSelectClass =
  "w-full rounded-none border border-paper/15 bg-paper/8 px-3 py-2 text-sm text-paper shadow-sm transition-shadow focus:border-gold/45 focus:outline-none focus:ring-1 focus:ring-gold/20 disabled:cursor-not-allowed disabled:bg-paper/6 disabled:text-paper/45";

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
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [savedSnapshot, setSavedSnapshot] = useState<string | null>(null);

  const load = useCallback(async () => {
    setError(null);
    setMessage(null);
    setBusy(true);
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
      setSavedSnapshot(
        openingHoursSnapshot(normalizeOpeningHours({ ...draft, isPublished: false })),
      );
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
      <PageShell title={t(locale, "admin.openingHours.title")} intro={t(locale, "admin.loading")}>
        <p className={`text-sm ${adminTextMuted}`}>{t(locale, "admin.checkingSignIn")}</p>
      </PageShell>
    );
  }

  return (
    <PageShell
      title={t(locale, "admin.openingHours.title")}
      intro={<p className={adminTextMuted}>{t(locale, "admin.openingHours.intro")}</p>}
      maxWidthClassName="w-full max-w-[min(100%,112rem)]"
    >
      <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-3">
          <Link href="/admin/dashboard" className={`inline-flex items-center justify-center ${adminBtnNeutral}`}>
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
        <button type="button" className={adminBtnSignOut} onClick={() => void onLogout()} disabled={busy}>
          <span className="inline-flex items-center gap-2">
            <LogOut className="size-4" aria-hidden />
            {t(locale, "admin.signOut")}
          </span>
        </button>
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
              {t(locale, "admin.openingHours.statusTitle")}
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-paper/65">
              {t(locale, "admin.openingHours.statusIntro")}
            </p>
            <div className="mt-6 text-sm">
              <p>
                <span className="text-paper/60">{t(locale, "admin.menus.publishedLabel")}</span>{" "}
                <span className="font-semibold text-paper">
                  {published ? t(locale, "admin.menus.yes") : t(locale, "admin.menus.no")}
                </span>
              </p>
            </div>
            <div className="mt-8 flex flex-col gap-3">
              <button
                type="button"
                className={`w-full ${adminBtnGreen}`}
                onClick={() => void onPublish()}
                disabled={busy}
              >
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
          <div className="flex items-start gap-3 border-b border-paper/10 pb-6">
            <Clock className="mt-0.5 size-5 shrink-0 text-paper/70" aria-hidden />
            <div>
              <h2 className="font-display text-xl font-medium text-paper">
                {t(locale, "admin.openingHours.scheduleTitle")}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-paper/65">
                {t(locale, "admin.openingHours.scheduleIntro")}
              </p>
            </div>
          </div>

          <ul className="mt-10 space-y-5">
            {OPENING_HOURS_DAY_KEYS.map((dayKey) => {
              const row = draft.rows.find((r) => r.dayKey === dayKey);
              if (!row) return null;
              return (
                <li
                  key={dayKey}
                  className="grid gap-3 border-b border-paper/10 pb-5 last:border-b-0 last:pb-0 sm:grid-cols-[minmax(0,8rem)_minmax(0,9rem)_minmax(0,1fr)_minmax(0,1fr)] sm:items-end sm:gap-4"
                >
                  <span className="text-sm font-semibold tracking-wide text-paper uppercase sm:pb-2">
                    {dayAdminLabel(locale, dayKey)}
                  </span>
                  <div>
                    <label className="sr-only" htmlFor={`oh-status-${dayKey}`}>
                      {t(locale, "admin.openingHours.dayStatus")} — {dayAdminLabel(locale, dayKey)}
                    </label>
                    <select
                      id={`oh-status-${dayKey}`}
                      value={row.closed ? "closed" : "open"}
                      onChange={(e) =>
                        setDraft((d) =>
                          patchDayRow(d, dayKey, { closed: e.target.value === "closed" }),
                        )
                      }
                      className={fieldSelectClass}
                      disabled={busy}
                    >
                      <option value="open">{t(locale, "admin.openingHours.statusOpen")}</option>
                      <option value="closed">{t(locale, "admin.openingHours.statusClosed")}</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-paper/60" htmlFor={`oh-open-${dayKey}`}>
                      {t(locale, "admin.openingHours.openFrom")}
                    </label>
                    <select
                      id={`oh-open-${dayKey}`}
                      value={row.open}
                      onChange={(e) => setDraft((d) => patchDayRow(d, dayKey, { open: e.target.value }))}
                      className={`${fieldSelectClass} mt-1`}
                      disabled={busy || row.closed}
                    >
                      {OPENING_HOURS_TIME_OPTIONS.map((time) => (
                        <option key={time} value={time}>
                          {time}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-paper/60" htmlFor={`oh-close-${dayKey}`}>
                      {t(locale, "admin.openingHours.openUntil")}
                    </label>
                    <select
                      id={`oh-close-${dayKey}`}
                      value={row.close}
                      onChange={(e) => setDraft((d) => patchDayRow(d, dayKey, { close: e.target.value }))}
                      className={`${fieldSelectClass} mt-1`}
                      disabled={busy || row.closed}
                    >
                      {OPENING_HOURS_TIME_OPTIONS.map((time) => (
                        <option key={time} value={time}>
                          {time}
                        </option>
                      ))}
                    </select>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </PageShell>
  );
}
