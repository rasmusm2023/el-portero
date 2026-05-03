"use client";

import { useEffect, useRef, useState } from "react";
import { getFirebaseFirestore, isFirebaseConfigured } from "@/lib/firebase/client";
import { subscribePublishedPublicEvents } from "@/lib/firebase/eventsStore";
import { homeEventFromFirestoreData } from "@/lib/firebase/publicEventDoc";
import type { HomeEvent } from "@/lib/publicEventTypes";

export type PublicEventsState = {
  events: HomeEvent[];
  /** False until first successful load when Firebase is configured. */
  ready: boolean;
};

function sortByDate(events: HomeEvent[]) {
  return [...events].sort((a, b) => a.sortDate.localeCompare(b.sortDate));
}

const DEBUG_PUBLIC_EVENTS = process.env.NEXT_PUBLIC_DEBUG_PUBLIC_EVENTS === "1";

function debugEvents(...args: unknown[]) {
  if (DEBUG_PUBLIC_EVENTS) {
    console.info("[usePublicEvents]", ...args);
  }
}

function isFirestorePermissionDenied(err: unknown): boolean {
  return (
    typeof err === "object" &&
    err !== null &&
    "code" in err &&
    (err as { code: string }).code === "permission-denied"
  );
}

async function loadEventsViaApi(signal: AbortSignal): Promise<HomeEvent[] | null> {
  const res = await fetch("/api/public/events", { cache: "no-store", signal });
  if (!res.ok) return null;
  const raw = (await res.json()) as unknown;
  if (!Array.isArray(raw)) return null;
  return sortByDate(
    raw.map((row) => {
      const r = row as Record<string, unknown>;
      return homeEventFromFirestoreData(String(r.id ?? ""), r);
    }),
  );
}

/**
 * Published `publicEvents` for the home page and `/events`.
 *
 * **Two sources:** (1) `GET /api/public/events` on mount (Admin SDK when configured). (2) Firestore
 * listener for live updates.
 *
 * **Display:** prefer the listener when it has rows; otherwise fall back to the last API payload so
 * anonymous sessions still see published events if the client query is empty or flaky (another tab
 * being signed into admin must not be required).
 *
 * When the listener reports a **server** empty snapshot (`!fromCache`, zero docs), we debounce-refetch
 * the API to reconcile (avoids trusting a single transient empty listener pass without blocking the
 * API list forever).
 *
 * **Stale cache:** ignores an empty snapshot that is still `fromCache` while the listener ref already
 * had rows (Firestore persistence can emit a bogus empty cache pass after good data).
 *
 * **Troubleshooting:** set `NEXT_PUBLIC_DEBUG_PUBLIC_EVENTS=1` in `.env.local` and watch the browser
 * console. Server: open `/api/public/events/diagnostics` in dev, or set `EVENTS_DIAGNOSTICS_SECRET` and
 * call `?key=...` in production.
 */
export function usePublicEvents(): PublicEventsState {
  const [state, setState] = useState<PublicEventsState>(() =>
    isFirebaseConfigured() ? { events: [], ready: false } : { events: [], ready: true },
  );

  const apiEventsRef = useRef<HomeEvent[]>([]);
  const listenerEventsRef = useRef<HomeEvent[]>([]);

  useEffect(() => {
    if (!isFirebaseConfigured()) return;

    const ac = new AbortController();
    let unsub: (() => void) | undefined;
    let cancelled = false;
    let emptyReconcileTimer: ReturnType<typeof setTimeout> | null = null;

    listenerEventsRef.current = [];
    apiEventsRef.current = [];

    const flush = () => {
      if (cancelled || ac.signal.aborted) return;
      const live = listenerEventsRef.current;
      const api = apiEventsRef.current;
      const next = live.length > 0 ? sortByDate([...live]) : sortByDate([...api]);
      debugEvents("flush", { listenerCount: live.length, apiCount: api.length, displayCount: next.length });
      setState({ ready: true, events: next });
    };

    const clearEmptyReconcile = () => {
      if (emptyReconcileTimer != null) {
        clearTimeout(emptyReconcileTimer);
        emptyReconcileTimer = null;
      }
    };

    const scheduleReconcileFromApi = () => {
      clearEmptyReconcile();
      emptyReconcileTimer = setTimeout(() => {
        emptyReconcileTimer = null;
        void (async () => {
          try {
            const data = await loadEventsViaApi(ac.signal);
            if (cancelled || ac.signal.aborted || data == null) return;
            apiEventsRef.current = data;
            flush();
          } catch (e) {
            if ((e as Error).name === "AbortError") return;
            console.warn("[usePublicEvents] Reconcile API refresh failed:", e);
          }
        })();
      }, 280);
    };

    void (async () => {
      try {
        const fromApi = await loadEventsViaApi(ac.signal);
        if (cancelled || ac.signal.aborted) return;
        if (fromApi != null) {
          debugEvents("initial API", { count: fromApi.length });
          apiEventsRef.current = fromApi;
          flush();
        } else {
          debugEvents("initial API returned null (non-OK or bad JSON)");
        }
      } catch (e) {
        if ((e as Error).name === "AbortError") return;
        console.warn("[usePublicEvents] Initial API load failed:", e);
      }
    })();

    const db = getFirebaseFirestore();

    unsub = subscribePublishedPublicEvents(
      db,
      (events, snap) => {
        if (cancelled || ac.signal.aborted) return;

        if (
          events.length === 0 &&
          snap.metadata.fromCache &&
          listenerEventsRef.current.length > 0
        ) {
          debugEvents("listener skip stale empty cache snapshot");
          return;
        }

        if (events.length > 0) {
          clearEmptyReconcile();
        }

        debugEvents("listener", {
          count: events.length,
          fromCache: snap.metadata.fromCache,
          hasPendingWrites: snap.metadata.hasPendingWrites,
        });

        listenerEventsRef.current = events;
        flush();

        if (events.length === 0 && !snap.metadata.fromCache) {
          debugEvents("schedule API reconcile (server empty listener)");
          scheduleReconcileFromApi();
        }
      },
      (err) => {
        if (isFirestorePermissionDenied(err)) {
          console.warn(
            "[usePublicEvents] Firestore permission-denied on publicEvents (anonymous listener). " +
              "Deploy `firestore.rules` to the same project as NEXT_PUBLIC_FIREBASE_PROJECT_ID " +
              "(e.g. `firebase deploy --only firestore:rules`). New projects deny all reads until then. " +
              "Until rules work, the site uses GET /api/public/events when FIREBASE_SERVICE_ACCOUNT_JSON is set.",
            err,
          );
        } else {
          console.warn("[usePublicEvents] Firestore listener failed, using Admin API only:", err);
        }
        if (cancelled || ac.signal.aborted) return;
        unsub?.();
        unsub = undefined;
        clearEmptyReconcile();

        void (async () => {
          try {
            const fromApi = await loadEventsViaApi(ac.signal);
            if (cancelled || ac.signal.aborted) return;
            if (fromApi != null) {
              apiEventsRef.current = fromApi;
              listenerEventsRef.current = [];
              flush();
              return;
            }
          } catch (e) {
            if ((e as Error).name === "AbortError") return;
            console.warn("[usePublicEvents] Admin API fallback failed:", e);
          }
          if (!cancelled && !ac.signal.aborted) {
            listenerEventsRef.current = [];
            apiEventsRef.current = [];
            flush();
          }
        })();
      },
    );

    return () => {
      cancelled = true;
      clearEmptyReconcile();
      ac.abort();
      unsub?.();
    };
  }, []);

  return state;
}
