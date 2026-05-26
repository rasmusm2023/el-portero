import { OPENING_HOURS_TIME_OPTIONS } from "@/lib/openingHoursTimeOptions";

export const OPENING_HOURS_DAY_KEYS = [
  "mon",
  "tue",
  "wed",
  "thu",
  "fri",
  "sat",
  "sun",
] as const;

export type OpeningHoursDayKey = (typeof OPENING_HOURS_DAY_KEYS)[number];

export type OpeningHoursDaySchedule = {
  dayKey: OpeningHoursDayKey;
  closed: boolean;
  open: string;
  close: string;
};

export type OpeningHoursDoc = {
  isPublished: boolean;
  updatedAtUtc?: string;
  rows: OpeningHoursDaySchedule[];
};

const DEFAULT_OPEN = "17:00";
const DEFAULT_CLOSE = "01:00";

export const DEFAULT_OPENING_HOURS: OpeningHoursDoc = {
  isPublished: false,
  rows: OPENING_HOURS_DAY_KEYS.map((dayKey) => ({
    dayKey,
    closed: false,
    open: DEFAULT_OPEN,
    close: DEFAULT_CLOSE,
  })),
};

export function normalizeHm(value: string, fallback: string): string {
  const m = /^(\d{1,2}):(\d{2})$/.exec((value ?? "").trim());
  if (!m) return fallback;
  const h = Number(m[1]);
  const min = Number(m[2]);
  if (h < 0 || h > 23 || min < 0 || min > 59) return fallback;
  const normalized = `${String(h).padStart(2, "0")}:${String(min).padStart(2, "0")}`;
  return OPENING_HOURS_TIME_OPTIONS.includes(normalized) ? normalized : fallback;
}

export function normalizeDaySchedule(
  input: Partial<OpeningHoursDaySchedule> & { dayKey: OpeningHoursDayKey },
): OpeningHoursDaySchedule {
  const closed = Boolean(input.closed);
  return {
    dayKey: input.dayKey,
    closed,
    open: closed ? DEFAULT_OPEN : normalizeHm(input.open ?? DEFAULT_OPEN, DEFAULT_OPEN),
    close: closed ? DEFAULT_CLOSE : normalizeHm(input.close ?? DEFAULT_CLOSE, DEFAULT_CLOSE),
  };
}

/** Parse legacy free-text `hours` from older Firestore docs. */
export function legacyHoursToSchedule(
  dayKey: OpeningHoursDayKey,
  hours: string,
): OpeningHoursDaySchedule {
  const text = (hours ?? "").trim();
  const lower = text.toLowerCase();
  if (!text || lower === "closed" || lower === "stängt" || lower === "cerrado") {
    return { dayKey, closed: true, open: DEFAULT_OPEN, close: DEFAULT_CLOSE };
  }
  const m = /(\d{1,2}:\d{2})\s*[–-]\s*(\d{1,2}:\d{2})/.exec(text);
  if (m) {
    return normalizeDaySchedule({
      dayKey,
      closed: false,
      open: m[1],
      close: m[2],
    });
  }
  return normalizeDaySchedule({ dayKey, closed: false, open: DEFAULT_OPEN, close: DEFAULT_CLOSE });
}

export function normalizeOpeningHours(input: OpeningHoursDoc): OpeningHoursDoc {
  const rowMap = new Map<OpeningHoursDayKey, OpeningHoursDaySchedule>();
  for (const row of input.rows ?? []) {
    if (OPENING_HOURS_DAY_KEYS.includes(row.dayKey)) {
      rowMap.set(row.dayKey, normalizeDaySchedule(row));
    }
  }

  return {
    isPublished: Boolean(input.isPublished),
    updatedAtUtc: input.updatedAtUtc,
    rows: OPENING_HOURS_DAY_KEYS.map(
      (dayKey) => rowMap.get(dayKey) ?? DEFAULT_OPENING_HOURS.rows.find((r) => r.dayKey === dayKey)!,
    ),
  };
}

export function openingHoursSnapshot(doc: OpeningHoursDoc): string {
  return JSON.stringify(normalizeOpeningHours(doc));
}

export function resolvePublicOpeningHours(remote: OpeningHoursDoc | null | undefined): OpeningHoursDoc {
  if (remote?.isPublished) return normalizeOpeningHours(remote);
  return DEFAULT_OPENING_HOURS;
}
