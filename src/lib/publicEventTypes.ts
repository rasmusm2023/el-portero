import type { Locale } from "@/i18n/strings";
import {
  eventDescriptionLinesFromLocaleTrio,
  normalizeEventDescriptionLocaleTrio,
} from "@/lib/eventDescriptionText";
import { syncDerivedEventFields } from "@/lib/eventSchedule";

export type LocaleTrio = Record<Locale, string>;

/** Defaults for new events / editor (keep aligned with `eventSchedule.ts` helpers). */
export const DEFAULT_EVENT_TIME_START = "19:30";
export const DEFAULT_EVENT_TIME_END = "23:00";
export const DEFAULT_EVENT_PLACE = "Torrevieja";

export type HomeEvent = {
  id: string;
  sortDate: string;
  /** When false, hidden on the public site (draft). Missing in older Firestore docs = published. */
  published?: boolean;
  /**
   * When false, the event has no specific time/place and the public UI should not display a time line.
   * Kept optional so older Firestore docs default to “true”.
   */
  hasSpecificTime?: boolean;
  /** HH:mm (24h). Drives the shared `timeDetail` line together with `timeSlotEnd` and `eventPlace`. */
  timeSlotStart?: string;
  timeSlotEnd?: string;
  /** Appended after times in `timeDetail` (same for all locales). */
  eventPlace?: string;
  fullyBooked?: boolean;
  weekdayDate: LocaleTrio;
  timeDetail: LocaleTrio;
  title: LocaleTrio;
  excerpt: LocaleTrio;
  /** Explicit textarea line model. Used so public cards can reproduce staff-entered line breaks exactly. */
  excerptLines?: Record<Locale, string[]>;
  imageSrc: string;
  imageAlt: LocaleTrio;
};

export type PublicEventApiDto = {
  id: string;
  sortDate: string;
  fullyBooked: boolean;
  hasSpecificTime?: boolean;
  weekdayDate: { en: string; es: string; sv: string };
  timeDetail: { en: string; es: string; sv: string };
  title: { en: string; es: string; sv: string };
  excerpt: { en: string; es: string; sv: string };
  excerptLines?: { en?: string[]; es?: string[]; sv?: string[] };
  imageSrc: string;
  imageAlt: { en: string; es: string; sv: string };
  updatedAtUtc: string;
};

export function publicEventFromDto(d: PublicEventApiDto): HomeEvent {
  return {
    id: d.id,
    sortDate: d.sortDate,
    published: true,
    fullyBooked: d.fullyBooked,
    hasSpecificTime: d.hasSpecificTime ?? true,
    weekdayDate: { en: d.weekdayDate.en, es: d.weekdayDate.es, sv: d.weekdayDate.sv },
    timeDetail: { en: d.timeDetail.en, es: d.timeDetail.es, sv: d.timeDetail.sv },
    title: { en: d.title.en, es: d.title.es, sv: d.title.sv },
    excerpt: { en: d.excerpt.en, es: d.excerpt.es, sv: d.excerpt.sv },
    excerptLines: {
      en: d.excerptLines?.en ?? [],
      es: d.excerptLines?.es ?? [],
      sv: d.excerptLines?.sv ?? [],
    },
    imageSrc: d.imageSrc,
    imageAlt: { en: d.imageAlt.en, es: d.imageAlt.es, sv: d.imageAlt.sv },
  };
}

export function toUpsertBody(ev: HomeEvent) {
  const excerpt = normalizeEventDescriptionLocaleTrio(ev.excerpt);
  return {
    id: ev.id,
    sortDate: ev.sortDate,
    published: ev.published !== false,
    hasSpecificTime: ev.hasSpecificTime ?? true,
    timeSlotStart: ev.timeSlotStart ?? DEFAULT_EVENT_TIME_START,
    timeSlotEnd: ev.timeSlotEnd ?? DEFAULT_EVENT_TIME_END,
    fullyBooked: ev.fullyBooked ?? false,
    weekdayDate: { en: ev.weekdayDate.en, es: ev.weekdayDate.es, sv: ev.weekdayDate.sv },
    timeDetail: { en: ev.timeDetail.en, es: ev.timeDetail.es, sv: ev.timeDetail.sv },
    title: { en: ev.title.en, es: ev.title.es, sv: ev.title.sv },
    excerpt: { en: excerpt.en, es: excerpt.es, sv: excerpt.sv },
    excerptLines: eventDescriptionLinesFromLocaleTrio(excerpt),
    imageSrc: ev.imageSrc,
    imageAlt: { en: ev.imageAlt.en, es: ev.imageAlt.es, sv: ev.imageAlt.sv },
  };
}

export function emptyHomeEvent(ymd: string): HomeEvent {
  const empty = (v: string): LocaleTrio => ({ en: v, es: v, sv: v });
  return syncDerivedEventFields({
    id: "",
    sortDate: ymd,
    published: true,
    hasSpecificTime: true,
    timeSlotStart: DEFAULT_EVENT_TIME_START,
    timeSlotEnd: DEFAULT_EVENT_TIME_END,
    fullyBooked: false,
    weekdayDate: empty(""),
    timeDetail: empty(""),
    title: empty(""),
    excerpt: empty(""),
    imageSrc: "",
    imageAlt: empty(""),
  });
}
