"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Copy, LayoutDashboard, LogOut, Plus, Save, Trash2 } from "lucide-react";
import { EventsAdminIntro } from "@/components/admin/EventsAdminIntro";
import { useAdminAuth } from "@/components/admin/AdminAuthProvider";
import { LocaleFlag } from "@/components/layout/LocaleFlag";
import { PageShell } from "@/components/layout/PageShell";
import { adminBtnBlue, adminBtnDanger, adminBtnGreen, adminBtnNeutral, adminBtnSignOut, adminCalloutSuccess } from "@/lib/adminUiStyles";
import {
  DEFAULT_EVENT_TIME_END,
  DEFAULT_EVENT_TIME_START,
  emptyHomeEvent,
  toUpsertBody,
  type HomeEvent,
} from "@/lib/publicEventTypes";
import { formatSortDateForEventDisplay } from "@/lib/eventDisplayDate";
import {
  applySlotsToTimeDetail,
  clampEndAfterStart,
  EVENT_TIME_OPTIONS,
  isEventPastForAdmin,
  normalizeEventForEditor,
  parseHmToMinutes,
  suggestDuplicateEventId,
  syncDerivedEventFields,
} from "@/lib/eventSchedule";
import { localeLabels, t, type Locale } from "@/i18n/strings";
import { useLocale } from "@/i18n/useLocale";
import { useAdminConfirm } from "@/hooks/useAdminConfirm";
import { unknownErrorMessage } from "@/lib/unknownErrorMessage";
import { getFirebaseFirestore } from "@/lib/firebase/client";
import { removePublicEvent, subscribeAdminPublicEvents, upsertPublicEvent } from "@/lib/firebase/eventsStore";

const LOCALE_ORDER: Locale[] = ["sv", "es", "en"];

function LocaleFieldLabel({ localeKey }: { localeKey: Locale }) {
  return (
    <span className="inline-flex items-center gap-2">
      <LocaleFlag locale={localeKey} variant="onDark" />
      <span>{localeLabels[localeKey]}</span>
    </span>
  );
}

function todayYmd() {
  return new Date().toISOString().slice(0, 10);
}

function cloneHomeEvent(e: HomeEvent): HomeEvent {
  return JSON.parse(JSON.stringify(e)) as HomeEvent;
}

function sameLocaleTrio(
  a: HomeEvent["title"],
  b: HomeEvent["title"],
) {
  return a.en === b.en && a.es === b.es && a.sv === b.sv;
}

function homeEventsEqual(a: HomeEvent, b: HomeEvent) {
  if (a.id.trim() !== b.id.trim() || a.sortDate !== b.sortDate) return false;
  if ((a.published !== false) !== (b.published !== false)) return false;
  if ((a.fullyBooked ?? false) !== (b.fullyBooked ?? false)) return false;
  if (a.imageSrc !== b.imageSrc) return false;
  if ((a.timeSlotStart ?? "") !== (b.timeSlotStart ?? "")) return false;
  if ((a.timeSlotEnd ?? "") !== (b.timeSlotEnd ?? "")) return false;
  if (!sameLocaleTrio(a.timeDetail, b.timeDetail)) return false;
  if (!sameLocaleTrio(a.title, b.title)) return false;
  if (!sameLocaleTrio(a.excerpt, b.excerpt)) return false;
  if (!sameLocaleTrio(a.imageAlt, b.imageAlt)) return false;
  return true;
}

const fieldInputClass =
  "w-full rounded-md border border-paper/15 bg-paper/8 px-3 py-2 text-sm text-paper shadow-sm transition-shadow placeholder:text-paper/40 focus:border-gold/45 focus:outline-none focus:ring-2 focus:ring-gold/20";

function LocaleBlock({
  label,
  value,
  onChange,
  multiline,
}: {
  label: string;
  value: HomeEvent["title"];
  onChange: (next: HomeEvent["title"]) => void;
  multiline: boolean;
}) {
  return (
    <div className="space-y-3">
      <p className="text-sm font-semibold tracking-wide text-paper">{label}</p>
      <div className="grid min-w-0 gap-3 sm:gap-4 lg:grid-cols-3">
        {LOCALE_ORDER.map((k) => (
          <div key={k} className="min-w-0">
            <label className="mb-1 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-paper/60">
              <LocaleFieldLabel localeKey={k} />
            </label>
            {multiline ? (
              <textarea
                className={`${fieldInputClass} min-h-28 resize-y sm:min-h-32`}
                value={value[k]}
                onChange={(e) => onChange({ ...value, [k]: e.target.value })}
              />
            ) : (
              <input
                className={fieldInputClass}
                value={value[k]}
                onChange={(e) => onChange({ ...value, [k]: e.target.value })}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export function EventsAdminPage() {
  const router = useRouter();
  const { locale } = useLocale();
  const { confirm, dialog: confirmDialog } = useAdminConfirm(locale);
  const { user, ready, signOutUser } = useAdminAuth();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const [rows, setRows] = useState<HomeEvent[]>([]);
  const [draft, setDraft] = useState<HomeEvent>(() =>
    applySlotsToTimeDetail(emptyHomeEvent(todayYmd())),
  );
  /** Last saved/loaded form snapshot; edit-mode Save is enabled when `draft` differs. */
  const [savedBaseline, setSavedBaseline] = useState<HomeEvent>(() =>
    applySlotsToTimeDetail(emptyHomeEvent(todayYmd())),
  );
  const [isNew, setIsNew] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);

  const isDirty = useMemo(
    () => !homeEventsEqual(draft, savedBaseline),
    [draft, savedBaseline],
  );

  const load = useCallback(async () => {
    // No-op: Firestore is live-subscribed via onSnapshot below.
  }, []);

  useEffect(() => {
    if (!ready || !user) return;
    setError(null);
    const db = getFirebaseFirestore();
    const unsub = subscribeAdminPublicEvents(
      db,
      (events) => {
        setRows(events);
      },
      (err) => {
        console.error(err);
        setError(unknownErrorMessage(err, t(locale, "admin.events.loadError")));
      },
    );
    return () => unsub();
  }, [ready, user, locale]);

  async function onLogout() {
    setError(null);
    setBusy(true);
    try {
      await signOutUser();
      router.push("/admin");
    } finally {
      setBusy(false);
    }
  }

  const startNew = useCallback(() => {
    setIsNew(true);
    setEditingId(null);
    const blank = applySlotsToTimeDetail(emptyHomeEvent(todayYmd()));
    setDraft(cloneHomeEvent(blank));
    setSavedBaseline(cloneHomeEvent(blank));
    setError(null);
    setMessage(null);
  }, []);

  const duplicateFrom = useCallback(
    (ev: HomeEvent) => {
      const normalized = normalizeEventForEditor(cloneHomeEvent(ev));
      let id = suggestDuplicateEventId(ev.id);
      let guard = 0;
      while (rows.some((r) => r.id === id) && guard < 12) {
        id = suggestDuplicateEventId(ev.id);
        guard++;
      }
      const next = applySlotsToTimeDetail({
        ...normalized,
        id,
        published: normalized.published !== false,
      });
      setIsNew(true);
      setEditingId(null);
      setDraft(next);
      setSavedBaseline(cloneHomeEvent(emptyHomeEvent(todayYmd())));
      setError(null);
      setMessage(t(locale, "admin.events.duplicateLoaded"));
    },
    [rows, locale],
  );

  const startEdit = (ev: HomeEvent) => {
    setIsNew(false);
    setEditingId(ev.id);
    const d = normalizeEventForEditor({
      ...ev,
      fullyBooked: ev.fullyBooked ?? false,
    });
    setDraft(d);
    setSavedBaseline(cloneHomeEvent(d));
    setError(null);
    setMessage(null);
  };

  async function onSave() {
    const wasNew = isNew;
    const idTrim = draft.id.trim();
    if (!isValidEventSlug(idTrim)) {
      setError(t(locale, "admin.events.invalidId"));
      return;
    }
    if (!isDirty) {
      return;
    }
    const draftToSave: HomeEvent = syncDerivedEventFields({ ...draft, id: idTrim });
    const sm = parseHmToMinutes(draftToSave.timeSlotStart ?? DEFAULT_EVENT_TIME_START);
    const em = parseHmToMinutes(draftToSave.timeSlotEnd ?? DEFAULT_EVENT_TIME_END);
    if (sm != null && em != null && em < sm) {
      setError(t(locale, "admin.events.invalidTime"));
      return;
    }
    setError(null);
    setMessage(null);
    setBusy(true);
    try {
      const body = toUpsertBody(draftToSave);
      void body; // kept for shape parity with old API payloads

      const db = getFirebaseFirestore();
      await upsertPublicEvent(db, draftToSave);
      const saved = cloneHomeEvent(draftToSave);
      setDraft(saved);
      setSavedBaseline(cloneHomeEvent(saved));
      setIsNew(false);
      setEditingId(saved.id);
      setMessage(wasNew ? t(locale, "admin.events.created") : t(locale, "admin.events.updated"));
    } catch (err) {
      console.error(err);
      setError(unknownErrorMessage(err, t(locale, "admin.events.saveError")));
    } finally {
      setBusy(false);
    }
  }

  const deleteEventById = useCallback(
    async (id: string) => {
      const ok = await confirm({
        message: t(locale, "admin.events.deleteConfirm").replace("{id}", id),
        confirmLabel: t(locale, "admin.confirm.delete"),
      });
      if (!ok) {
        return;
      }
      setError(null);
      setMessage(null);
      setBusy(true);
      try {
        const db = getFirebaseFirestore();
        await removePublicEvent(db, id);
        setMessage(t(locale, "admin.events.deleted"));
        if (editingId === id) {
          startNew();
        }
        await load();
      } catch (err) {
        console.error(err);
        setError(unknownErrorMessage(err, t(locale, "admin.events.deleteError")));
      } finally {
        setBusy(false);
      }
    },
    [locale, editingId, startNew, load, confirm],
  );

  async function onDelete() {
    if (isNew || !editingId) return;
    await deleteEventById(editingId);
  }

  if (!ready || !user) {
    return (
      <PageShell
        title={t(locale, "admin.events.loadingTitle")}
        intro={t(locale, "admin.events.loadingIntro")}
      >
        <p className="text-sm text-paper/70">{t(locale, "admin.checkingSignIn")}</p>
      </PageShell>
    );
  }

  return (
    <>
    <PageShell
      title={t(locale, "admin.events.title")}
      intro={<EventsAdminIntro locale={locale} />}
      maxWidthClassName="w-full max-w-[min(100%,112rem)]"
    >
      <div className="mb-6 flex flex-wrap items-center gap-2 sm:gap-3">
        <Link href="/admin/dashboard" className={`inline-flex items-center ${adminBtnNeutral}`}>
          <span className="inline-flex items-center gap-2">
            <LayoutDashboard className="size-4" aria-hidden />
            {t(locale, "admin.dashboard")}
          </span>
        </Link>
        <button type="button" className={adminBtnSignOut} onClick={onLogout} disabled={busy}>
          <span className="inline-flex items-center gap-2">
            <LogOut className="size-4" aria-hidden />
            {t(locale, "admin.signOut")}
          </span>
        </button>
      </div>

      {message ? <p className={`mb-4 text-sm ${adminCalloutSuccess}`}>{message}</p> : null}
      {error ? (
        <p className="mb-4 rounded-none border border-red-400/25 bg-red-950/25 px-4 py-3 text-sm text-red-100">
          {error}
        </p>
      ) : null}

      <div className="grid min-w-0 gap-8 xl:grid-cols-12 xl:gap-10 2xl:gap-12">
        <aside className="min-w-0 xl:col-span-4 2xl:col-span-3">
          <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-base font-semibold text-paper sm:text-lg">
              {t(locale, "admin.events.allEvents")}
            </h2>
            <button type="button" className={adminBtnGreen} onClick={startNew} disabled={busy}>
              <span className="inline-flex items-center gap-2">
                <Plus className="size-4" aria-hidden />
                {t(locale, "admin.events.newEvent")}
              </span>
            </button>
          </div>
          <ul className="max-h-[min(50vh,24rem)] space-y-2 overflow-y-auto rounded-lg border border-border bg-paper/4 p-2 text-sm shadow-inner ring-1 ring-border/60 xl:max-h-[min(72vh,40rem)] xl:p-3">
            {rows.length === 0 ? (
              <li className="px-2 py-4 text-paper/60">{t(locale, "admin.events.emptyList")}</li>
            ) : (
              rows
                .slice()
                .sort((a, b) => a.sortDate.localeCompare(b.sortDate))
                .map((ev) => {
                  const past = isEventPastForAdmin(ev);
                  const selected = editingId === ev.id && !isNew;
                  return (
                    <li key={ev.id} className="flex gap-1.5">
                      <button
                        type="button"
                        aria-current={selected ? "true" : undefined}
                        className={[
                          "min-w-0 flex-1 rounded-md border px-3 py-2.5 text-left transition-[background-color,border-color,box-shadow]",
                          selected
                            ? [
                                "border-sky-400/55 bg-sky-950/50 shadow-md",
                                "ring-2 ring-sky-400/45 ring-offset-2 ring-offset-paper-dark",
                                "border-l-[5px] border-l-sky-400",
                                past ? "hover:border-sky-300/65" : "hover:border-sky-300/70 hover:bg-sky-950/60",
                              ].join(" ")
                            : past
                              ? "border-red-400/35 bg-red-950/25 hover:border-red-300/50"
                              : "border-paper/10 bg-paper/4 hover:border-paper/20 hover:bg-paper/6",
                        ].join(" ")}
                        onClick={() => startEdit(ev)}
                      >
                        <p
                          className={[
                            "text-[10px] font-mono",
                            selected ? "text-sky-200/90" : "text-paper/55",
                          ].join(" ")}
                        >
                          {ev.id}
                        </p>
                        <p
                          className={[
                            "mt-0.5 leading-snug",
                            selected ? "font-semibold text-paper" : "font-medium text-paper/90",
                          ].join(" ")}
                        >
                          {ev.title.en}
                        </p>
                        <div className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-paper/60">
                          <span>{ev.sortDate}</span>
                          {ev.published === false ? (
                            <span className="rounded border border-amber-300/25 bg-amber-950/20 px-1.5 py-px text-[10px] font-semibold tracking-wide text-amber-100 uppercase">
                              {t(locale, "admin.events.draft")}
                            </span>
                          ) : null}
                          {past ? (
                            <span className="text-[10px] font-semibold text-red-200">
                              {t(locale, "admin.events.pastRemove")}
                            </span>
                          ) : null}
                        </div>
                      </button>
                      <div className="flex shrink-0 flex-col gap-1.5 self-stretch">
                        <button
                          type="button"
                          className="flex min-h-0 flex-1 items-center justify-center rounded-md border border-paper/18 bg-paper/8 px-2 py-2 text-[11px] font-semibold tracking-wide text-paper uppercase transition-colors hover:bg-paper/12 disabled:opacity-50"
                          onClick={() => duplicateFrom(ev)}
                          disabled={busy}
                        >
                          <span className="inline-flex items-center gap-1.5">
                            <Copy className="size-3.5 shrink-0" aria-hidden />
                            {t(locale, "admin.events.duplicate")}
                          </span>
                        </button>
                        <button
                          type="button"
                          className="flex min-h-0 flex-1 items-center justify-center rounded-md border border-red-300/30 bg-red-950/35 px-2 py-2 text-[11px] font-semibold tracking-wide text-red-100 uppercase transition-colors hover:bg-red-950/55 disabled:opacity-50"
                          onClick={(e) => {
                            e.preventDefault();
                            void deleteEventById(ev.id);
                          }}
                          disabled={busy}
                        >
                          <span className="inline-flex items-center gap-1.5">
                            <Trash2 className="size-3.5 shrink-0" aria-hidden />
                            {t(locale, "admin.events.delete")}
                          </span>
                        </button>
                      </div>
                    </li>
                  );
                })
            )}
          </ul>
        </aside>

        <div className="min-w-0 space-y-6 xl:col-span-8 2xl:col-span-9">
          <div className="rounded-xl border border-border bg-paper-dark/35 p-5 shadow-md ring-1 ring-border/60 sm:p-6 lg:p-8 xl:p-10">
            <h2 className="mb-6 border-b border-border pb-3 text-lg font-semibold text-paper sm:text-xl">
              {isNew ? t(locale, "admin.events.formNew") : t(locale, "admin.events.formEdit")}
            </h2>

            <div className="space-y-5 lg:space-y-6">
          <div>
            <label className="text-xs font-semibold text-paper" htmlFor="ev-id">
              {t(locale, "admin.events.idLabel")}
            </label>
            <input
              id="ev-id"
              className={`${fieldInputClass} mt-1 font-mono text-sm tracking-tight disabled:bg-paper/6 disabled:text-paper/50`}
              value={draft.id}
              onChange={(e) => setDraft((d) => ({ ...d, id: e.target.value }))}
              disabled={!isNew}
              autoComplete="off"
              placeholder={t(locale, "admin.events.idPlaceholder")}
            />
            {!isNew ? (
              <p className="mt-1 text-xs text-paper/55">{t(locale, "admin.events.idLocked")}</p>
            ) : null}
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:items-end">
            <div className="sm:col-span-1">
              <label className="text-xs font-semibold text-paper" htmlFor="ev-date">
                {t(locale, "admin.events.calendarDate")}
              </label>
              <input
                id="ev-date"
                type="date"
                className={`${fieldInputClass} mt-1 font-sans`}
                value={draft.sortDate}
                onChange={(e) =>
                  setDraft((d) => syncDerivedEventFields({ ...d, sortDate: e.target.value }))
                }
              />
              <p className="mt-2 text-xs text-paper/55">
                {t(locale, "admin.events.datePreviewHint")}
              </p>
              <ul className="mt-2 space-y-1 text-sm text-paper/85">
                {LOCALE_ORDER.map((k) => (
                  <li key={k} className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
                    <span className="font-semibold text-paper/70">
                      <LocaleFieldLabel localeKey={k} />:
                    </span>
                    <span>{formatSortDateForEventDisplay(draft.sortDate, k) || "—"}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex flex-col gap-3 pb-1 sm:col-span-1 lg:col-span-2">
              <label className="inline-flex items-center gap-2.5 text-sm font-medium text-paper/90">
                <input
                  type="checkbox"
                  className="size-4 rounded border-paper/25 bg-paper/5 text-paper focus:ring-gold/30"
                  checked={draft.hasSpecificTime !== false}
                  onChange={(e) => {
                    const on = e.target.checked;
                    setDraft((d) =>
                      syncDerivedEventFields(
                        applySlotsToTimeDetail({
                          ...d,
                          hasSpecificTime: on,
                          timeSlotStart: on ? d.timeSlotStart : undefined,
                          timeSlotEnd: on ? d.timeSlotEnd : undefined,
                        }),
                      ),
                    );
                  }}
                />
                {t(locale, "admin.events.specificTime")}
              </label>
              <label className="inline-flex items-center gap-2.5 text-sm font-medium text-paper/90">
                <input
                  type="checkbox"
                  className="size-4 rounded border-paper/25 bg-paper/5 text-paper focus:ring-gold/30"
                  checked={draft.fullyBooked ?? false}
                  onChange={(e) => setDraft((d) => ({ ...d, fullyBooked: e.target.checked }))}
                />
                {t(locale, "admin.events.fullyBooked")}
              </label>
              <label className="inline-flex items-center gap-2.5 text-sm font-medium text-paper/90">
                <input
                  type="checkbox"
                  className="size-4 rounded border-paper/25 bg-paper/5 text-paper focus:ring-gold/30"
                  checked={draft.published !== false}
                  onChange={(e) =>
                    setDraft((d) => ({
                      ...d,
                      published: e.target.checked,
                    }))
                  }
                />
                {t(locale, "admin.events.published")}
              </label>
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-paper" htmlFor="ev-img">
              {t(locale, "admin.events.imageUrl")}
            </label>
            <input
              id="ev-img"
              className={`${fieldInputClass} mt-1`}
              value={draft.imageSrc}
              onChange={(e) => setDraft((d) => ({ ...d, imageSrc: e.target.value }))}
              placeholder="https://images2.imgbox.com/…"
              inputMode="url"
              autoComplete="off"
            />
            <p className="mt-2 text-xs leading-relaxed text-paper/60">
              {t(locale, "admin.events.imageUrlHint")}
            </p>
          </div>

          {draft.hasSpecificTime !== false ? (
          <div className="space-y-3">
            <p className="text-sm font-semibold tracking-wide text-paper">
              {t(locale, "admin.events.timeOnly")}
            </p>
            <p className="text-xs text-paper/55">{t(locale, "admin.events.timeOnlyHint")}</p>
            <div className="grid min-w-0 gap-3 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs font-semibold text-paper" htmlFor="ev-start">
                  {t(locale, "admin.events.startTime")}
                </label>
                <select
                  id="ev-start"
                  className={fieldInputClass}
                  value={draft.timeSlotStart ?? DEFAULT_EVENT_TIME_START}
                  onChange={(e) => {
                    const nextStart = e.target.value;
                    setDraft((d) =>
                      syncDerivedEventFields(
                        applySlotsToTimeDetail({
                          ...d,
                          timeSlotStart: nextStart,
                          timeSlotEnd: clampEndAfterStart(
                            nextStart,
                            d.timeSlotEnd ?? DEFAULT_EVENT_TIME_END,
                          ),
                        }),
                      ),
                    );
                  }}
                >
                  {EVENT_TIME_OPTIONS.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold text-paper" htmlFor="ev-end">
                  {t(locale, "admin.events.endTime")}
                </label>
                <select
                  id="ev-end"
                  className={fieldInputClass}
                  value={draft.timeSlotEnd ?? DEFAULT_EVENT_TIME_END}
                  onChange={(e) =>
                    setDraft((d) =>
                      syncDerivedEventFields(
                        applySlotsToTimeDetail({
                          ...d,
                          timeSlotEnd: e.target.value,
                        }),
                      ),
                    )
                  }
                >
                  {EVENT_TIME_OPTIONS.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <p className="text-xs text-paper/55">
              {t(locale, "admin.events.preview")}:{" "}
              <span className="font-medium text-paper">
                {draft.timeDetail.en?.trim() ? draft.timeDetail.en : "—"}
              </span>
            </p>
          </div>
          ) : null}
          <LocaleBlock
            label={t(locale, "admin.events.titleField")}
            value={draft.title}
            onChange={(v) => setDraft((d) => ({ ...d, title: v }))}
            multiline={false}
          />
          <LocaleBlock
            label={t(locale, "admin.events.excerpt")}
            value={draft.excerpt}
            onChange={(v) => setDraft((d) => ({ ...d, excerpt: v }))}
            multiline
          />
          <LocaleBlock
            label={t(locale, "admin.events.imageAlt")}
            value={draft.imageAlt}
            onChange={(v) => setDraft((d) => ({ ...d, imageAlt: v }))}
            multiline={false}
          />

          <div className="flex flex-wrap items-center gap-3 border-t border-slate-200/80 pt-6">
            <button
              type="button"
              className={[
                isNew ? adminBtnGreen : adminBtnBlue,
                isDirty
                  ? "ring-2 ring-sky-400/55 ring-offset-2 ring-offset-paper"
                  : "",
              ]
                .filter(Boolean)
                .join(" ")}
              onClick={onSave}
              disabled={busy || !isDirty}
              title={
                isDirty
                  ? isNew
                    ? t(locale, "admin.events.saveNewTooltip")
                    : t(locale, "admin.events.saveEditTooltip")
                  : isNew
                    ? t(locale, "admin.events.saveNewDisabledTooltip")
                    : t(locale, "admin.events.saveEditDisabledTooltip")
              }
            >
              <span className="inline-flex items-center gap-2">
                {isNew ? <Plus className="size-4" aria-hidden /> : <Save className="size-4" aria-hidden />}
                {isNew ? t(locale, "admin.events.create") : t(locale, "admin.events.saveChanges")}
              </span>
            </button>
            {!isNew && editingId ? (
              <button
                type="button"
                className={adminBtnDanger}
                onClick={(e) => {
                  e.preventDefault();
                  void onDelete();
                }}
                disabled={busy}
              >
                <span className="inline-flex items-center gap-2">
                  <Trash2 className="size-4" aria-hidden />
                  {t(locale, "admin.events.delete")}
                </span>
              </button>
            ) : null}
          </div>
            </div>
          </div>
        </div>
      </div>
    </PageShell>
    {confirmDialog}
    </>
  );
}

function isValidEventSlug(raw: string) {
  const t = raw.trim();
  if (!t || t.length > 64) return false;
  if (t[0] === "-" || t.at(-1) === "-") return false;
  for (const c of t) {
    if (c === "-" || (c >= "0" && c <= "9") || (c >= "a" && c <= "z")) continue;
    return false;
  }
  return true;
}
