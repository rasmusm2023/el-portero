import {
  doc,
  getDoc,
  onSnapshot,
  serverTimestamp,
  setDoc,
  type Firestore,
  type Unsubscribe,
} from "firebase/firestore";
import type { WeeklyMenu, WeeklyMenuItem } from "@/lib/weeklyMenuTypes";

export type FirestoreWeeklyMenu = Omit<WeeklyMenu, "updatedAtUtc"> & {
  updatedAt?: unknown;
};

export const WEEKLY_MENUS_COLLECTION = "weeklyMenus";
export const WEEKLY_MENU_CURRENT_DOC_ID = "current";

export function weeklyMenuCurrentRef(db: Firestore) {
  return doc(db, WEEKLY_MENUS_COLLECTION, WEEKLY_MENU_CURRENT_DOC_ID);
}

export async function readWeeklyMenuCurrent(db: Firestore): Promise<WeeklyMenu | null> {
  const snap = await getDoc(weeklyMenuCurrentRef(db));
  if (!snap.exists()) return null;
  const v = snap.data() as Partial<FirestoreWeeklyMenu>;
  return normalizeWeeklyMenu(v);
}

export function subscribeWeeklyMenuCurrent(
  db: Firestore,
  onValue: (menu: WeeklyMenu | null) => void,
  onError: (err: unknown) => void,
): Unsubscribe {
  return onSnapshot(
    weeklyMenuCurrentRef(db),
    (snap) => {
      if (!snap.exists()) {
        onValue(null);
        return;
      }
      onValue(normalizeWeeklyMenu(snap.data() as Partial<FirestoreWeeklyMenu>));
    },
    onError,
  );
}

export async function upsertWeeklyMenuCurrent(db: Firestore, menu: WeeklyMenu) {
  const payload: FirestoreWeeklyMenu = {
    weekStartDate: menu.weekStartDate,
    effectiveWeekStartDate: menu.effectiveWeekStartDate,
    title: menu.title ?? "",
    isPublished: Boolean(menu.isPublished),
    items: (menu.items ?? []) as WeeklyMenuItem[],
    updatedAt: serverTimestamp(),
  };
  await setDoc(weeklyMenuCurrentRef(db), payload, { merge: true });
}

export async function setWeeklyMenuCurrentPublished(db: Firestore, isPublished: boolean) {
  await setDoc(
    weeklyMenuCurrentRef(db),
    { isPublished: Boolean(isPublished), updatedAt: serverTimestamp() } satisfies Partial<FirestoreWeeklyMenu>,
    { merge: true },
  );
}

function normalizeWeeklyMenu(v: Partial<FirestoreWeeklyMenu>): WeeklyMenu {
  return {
    weekStartDate: String(v.weekStartDate ?? ""),
    effectiveWeekStartDate: String(v.effectiveWeekStartDate ?? v.weekStartDate ?? ""),
    title: String(v.title ?? ""),
    isPublished: Boolean(v.isPublished ?? false),
    // We don't need the timestamp string in the UI; keep a stable non-empty string.
    updatedAtUtc: typeof v.updatedAt === "string" ? v.updatedAt : "",
    items: Array.isArray(v.items) ? (v.items as WeeklyMenuItem[]) : [],
  };
}

