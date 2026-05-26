import type { Locale } from "@/i18n/strings";
import { t } from "@/i18n/strings";
import {
  OPENING_HOURS_DAY_KEYS,
  type OpeningHoursDayKey,
  type OpeningHoursDaySchedule,
  type OpeningHoursDoc,
} from "@/lib/openingHoursTypes";

const JS_DAY_TO_KEY: OpeningHoursDayKey[] = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];

function parseHmToMinutes(hm: string): number | null {
  const m = /^(\d{1,2}):(\d{2})$/.exec(hm.trim());
  if (!m) return null;
  const h = Number(m[1]);
  const min = Number(m[2]);
  if (h < 0 || h > 23 || min < 0 || min > 59) return null;
  return h * 60 + min;
}

function getMadridNowMinutes(): number {
  const dtf = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Europe/Madrid",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
  const parts = dtf.formatToParts(new Date());
  const hour = Number(parts.find((p) => p.type === "hour")?.value ?? "0");
  const minute = Number(parts.find((p) => p.type === "minute")?.value ?? "0");
  return hour * 60 + minute;
}

function getMadridWeekdayIndex(): number {
  const wd = new Intl.DateTimeFormat("en-US", {
    timeZone: "Europe/Madrid",
    weekday: "short",
  }).format(new Date());
  const map: Record<string, number> = {
    Sun: 0,
    Mon: 1,
    Tue: 2,
    Wed: 3,
    Thu: 4,
    Fri: 5,
    Sat: 6,
  };
  return map[wd] ?? new Date().getDay();
}

function getTodayKey(): OpeningHoursDayKey {
  return JS_DAY_TO_KEY[getMadridWeekdayIndex()] ?? "mon";
}

function scheduleForDay(doc: OpeningHoursDoc, dayKey: OpeningHoursDayKey): OpeningHoursDaySchedule | null {
  return doc.rows.find((r) => r.dayKey === dayKey) ?? null;
}

function isOpenAtMinutes(nowMin: number, openMin: number, closeMin: number): boolean {
  const crossesMidnight = closeMin <= openMin;
  return crossesMidnight
    ? nowMin >= openMin || nowMin < closeMin
    : nowMin >= openMin && nowMin < closeMin;
}

function dayPublicLabel(locale: Locale, dayKey: OpeningHoursDayKey): string {
  const key = `openingHours.day.${dayKey}` as const;
  return t(locale, key);
}

function findNextOpenDay(
  doc: OpeningHoursDoc,
  fromKey: OpeningHoursDayKey,
): { dayKey: OpeningHoursDayKey; open: string } | null {
  const start = OPENING_HOURS_DAY_KEYS.indexOf(fromKey);
  for (let offset = 1; offset <= 7; offset++) {
    const key = OPENING_HOURS_DAY_KEYS[(start + offset) % 7];
    const row = scheduleForDay(doc, key);
    if (row && !row.closed) {
      return { dayKey: key, open: row.open };
    }
  }
  return null;
}

export type VenueStatus = {
  isOpen: boolean;
  label: string;
  detail: string;
};

export function formatDayHoursLine(locale: Locale, row: OpeningHoursDaySchedule): string {
  if (row.closed) {
    return t(locale, "openingHours.closed");
  }
  return `${row.open} – ${row.close}`;
}

export function getVenueStatus(locale: Locale, doc: OpeningHoursDoc): VenueStatus {
  const todayKey = getTodayKey();
  const today = scheduleForDay(doc, todayKey);
  const minutes = getMadridNowMinutes();

  const strings =
    locale === "es"
      ? {
          open: "Abierto ahora",
          closed: "Cerrado ahora",
          closesAt: "Cierra a las",
          opensAt: "Abre a las",
          today: "hoy",
          closedToday: "Cerrado hoy",
        }
      : locale === "sv"
        ? {
            open: "Öppet nu",
            closed: "Stängt nu",
            closesAt: "Stänger",
            opensAt: "Öppnar",
            today: "i dag",
            closedToday: "Stängt idag",
          }
        : {
            open: "Open now",
            closed: "Closed now",
            closesAt: "Closes at",
            opensAt: "Opens at",
            today: "tonight",
            closedToday: "Closed today",
          };

  if (!today || today.closed) {
    const next = findNextOpenDay(doc, todayKey);
    const detail = next
      ? `${strings.opensAt} ${next.open} (${dayPublicLabel(locale, next.dayKey)})`
      : strings.closedToday;
    return {
      isOpen: false,
      label: strings.closed,
      detail,
    };
  }

  const openMin = parseHmToMinutes(today.open) ?? 17 * 60;
  const closeMin = parseHmToMinutes(today.close) ?? 60;
  const isOpen = isOpenAtMinutes(minutes, openMin, closeMin);

  if (isOpen) {
    return {
      isOpen: true,
      label: strings.open,
      detail: `${strings.closesAt} ${today.close} (${strings.today})`,
    };
  }

  return {
    isOpen: false,
    label: strings.closed,
    detail: `${strings.opensAt} ${today.open} (${strings.today})`,
  };
}
