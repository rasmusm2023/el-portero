/**
 * Mock availability — replace with API / Baemingo / Tock when integrated.
 * Uses rolling dates from “today” so the demo stays meaningful.
 */

function toIsoLocal(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function startOfDay(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

/** Dates on which every seat is taken (calendar disables the whole day). */
export function getFullyBookedDates(now = new Date()): Set<string> {
  const t = startOfDay(now);
  const fully = new Date(t);
  fully.setDate(fully.getDate() + 10);
  return new Set([toIsoLocal(fully)]);
}

/** Time slots (HH:mm) not bookable for this date — partial availability. */
export function getUnavailableTimesForDate(iso: string, now = new Date()): Set<string> {
  const t = startOfDay(now);
  const partial = new Date(t);
  partial.setDate(partial.getDate() + 5);
  if (toIsoLocal(partial) !== iso) {
    return new Set();
  }
  return new Set(["19:00", "19:30", "20:00"]);
}

export function isDateFullyBooked(iso: string, now = new Date()): boolean {
  return getFullyBookedDates(now).has(iso);
}

export function isTimeSlotBooked(isoDate: string, timeHHmm: string, now = new Date()): boolean {
  return getUnavailableTimesForDate(isoDate, now).has(timeHHmm);
}

/** True when the date has at least one bookable slot (for messaging). */
export function hasAnyAvailableTime(iso: string, allSlots: string[], now = new Date()): boolean {
  const blocked = getUnavailableTimesForDate(iso, now);
  return allSlots.some((s) => !blocked.has(s));
}
