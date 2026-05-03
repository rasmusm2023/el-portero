import {
  DEFAULT_EVENT_PLACE,
  DEFAULT_EVENT_TIME_END,
  DEFAULT_EVENT_TIME_START,
  type HomeEvent,
  type LocaleTrio,
} from "@/lib/publicEventTypes";

function padHm(h: number, m: number) {
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

/** Half-hour slots from 11:00 through 23:30 (24h strings). */
export const EVENT_TIME_OPTIONS: string[] = (() => {
  const out: string[] = [];
  for (let h = 11; h <= 22; h++) {
    out.push(padHm(h, 0), padHm(h, 30));
  }
  out.push(padHm(23, 0), padHm(23, 30));
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

export function formatTimeDetailLine(start: string, end: string, place: string): string {
  const p = place.trim() || DEFAULT_EVENT_PLACE;
  return `${start.trim()}-${end.trim()} · ${p}`;
}

function sameTrio(t: LocaleTrio, line: string): LocaleTrio {
  return { en: line, es: line, sv: line };
}

/** Sync `timeDetail` from slot fields + place. */
export function applySlotsToTimeDetail(ev: HomeEvent): HomeEvent {
  const start = ev.timeSlotStart?.trim() || DEFAULT_EVENT_TIME_START;
  const end = ev.timeSlotEnd?.trim() || DEFAULT_EVENT_TIME_END;
  const place = ev.eventPlace?.trim() || DEFAULT_EVENT_PLACE;
  const line = formatTimeDetailLine(start, end, place);
  return {
    ...ev,
    timeSlotStart: start,
    timeSlotEnd: end,
    eventPlace: place,
    timeDetail: sameTrio(ev.timeDetail, line),
  };
}

const TIME_LINE_RE =
  /^(\d{1,2}:\d{2})\s*[-\u2013]\s*(\d{1,2}:\d{2})\s*·\s*(.+)$/u;

function normalizeHm(raw: string): string | null {
  const m = /^(\d{1,2}):(\d{2})$/.exec(raw.trim());
  if (!m) return null;
  const h = Number(m[1]);
  const min = Number(m[2]);
  if (h < 0 || h > 23 || min < 0 || min > 59) return null;
  return padHm(h, min);
}

/** Try to recover slots + place from an existing display line (e.g. legacy Firestore). */
export function parseTimeLine(line: string): { start: string; end: string; place: string } | null {
  const m = TIME_LINE_RE.exec(line.trim());
  if (!m) return null;
  const s = normalizeHm(m[1]);
  const e = normalizeHm(m[2]);
  if (!s || !e) return null;
  return { start: s, end: e, place: m[3].trim() || DEFAULT_EVENT_PLACE };
}

export function normalizeEventForEditor(ev: HomeEvent): HomeEvent {
  let start = ev.timeSlotStart?.trim();
  let end = ev.timeSlotEnd?.trim();
  let place = ev.eventPlace?.trim();

  if (!start || !end) {
    const parsed =
      parseTimeLine(ev.timeDetail.en) ??
      parseTimeLine(ev.timeDetail.sv) ??
      parseTimeLine(ev.timeDetail.es);
    if (parsed) {
      start = start || parsed.start;
      end = end || parsed.end;
      place = place || parsed.place;
    }
  }

  start = start || DEFAULT_EVENT_TIME_START;
  end = end || DEFAULT_EVENT_TIME_END;
  place = place || DEFAULT_EVENT_PLACE;

  const withSlots: HomeEvent = {
    ...ev,
    timeSlotStart: start,
    timeSlotEnd: end,
    eventPlace: place,
  };
  return applySlotsToTimeDetail(withSlots);
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

/**
 * True when the event should be treated as over (Madrid wall clock): after `sortDate` at end time,
 * or on an earlier calendar day. Used in the admin list only.
 */
export function isEventPastForAdmin(ev: HomeEvent, now = new Date()): boolean {
  if (!ev.sortDate) return false;
  const { ymd: madridYmd, minutes: nowMin } = madridWallYmdHm(now);
  if (ev.sortDate < madridYmd) return true;
  if (ev.sortDate > madridYmd) return false;

  const endHm = ev.timeSlotEnd?.trim();
  let endMin: number | null = endHm ? parseHmToMinutes(endHm) : null;
  if (endMin == null) {
    const parsed =
      parseTimeLine(ev.timeDetail.en) ??
      parseTimeLine(ev.timeDetail.sv) ??
      parseTimeLine(ev.timeDetail.es);
    endMin = parsed ? parseHmToMinutes(parsed.end) : null;
  }
  if (endMin == null) return false;
  return nowMin >= endMin;
}

export function suggestDuplicateEventId(originalId: string): string {
  const base = originalId.trim().slice(0, 48);
  const suffix = `-${Math.random().toString(36).slice(2, 8)}`;
  const candidate = `${base}${suffix}`;
  if (candidate.length <= 64) return candidate;
  return `event${suffix}`;
}

/** If `end` is before `start` on the clock, return the first option in `EVENT_TIME_OPTIONS` that is not before `start`. */
export function clampEndAfterStart(start: string, end: string): string {
  const sm = parseHmToMinutes(start);
  const em = parseHmToMinutes(end);
  if (sm == null || em == null) return end;
  if (em >= sm) return end;
  const pick = EVENT_TIME_OPTIONS.find((opt) => {
    const om = parseHmToMinutes(opt);
    return om != null && om >= sm;
  });
  return pick ?? end;
}
