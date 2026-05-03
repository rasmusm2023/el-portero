"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useAdminAuth } from "@/components/admin/AdminAuthProvider";
import { PageShell } from "@/components/layout/PageShell";
import { adminBtnBlue, adminBtnCaution, adminBtnGreen, adminBtnNeutral, adminCalloutSuccess } from "@/lib/adminUiStyles";
import {
  emptyHomeEvent,
  toUpsertBody,
  type HomeEvent,
} from "@/lib/publicEventTypes";
import { unknownErrorMessage } from "@/lib/unknownErrorMessage";
import { getFirebaseFirestore } from "@/lib/firebase/client";
import { removePublicEvent, subscribeAdminPublicEvents, upsertPublicEvent } from "@/lib/firebase/eventsStore";

const LOCALE = [
  { k: "en" as const, label: "EN" },
  { k: "es" as const, label: "ES" },
  { k: "sv" as const, label: "SV" },
];

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
  if ((a.fullyBooked ?? false) !== (b.fullyBooked ?? false)) return false;
  if (a.imageSrc !== b.imageSrc) return false;
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
        {LOCALE.map(({ k, label: L }) => (
          <div key={k} className="min-w-0">
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-ink-muted">
              {L}
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
  const [draft, setDraft] = useState<HomeEvent>(() => emptyHomeEvent(todayYmd()));
  /** Last saved/loaded form snapshot; edit-mode Save is enabled when `draft` differs. */
  const [savedBaseline, setSavedBaseline] = useState<HomeEvent>(() => emptyHomeEvent(todayYmd()));
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
    const blank = emptyHomeEvent(todayYmd());
    setDraft(blank);
    setSavedBaseline(cloneHomeEvent(blank));
    setError(null);
    setMessage(null);
  }, []);

  const startEdit = (ev: HomeEvent) => {
    setIsNew(false);
    setEditingId(ev.id);
    const d: HomeEvent = {
      ...ev,
      fullyBooked: ev.fullyBooked ?? false,
    };
    setDraft(d);
    setSavedBaseline(cloneHomeEvent(d));
    setError(null);
    setMessage(null);
  };

  async function onSave() {
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
    const draftToSave: HomeEvent = { ...draft, id: idTrim };
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
      setMessage(isNew ? "Event created." : "Event updated.");
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
      intro="Create, edit, or delete public events. IDs are stable slugs. Image URL should be a direct https link."
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
              <li className="px-2 py-4 text-ink-muted">No events yet. Create one or seed the API database.</li>
            ) : (
              rows
                .slice()
                .sort((a, b) => a.sortDate.localeCompare(b.sortDate))
                .map((ev) => (
                  <li key={ev.id}>
                    <button
                      type="button"
                      className={[
                        "w-full rounded-md border px-3 py-2.5 text-left transition-colors",
                        editingId === ev.id && !isNew
                          ? "border-ink/35 bg-ink/5 ring-1 ring-ink/10"
                          : "border-transparent bg-paper hover:border-slate-200 hover:bg-paper/90",
                      ].join(" ")}
                      onClick={() => startEdit(ev)}
                    >
                      <p className="text-[10px] font-mono text-ink-muted">{ev.id}</p>
                      <p className="mt-0.5 font-medium leading-snug text-ink">{ev.title.en}</p>
                      <p className="mt-0.5 text-xs text-ink-muted">{ev.sortDate}</p>
                    </button>
                  </li>
                ))
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
                Sort / calendar date
              </label>
              <input
                id="ev-date"
                type="date"
                className={`${fieldInputClass} mt-1 font-sans`}
                value={draft.sortDate}
                onChange={(e) => setDraft((d) => ({ ...d, sortDate: e.target.value }))}
              />
            </div>
            <div className="flex items-end pb-2.5 sm:col-span-1 lg:col-span-1">
              <label className="inline-flex items-center gap-2.5 text-sm font-medium text-ink">
                <input
                  type="checkbox"
                  className="size-4 rounded border-slate-300 text-ink focus:ring-sky-500/30"
                  checked={draft.fullyBooked ?? false}
                  onChange={(e) => setDraft((d) => ({ ...d, fullyBooked: e.target.checked }))}
                />
                Fully booked
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
          <LocaleBlock
            label="Time / place line"
            value={draft.timeDetail}
            onChange={(v) => setDraft((d) => ({ ...d, timeDetail: v }))}
            multiline={false}
          />
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
            label="Image alt text"
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
