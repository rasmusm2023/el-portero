import { emptyLocaleTrio } from "@/i18n/localeMeta";
import { weekdayDateFromSortDate } from "@/lib/eventDisplayDate";
import {
  DEFAULT_EVENT_PLACE,
  DEFAULT_EVENT_TIME_END,
  DEFAULT_EVENT_TIME_START,
  type HomeEvent,
  type LocaleTrio,
} from "@/lib/publicEventTypes";

/** Sync auto-generated date labels and time line (fixed venue) before save or after calendar edits. */
export function syncDerivedEventFields(ev: HomeEvent): HomeEvent {
  return applySlotsToTimeDetail({
    ...ev,
    weekdayDate: weekdayDateFromSortDate(ev.sortDate),
    eventPlace: undefined,
  });
}

function padHm(h: number, m: number) {
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

/** Half-hour slots for the full day (00:00 through 23:30, 24h strings). */
export const EVENT_TIME_OPTIONS: string[] = (() => {
  const out: string[] = [];
  for (let h = 0; h <= 23; h++) {
    out.push(padHm(h, 0), padHm(h, 30));
  }
  return out;
})();


/** `HH:mm` → minutes since midnight; invalid → null. */
export function parseHmToMinutes(hm: string): number | null {
  const m = /^(\d{1,2}):(\d{2})$/.exec(hm.trim());
  if (!m) return null;
  const h = Number(m[1]);
  const min = Number(m[2]);
  if (h < 0 || h > 23 || min < 0 || min > 59) return null;
  return h * 60 + min;
}

/** Start–end only (24h). Older docs may still store `19:30-23:00 · Torrevieja`. */
export function formatTimeDetailLine(start: string, end: string): string {
  return `${start.trim()}-${end.trim()}`;
}

function sameTrio(_t: LocaleTrio, line: string): LocaleTrio {
  return emptyLocaleTrio(line);
}

/** Sync `timeDetail` from start/end slots. */
export function applySlotsToTimeDetail(ev: HomeEvent): HomeEvent {
  if (ev.hasSpecificTime === false) {
    return {
      ...ev,
      timeSlotStart: undefined,
      timeSlotEnd: undefined,
      eventPlace: undefined,
      timeDetail: sameTrio(ev.timeDetail, ""),
    };
  }
  const start = ev.timeSlotStart?.trim() || DEFAULT_EVENT_TIME_START;
  const end = ev.timeSlotEnd?.trim() || DEFAULT_EVENT_TIME_END;
  const line = formatTimeDetailLine(start, end);
  return {
    ...ev,
    hasSpecificTime: ev.hasSpecificTime ?? true,
    timeSlotStart: start,
    timeSlotEnd: end,
    eventPlace: undefined,
    timeDetail: sameTrio(ev.timeDetail, line),
  };
}

const TIME_LINE_RE =
  /^(\d{1,2}:\d{2})\s*[-\u2013]\s*(\d{1,2}:\d{2})(?:\s*·\s*(.+))?$/u;

function normalizeHm(raw: string): string | null {
  const m = /^(\d{1,2}):(\d{2})$/.exec(raw.trim());
  if (!m) return null;
  const h = Number(m[1]);
  const min = Number(m[2]);
  if (h < 0 || h > 23 || min < 0 || min > 59) return null;
  return padHm(h, min);
}

/** Try to recover slots from an existing display line (times only, or legacy `times · place`). */
export function parseTimeLine(line: string): { start: string; end: string; place: string } | null {
  const m = TIME_LINE_RE.exec(line.trim());
  if (!m) return null;
  const s = normalizeHm(m[1]);
  const e = normalizeHm(m[2]);
  if (!s || !e) return null;
  return { start: s, end: e, place: (m[3] ?? "").trim() || DEFAULT_EVENT_PLACE };
}

/** Drop a leftover venue suffix so guests only see the clock times. */
export function timesOnlyLine(line: string): string {
  const parsed = parseTimeLine(line);
  if (parsed) return formatTimeDetailLine(parsed.start, parsed.end);
  return line.replace(/\s*·\s*.+$/u, "").trim();
}

export function normalizeEventForEditor(ev: HomeEvent): HomeEvent {
  let start = ev.timeSlotStart?.trim();
  let end = ev.timeSlotEnd?.trim();

  const timeDetailLine =
    (ev.timeDetail?.en ?? "").trim() ||
    (ev.timeDetail?.sv ?? "").trim() ||
    (ev.timeDetail?.es ?? "").trim();

  const hasSpecificTime = ev.hasSpecificTime ?? Boolean(timeDetailLine || start || end);

  if (!hasSpecificTime) {
    return syncDerivedEventFields(
      applySlotsToTimeDetail({
        ...ev,
        hasSpecificTime: false,
        timeSlotStart: undefined,
        timeSlotEnd: undefined,
        eventPlace: undefined,
        timeDetail: sameTrio(ev.timeDetail, ""),
      }),
    );
  }

  if (!start || !end) {
    const parsed =
      parseTimeLine(ev.timeDetail.en) ??
      parseTimeLine(ev.timeDetail.sv) ??
      parseTimeLine(ev.timeDetail.es);
    if (parsed) {
      start = start || parsed.start;
      end = end || parsed.end;
    }
  }

  start = start || DEFAULT_EVENT_TIME_START;
  end = end || DEFAULT_EVENT_TIME_END;

  const withSlots: HomeEvent = {
    ...ev,
    hasSpecificTime: true,
    timeSlotStart: start,
    timeSlotEnd: end,
    eventPlace: undefined,
  };
  return syncDerivedEventFields(applySlotsToTimeDetail(withSlots));
}

function madridWallYmdHm(now: Date): { ymd: string; minutes: number } {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Madrid",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(now);

  const get = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((p) => p.type === type)?.value ?? "";

  const ymd = `${get("year")}-${get("month")}-${get("day")}`;
  const h = Number(get("hour"));
  const mi = Number(get("minute"));
  const minutes = h * 60 + mi;
  return { ymd, minutes };
}

/** Ends at or before this clock time can mean “next morning” when they are before the start. */
const OVERNIGHT_END_LIMIT_MINUTES = 6 * 60;

function addDaysYmd(ymd: string, days: number): string | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(ymd.trim());
  if (!match) return null;
  const utc = new Date(Date.UTC(Number(match[1]), Number(match[2]) - 1, Number(match[3]) + days));
  const year = utc.getUTCFullYear();
  const month = String(utc.getUTCMonth() + 1).padStart(2, "0");
  const day = String(utc.getUTCDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/**
 * An end earlier than the start, through 06:00, finishes after midnight
 * (19:30–02:00). Later backwards times stay invalid same-day ranges.
 */
export function eventEndsNextMorning(start: string, end: string): boolean {
  const startMin = parseHmToMinutes(start);
  const endMin = parseHmToMinutes(end);
  if (startMin == null || endMin == null) return false;
  return endMin < startMin && endMin <= OVERNIGHT_END_LIMIT_MINUTES;
}

/**
 * True when the event should be treated as over (Madrid wall clock): after `sortDate` at end time,
 * or on an earlier calendar day. An end through 06:00 that is before the start finishes the next morning.
 */
export function isEventPastForAdmin(ev: HomeEvent, now = new Date()): boolean {
  if (!ev.sortDate) return false;
  const { ymd: madridYmd, minutes: nowMin } = madridWallYmdHm(now);

  const parsed =
    parseTimeLine(ev.timeDetail?.en ?? "") ??
    parseTimeLine(ev.timeDetail?.sv ?? "") ??
    parseTimeLine(ev.timeDetail?.es ?? "");
  const startHm = ev.timeSlotStart?.trim() || parsed?.start || "";
  const endHm = ev.timeSlotEnd?.trim() || parsed?.end || "";
  const startMin = startHm ? parseHmToMinutes(startHm) : null;
  const endMin = endHm ? parseHmToMinutes(endHm) : null;
  const overnight =
    startMin != null &&
    endMin != null &&
    eventEndsNextMorning(startHm, endHm);

  if (!overnight) {
    if (ev.sortDate < madridYmd) return true;
    if (ev.sortDate > madridYmd) return false;
    if (endMin == null) return false;
    return nowMin >= endMin;
  }

  const endDay = addDaysYmd(ev.sortDate, 1);
  if (!endDay) return ev.sortDate < madridYmd;
  if (madridYmd < ev.sortDate) return false;
  if (madridYmd > endDay) return true;
  if (madridYmd === ev.sortDate) return false;
  return nowMin >= endMin;
}

/** Guests only see published events that have not ended yet. */
export function isPublicEventVisible(ev: HomeEvent, now = new Date()): boolean {
  return ev.published !== false && !isEventPastForAdmin(ev, now);
}

export function suggestDuplicateEventId(originalId: string): string {
  const base = originalId.trim().slice(0, 48);
  const suffix = `-${Math.random().toString(36).slice(2, 8)}`;
  const candidate = `${base}${suffix}`;
  if (candidate.length <= 64) return candidate;
  return `event${suffix}`;
}

/**
 * Keep an end that is the same evening or the next morning (through 06:00).
 * Any other end before the start is pulled forward to the start.
 */
export function clampEndAfterStart(start: string, end: string): string {
  const sm = parseHmToMinutes(start);
  const em = parseHmToMinutes(end);
  if (sm == null || em == null) return end;
  if (em >= sm || eventEndsNextMorning(start, end)) return end;
  const pick = EVENT_TIME_OPTIONS.find((opt) => {
    const om = parseHmToMinutes(opt);
    return om != null && om >= sm;
  });
  return pick ?? end;
}
