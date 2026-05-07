import type { Locale } from "@/i18n/strings";
import type { HomeEvent } from "@/lib/publicEventTypes";

function intlLocaleTag(locale: Locale): string {
  if (locale === "sv") return "sv-SE";
  if (locale === "es") return "es-ES";
  return "en-GB";
}

/**
 * Format the admin "Calendar date" (`YYYY-MM-DD`) for public copy.
 * Uses Europe/Madrid so the labeled day matches the venue calendar.
 */
export function formatSortDateForEventDisplay(sortDate: string, locale: Locale): string {
  const trimmed = sortDate.trim();
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(trimmed);
  if (!match) return trimmed;
  const y = Number(match[1]);
  const mo = Number(match[2]) - 1;
  const d = Number(match[3]);
  const utc = new Date(Date.UTC(y, mo, d, 12, 0, 0));
  return new Intl.DateTimeFormat(intlLocaleTag(locale), {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Europe/Madrid",
  }).format(utc);
}

/** Prefer CMS "Weekday + date"; if empty for this locale, derive from `sortDate`. */
export function eventCardDateLabel(ev: HomeEvent, locale: Locale): string {
  const custom = (ev.weekdayDate[locale] ?? "").trim();
  if (custom) return custom;
  return formatSortDateForEventDisplay(ev.sortDate, locale);
}
