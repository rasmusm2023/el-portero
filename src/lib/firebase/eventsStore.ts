import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  type Firestore,
  type Unsubscribe,
} from "firebase/firestore";
import type { HomeEvent } from "@/lib/publicEventTypes";

export type FirestorePublicEvent = Omit<HomeEvent, "fullyBooked" | "id"> & {
  /** Optional so older docs don’t break. */
  fullyBooked?: boolean;
  /** Public visibility. */
  published?: boolean;
  /** Server timestamp. */
  updatedAt?: unknown;
};

export const PUBLIC_EVENTS_COLLECTION = "publicEvents";

export function subscribeAdminPublicEvents(
  db: Firestore,
  onValue: (events: HomeEvent[]) => void,
  onError: (err: unknown) => void,
): Unsubscribe {
  const q = query(collection(db, PUBLIC_EVENTS_COLLECTION), orderBy("sortDate", "asc"));
  return onSnapshot(
    q,
    (snap) => {
      const rows: HomeEvent[] = snap.docs.map((d) => {
        const v = d.data() as Partial<FirestorePublicEvent>;
        return {
          id: d.id,
          sortDate: String(v.sortDate ?? ""),
          fullyBooked: Boolean(v.fullyBooked ?? false),
          weekdayDate: (v.weekdayDate ?? { en: "", es: "", sv: "" }) as HomeEvent["weekdayDate"],
          timeDetail: (v.timeDetail ?? { en: "", es: "", sv: "" }) as HomeEvent["timeDetail"],
          title: (v.title ?? { en: "", es: "", sv: "" }) as HomeEvent["title"],
          excerpt: (v.excerpt ?? { en: "", es: "", sv: "" }) as HomeEvent["excerpt"],
          imageSrc: String(v.imageSrc ?? ""),
          imageAlt: (v.imageAlt ?? { en: "", es: "", sv: "" }) as HomeEvent["imageAlt"],
        };
      });
      onValue(rows);
    },
    onError,
  );
}

export async function upsertPublicEvent(db: Firestore, ev: HomeEvent) {
  const id = ev.id.trim();
  await setDoc(
    doc(db, PUBLIC_EVENTS_COLLECTION, id),
    {
      sortDate: ev.sortDate,
      fullyBooked: Boolean(ev.fullyBooked ?? false),
      weekdayDate: ev.weekdayDate,
      timeDetail: ev.timeDetail,
      title: ev.title,
      excerpt: ev.excerpt,
      imageSrc: ev.imageSrc,
      imageAlt: ev.imageAlt,
      published: true,
      updatedAt: serverTimestamp(),
    } satisfies FirestorePublicEvent,
    { merge: true },
  );
}

export async function removePublicEvent(db: Firestore, id: string) {
  await deleteDoc(doc(db, PUBLIC_EVENTS_COLLECTION, id.trim()));
}

