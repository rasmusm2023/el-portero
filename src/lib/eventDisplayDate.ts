import type { Locale } from "@/i18n/strings";
import { emptyLocaleTrio, intlLocaleTag } from "@/i18n/localeMeta";
import { locales } from "@/i18n/strings";
import type { HomeEvent, LocaleTrio } from "@/lib/publicEventTypes";

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

/** All locale strings for the public date line, derived from `sortDate` (Europe/Madrid). */
export function weekdayDateFromSortDate(sortDate: string): LocaleTrio {
  const out = emptyLocaleTrio("");
  for (const locale of locales) {
    out[locale] = formatSortDateForEventDisplay(sortDate, locale);
  }
  return out;
}

/** Public date line from calendar date only (weekday, day, month, year per locale). */
export function eventCardDateLabel(ev: HomeEvent, locale: Locale): string {
  return formatSortDateForEventDisplay(ev.sortDate, locale);
}
