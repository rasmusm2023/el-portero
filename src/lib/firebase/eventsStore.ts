import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
  type DocumentData,
  type Firestore,
  type QueryDocumentSnapshot,
  type QuerySnapshot,
  type Unsubscribe,
} from "firebase/firestore";
import type { HomeEvent } from "@/lib/publicEventTypes";
import { coercePublishedToBoolean, publishedFieldNeedsRepair } from "@/lib/publicEventPublishedCoercion";
import { PUBLIC_EVENTS_COLLECTION } from "@/lib/firebase/publicEventsConstants";
import { homeEventFromFirestoreData } from "@/lib/firebase/publicEventDoc";

export type FirestorePublicEvent = Omit<HomeEvent, "id"> & {
  /** Server timestamp. */
  updatedAt?: unknown;
};

export { PUBLIC_EVENTS_COLLECTION } from "@/lib/firebase/publicEventsConstants";

function mapDocToHomeEvent(d: QueryDocumentSnapshot<DocumentData>): HomeEvent {
  return homeEventFromFirestoreData(d.id, d.data() as Record<string, unknown>);
}

export function subscribeAdminPublicEvents(
  db: Firestore,
  onValue: (events: HomeEvent[]) => void,
  onError: (err: unknown) => void,
): Unsubscribe {
  /** No `orderBy`: docs missing `sortDate` would otherwise be invisible in the admin list. */
  const q = query(collection(db, PUBLIC_EVENTS_COLLECTION));
  return onSnapshot(
    q,
    (snap) => {
      onValue(snap.docs.map(mapDocToHomeEvent));
      void (async () => {
        for (const d of snap.docs) {
          const raw = d.data().published;
          if (!publishedFieldNeedsRepair(raw)) continue;
          try {
            await updateDoc(doc(db, PUBLIC_EVENTS_COLLECTION, d.id), {
              published: coercePublishedToBoolean(raw),
            });
          } catch (e) {
            console.warn("[eventsStore] Could not coerce published field:", d.id, e);
          }
        }
      })();
    },
    onError,
  );
}

/**
 * Published events for anonymous visitors. Uses `where('published', '==', true)` so Firestore security
 * rules can allow the query (rules are not filters — unconstrained collection reads fail if any doc
 * would be denied).
 *
 * **No `orderBy` here:** Firestore excludes documents that do not have the order-by field, so a
 * published event with missing or legacy-typed `sortDate` would never appear. Sort client-side instead
 * (`usePublicEvents`).
 */
export function subscribePublishedPublicEvents(
  db: Firestore,
  onValue: (events: HomeEvent[], snap: QuerySnapshot<DocumentData>) => void,
  onError: (err: unknown) => void,
): Unsubscribe {
  const q = query(collection(db, PUBLIC_EVENTS_COLLECTION), where("published", "==", true));
  return onSnapshot(
    q,
    (snap) => {
      onValue(snap.docs.map(mapDocToHomeEvent), snap);
    },
    onError,
  );
}

export async function upsertPublicEvent(db: Firestore, ev: HomeEvent) {
  const id = ev.id.trim();
  const payload: Record<string, unknown> = {
    sortDate: ev.sortDate,
    published: ev.published !== false,
    fullyBooked: Boolean(ev.fullyBooked ?? false),
    hasSpecificTime: ev.hasSpecificTime !== false,
    weekdayDate: ev.weekdayDate,
    timeDetail: ev.timeDetail,
    title: ev.title,
    excerpt: ev.excerpt,
    imageSrc: ev.imageSrc,
    imageAlt: ev.imageAlt,
    updatedAt: serverTimestamp(),
  };
  if (ev.hasSpecificTime !== false && ev.timeSlotStart != null && ev.timeSlotStart !== "") {
    payload.timeSlotStart = ev.timeSlotStart;
  }
  if (ev.hasSpecificTime !== false && ev.timeSlotEnd != null && ev.timeSlotEnd !== "") {
    payload.timeSlotEnd = ev.timeSlotEnd;
  }
  if (ev.hasSpecificTime !== false && ev.eventPlace != null && ev.eventPlace !== "") {
    payload.eventPlace = ev.eventPlace;
  }
  await setDoc(doc(db, PUBLIC_EVENTS_COLLECTION, id), payload as FirestorePublicEvent, {
    merge: true,
  });
}

export async function removePublicEvent(db: Firestore, id: string) {
  await deleteDoc(doc(db, PUBLIC_EVENTS_COLLECTION, id.trim()));
}
