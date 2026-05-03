"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useAdminAuth } from "@/components/admin/AdminAuthProvider";
import { PageShell } from "@/components/layout/PageShell";
import { adminBtnBlue, adminBtnCaution, adminBtnGreen, adminBtnNeutral, adminCalloutSuccess } from "@/lib/adminUiStyles";
import {
  DEFAULT_EVENT_PLACE,
  DEFAULT_EVENT_TIME_END,
  DEFAULT_EVENT_TIME_START,
  emptyHomeEvent,
  toUpsertBody,
  type HomeEvent,
} from "@/lib/publicEventTypes";
import {
  applySlotsToTimeDetail,
  clampEndAfterStart,
  EVENT_TIME_OPTIONS,
  isEventPastForAdmin,
  normalizeEventForEditor,
  parseHmToMinutes,
  suggestDuplicateEventId,
} from "@/lib/eventSchedule";
import type { Locale } from "@/i18n/strings";
import { unknownErrorMessage } from "@/lib/unknownErrorMessage";
import { getFirebaseFirestore } from "@/lib/firebase/client";
import { removePublicEvent, subscribeAdminPublicEvents, upsertPublicEvent } from "@/lib/firebase/eventsStore";

const LOCALE_ORDER: Locale[] = ["sv", "es", "en"];
const LOCALE_LABELS: Record<Locale, string> = {
  sv: "Swedish",
  es: "Spanish",
  en: "English",
};

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
  if ((a.eventPlace ?? "") !== (b.eventPlace ?? "")) return false;
  if (!sameLocaleTrio(a.weekdayDate, b.weekdayDate)) return false;
  if (!sameLocaleTrio(a.timeDetail, b.timeDetail)) return false;
  if (!sameLocaleTrio(a.title, b.title)) return false;
  if (!sameLocaleTrio(a.excerpt, b.excerpt)) return false;
  if (!sameLocaleTrio(a.imageAlt, b.imageAlt)) return false;
  return true;
}

const fieldInputClass =
  "w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-ink shadow-sm transition-shadow placeholder:text-slate-400 focus:border-sky-500/80 focus:outline-none focus:ring-2 focus:ring-sky-500/25";

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
      <p className="text-sm font-semibold tracking-wide text-ink">{label}</p>
      <div className="grid min-w-0 gap-3 sm:gap-4 lg:grid-cols-3">
        {LOCALE_ORDER.map((k) => (
          <div key={k} className="min-w-0">
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-ink-muted">
              {LOCALE_LABELS[k]}
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
        setError(unknownErrorMessage(err, "Could not load events from Firestore."));
      },
    );
    return () => unsub();
  }, [ready, user]);

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
      setMessage("Duplicate loaded — confirm the new ID, then Create.");
    },
    [rows],
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
      setError(
        "ID must be 1–64 characters: lowercase letters, digits, hyphens (e.g. summer-dinner-2026).",
      );
      return;
    }
    if (!isDirty) {
      return;
    }
    const draftToSave: HomeEvent = applySlotsToTimeDetail({ ...draft, id: idTrim });
    const sm = parseHmToMinutes(draftToSave.timeSlotStart ?? DEFAULT_EVENT_TIME_START);
    const em = parseHmToMinutes(draftToSave.timeSlotEnd ?? DEFAULT_EVENT_TIME_END);
    if (sm != null && em != null && em < sm) {
      setError("End time must be the same as or after start time.");
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
      setMessage(wasNew ? "Event created." : "Event updated.");
    } catch (err) {
      console.error(err);
      setError(unknownErrorMessage(err, "Network error while saving."));
    } finally {
      setBusy(false);
    }
  }

  async function onDelete() {
    if (isNew || !editingId) return;
    if (!window.confirm(`Delete “${editingId}”? This cannot be undone.`)) return;
    setError(null);
    setMessage(null);
    setBusy(true);
    try {
      const db = getFirebaseFirestore();
      await removePublicEvent(db, editingId);
      setMessage("Event deleted.");
      startNew();
      await load();
    } catch (err) {
      console.error(err);
      setError(unknownErrorMessage(err, "Network error while deleting."));
    } finally {
      setBusy(false);
    }
  }

  if (!ready || !user) {
    return (
      <PageShell title="Events" intro="Loading…">
        <p className="text-sm text-ink-muted">Checking sign-in…</p>
      </PageShell>
    );
  }

  return (
    <PageShell
      title="Events"
      intro="Create, edit, duplicate, or delete public events (Firestore). IDs are stable slugs. Uncheck “Published on website” to save drafts. Image URL should be a direct https link."
      maxWidthClassName="w-full max-w-[min(100%,112rem)]"
    >
      <div className="mb-6 flex flex-wrap items-center gap-2 sm:gap-3">
        <Link href="/admin/dashboard" className={`inline-flex items-center ${adminBtnNeutral}`}>
          Dashboard
        </Link>
        <button type="button" className={adminBtnCaution} onClick={onLogout} disabled={busy}>
          Sign out
        </button>
      </div>

      {message ? <p className={`mb-4 text-sm ${adminCalloutSuccess}`}>{message}</p> : null}
      {error ? <p className="mb-4 text-sm text-red-800">{error}</p> : null}

      <div className="grid min-w-0 gap-8 xl:grid-cols-12 xl:gap-10 2xl:gap-12">
        <aside className="min-w-0 xl:col-span-4 2xl:col-span-3">
          <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-base font-semibold text-ink sm:text-lg">All events</h2>
            <button type="button" className={adminBtnGreen} onClick={startNew} disabled={busy}>
              New event
            </button>
          </div>
          <ul className="max-h-[min(50vh,24rem)] space-y-2 overflow-y-auto rounded-lg border border-slate-200/90 bg-slate-50/40 p-2 text-sm shadow-inner ring-1 ring-slate-200/50 xl:max-h-[min(72vh,40rem)] xl:p-3">
            {rows.length === 0 ? (
              <li className="px-2 py-4 text-ink-muted">No events yet. Create one in Firestore.</li>
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
                        className={[
                          "min-w-0 flex-1 rounded-md border px-3 py-2.5 text-left transition-colors",
                          past
                            ? "border-red-300/90 bg-red-50/90 hover:border-red-400"
                            : selected
                              ? "border-ink/35 bg-ink/5 ring-1 ring-ink/10"
                              : "border-transparent bg-paper hover:border-slate-200 hover:bg-paper/90",
                        ].join(" ")}
                        onClick={() => startEdit(ev)}
                      >
                        <p className="text-[10px] font-mono text-ink-muted">{ev.id}</p>
                        <p className="mt-0.5 font-medium leading-snug text-ink">{ev.title.en}</p>
                        <div className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-ink-muted">
                          <span>{ev.sortDate}</span>
                          {ev.published === false ? (
                            <span className="rounded border border-amber-300/80 bg-amber-50 px-1.5 py-px text-[10px] font-semibold tracking-wide text-amber-900 uppercase">
                              Draft
                            </span>
                          ) : null}
                          {past ? (
                            <span className="text-[10px] font-semibold text-red-800">Past — remove</span>
                          ) : null}
                        </div>
                      </button>
                      <button
                        type="button"
                        className={`shrink-0 self-stretch rounded-md border border-slate-300/90 bg-white px-2 text-[11px] font-semibold tracking-wide text-ink uppercase transition-colors hover:bg-slate-50 disabled:opacity-50`}
                        onClick={() => duplicateFrom(ev)}
                        disabled={busy}
                      >
                        Duplicate
                      </button>
                    </li>
                  );
                })
            )}
          </ul>
        </aside>

        <div className="min-w-0 space-y-6 xl:col-span-8 2xl:col-span-9">
          <div className="rounded-xl border border-slate-200/90 bg-paper p-5 shadow-md ring-1 ring-slate-200/30 sm:p-6 lg:p-8 xl:p-10">
            <h2 className="mb-6 border-b border-slate-200/80 pb-3 text-lg font-semibold text-ink sm:text-xl">
              {isNew ? "New event" : "Edit event"}
            </h2>

            <div className="space-y-5 lg:space-y-6">
          <div>
            <label className="text-xs font-semibold text-ink" htmlFor="ev-id">
              ID (slug)
            </label>
            <input
              id="ev-id"
              className={`${fieldInputClass} mt-1 font-mono text-sm tracking-tight disabled:bg-slate-100/80`}
              value={draft.id}
              onChange={(e) => setDraft((d) => ({ ...d, id: e.target.value }))}
              disabled={!isNew}
              autoComplete="off"
              placeholder="e.g. wine-night-june-2026"
            />
            {!isNew ? (
              <p className="mt-1 text-xs text-ink-muted">ID cannot be changed after creation.</p>
            ) : null}
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:items-end">
            <div className="sm:col-span-1">
              <label className="text-xs font-semibold text-ink" htmlFor="ev-date">
                Calendar date
              </label>
              <input
                id="ev-date"
                type="date"
                className={`${fieldInputClass} mt-1 font-sans`}
                value={draft.sortDate}
                onChange={(e) => setDraft((d) => ({ ...d, sortDate: e.target.value }))}
              />
            </div>
            <div className="flex flex-col gap-3 pb-1 sm:col-span-1 lg:col-span-2">
              <label className="inline-flex items-center gap-2.5 text-sm font-medium text-ink">
                <input
                  type="checkbox"
                  className="size-4 rounded border-slate-300 text-ink focus:ring-sky-500/30"
                  checked={draft.fullyBooked ?? false}
                  onChange={(e) => setDraft((d) => ({ ...d, fullyBooked: e.target.checked }))}
                />
                Fully booked
              </label>
              <label className="inline-flex items-center gap-2.5 text-sm font-medium text-ink">
                <input
                  type="checkbox"
                  className="size-4 rounded border-slate-300 text-ink focus:ring-sky-500/30"
                  checked={draft.published !== false}
                  onChange={(e) =>
                    setDraft((d) => ({
                      ...d,
                      published: e.target.checked,
                    }))
                  }
                />
                Published on website
              </label>
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-ink" htmlFor="ev-img">
              Image URL
            </label>
            <input
              id="ev-img"
              className={`${fieldInputClass} mt-1`}
              value={draft.imageSrc}
              onChange={(e) => setDraft((d) => ({ ...d, imageSrc: e.target.value }))}
            />
          </div>

          <LocaleBlock
            label="Weekday + date (display)"
            value={draft.weekdayDate}
            onChange={(v) => setDraft((d) => ({ ...d, weekdayDate: v }))}
            multiline={false}
          />
          <div className="space-y-3">
            <p className="text-sm font-semibold tracking-wide text-ink">Time & place</p>
            <p className="text-xs text-ink-muted">
              Start and end generate the line shown on the site (24h). Place is appended after the times for all
              languages.
            </p>
            <div className="grid min-w-0 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              <div>
                <label className="mb-1 block text-xs font-semibold text-ink" htmlFor="ev-start">
                  Start time
                </label>
                <select
                  id="ev-start"
                  className={fieldInputClass}
                  value={draft.timeSlotStart ?? DEFAULT_EVENT_TIME_START}
                  onChange={(e) => {
                    const nextStart = e.target.value;
                    setDraft((d) =>
                      applySlotsToTimeDetail({
                        ...d,
                        timeSlotStart: nextStart,
                        timeSlotEnd: clampEndAfterStart(
                          nextStart,
                          d.timeSlotEnd ?? DEFAULT_EVENT_TIME_END,
                        ),
                      }),
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
                <label className="mb-1 block text-xs font-semibold text-ink" htmlFor="ev-end">
                  End time
                </label>
                <select
                  id="ev-end"
                  className={fieldInputClass}
                  value={draft.timeSlotEnd ?? DEFAULT_EVENT_TIME_END}
                  onChange={(e) =>
                    setDraft((d) =>
                      applySlotsToTimeDetail({
                        ...d,
                        timeSlotEnd: e.target.value,
                      }),
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
              <div className="min-w-0 sm:col-span-2 lg:col-span-1">
                <label className="mb-1 block text-xs font-semibold text-ink" htmlFor="ev-place">
                  Place (after times)
                </label>
                <input
                  id="ev-place"
                  className={fieldInputClass}
                  value={draft.eventPlace ?? DEFAULT_EVENT_PLACE}
                  onChange={(e) =>
                    setDraft((d) =>
                      applySlotsToTimeDetail({
                        ...d,
                        eventPlace: e.target.value,
                      }),
                    )
                  }
                  placeholder={DEFAULT_EVENT_PLACE}
                />
              </div>
            </div>
            <p className="text-xs text-ink-muted">
              Preview:{" "}
              <span className="font-medium text-ink">
                {draft.timeDetail.en || "—"}
              </span>
            </p>
          </div>
          <LocaleBlock
            label="Title"
            value={draft.title}
            onChange={(v) => setDraft((d) => ({ ...d, title: v }))}
            multiline={false}
          />
          <LocaleBlock
            label="Excerpt"
            value={draft.excerpt}
            onChange={(v) => setDraft((d) => ({ ...d, excerpt: v }))}
            multiline
          />
          <LocaleBlock
            label="Image alt text (describe the image in text)"
            value={draft.imageAlt}
            onChange={(v) => setDraft((d) => ({ ...d, imageAlt: v }))}
            multiline={false}
          />

          <div className="flex flex-wrap items-center gap-3 border-t border-slate-200/80 pt-6">
            <button
              type="button"
              className={[
                adminBtnBlue,
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
                    ? "Save new event"
                    : "Save your edits"
                  : isNew
                    ? "Change the form to create an event"
                    : "No unsaved changes — edit a field to save"
              }
            >
              {isNew ? "Create" : "Save changes"}
            </button>
            {!isNew && editingId ? (
              <button
                type="button"
                className={adminBtnCaution}
                onClick={(e) => {
                  e.preventDefault();
                  void onDelete();
                }}
                disabled={busy}
              >
                Delete
              </button>
            ) : null}
          </div>
            </div>
          </div>
        </div>
      </div>
    </PageShell>
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
