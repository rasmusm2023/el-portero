import {
  doc,
  getDoc,
  onSnapshot,
  type Firestore,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import {
  legacyHoursToSchedule,
  normalizeDaySchedule,
  normalizeOpeningHours,
  type OpeningHoursDayKey,
  type OpeningHoursDoc,
} from "@/lib/openingHoursTypes";

export const OPENING_HOURS_COLLECTION = "openingHours";
export const OPENING_HOURS_DOC_ID = "default";

export function openingHoursRef(db: Firestore) {
  return doc(db, OPENING_HOURS_COLLECTION, OPENING_HOURS_DOC_ID);
}

function parseRow(
  row: Record<string, unknown>,
  fallbackDayKey: OpeningHoursDayKey,
): ReturnType<typeof normalizeDaySchedule> {
  const dayKey =
    typeof row.dayKey === "string" &&
    ["mon", "tue", "wed", "thu", "fri", "sat", "sun"].includes(row.dayKey)
      ? (row.dayKey as OpeningHoursDayKey)
      : fallbackDayKey;

  if (typeof row.closed === "boolean" || typeof row.open === "string" || typeof row.close === "string") {
    return normalizeDaySchedule({
      dayKey,
      closed: Boolean(row.closed),
      open: typeof row.open === "string" ? row.open : undefined,
      close: typeof row.close === "string" ? row.close : undefined,
    });
  }

  if (typeof row.hours === "string") {
    return legacyHoursToSchedule(dayKey, row.hours);
  }

  return normalizeDaySchedule({ dayKey });
}

function normalizeDoc(raw: Record<string, unknown> | undefined): OpeningHoursDoc | null {
  if (!raw || typeof raw !== "object") return null;

  const rowsIn = Array.isArray(raw.rows) ? raw.rows : [];
  const rows = rowsIn.map((entry, i) =>
    parseRow((entry ?? {}) as Record<string, unknown>, ["mon", "tue", "wed", "thu", "fri", "sat", "sun"][i] as OpeningHoursDayKey),
  );

  const normalized = normalizeOpeningHours({
    isPublished: Boolean(raw.isPublished),
    updatedAtUtc:
      typeof raw.updatedAtUtc === "string"
        ? raw.updatedAtUtc
        : typeof raw.updatedAt === "string"
          ? raw.updatedAt
          : undefined,
    rows,
  });

  // Legacy top-level serviceOpen/serviceClose applied to all open days if rows were empty strings only
  if (
    typeof raw.serviceOpen === "string" &&
    typeof raw.serviceClose === "string" &&
    rowsIn.every((entry) => {
      const r = (entry ?? {}) as Record<string, unknown>;
      return typeof r.hours === "string" && !r.open && !r.close;
    })
  ) {
    normalized.rows = normalized.rows.map((row) =>
      row.closed
        ? row
        : normalizeDaySchedule({
            dayKey: row.dayKey,
            closed: false,
            open: raw.serviceOpen as string,
            close: raw.serviceClose as string,
          }),
    );
  }

  return normalized;
}

export async function readOpeningHours(db: Firestore): Promise<OpeningHoursDoc | null> {
  const snap = await getDoc(openingHoursRef(db));
  if (!snap.exists()) return null;
  return normalizeDoc(snap.data() as Record<string, unknown>);
}

export function subscribeOpeningHours(
  db: Firestore,
  onValue: (hours: OpeningHoursDoc | null) => void,
  onError?: (err: unknown) => void,
): () => void {
  return onSnapshot(
    openingHoursRef(db),
    (snap) => {
      if (!snap.exists()) {
        onValue(null);
        return;
      }
      onValue(normalizeDoc(snap.data() as Record<string, unknown>));
    },
    (err) => onError?.(err),
  );
}

export async function upsertOpeningHours(db: Firestore, hours: OpeningHoursDoc) {
  const payload = normalizeOpeningHours(hours);
  await setDoc(
    openingHoursRef(db),
    {
      isPublished: Boolean(payload.isPublished),
      rows: payload.rows.map((row) => ({
        dayKey: row.dayKey,
        closed: row.closed,
        open: row.open,
        close: row.close,
      })),
      updatedAt: serverTimestamp(),
    },
    { merge: true },
  );
}

export async function setOpeningHoursPublished(db: Firestore, isPublished: boolean) {
  await setDoc(
    openingHoursRef(db),
    {
      isPublished: Boolean(isPublished),
      updatedAt: serverTimestamp(),
    },
    { merge: true },
  );
}
