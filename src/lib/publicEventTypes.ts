import type { Locale } from "@/i18n/strings";
import { emptyLocaleTrio, localeTrioFromPartial } from "@/i18n/localeMeta";
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
   * Published from localhost. Shown on the dev site only.
   * The live site skips these even when `published` is true.
   */
  localOnly?: boolean;
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
  /** Firebase Storage object path when the photo was uploaded from admin (used to delete the file). */
  imageStoragePath?: string;
};

export type PublicEventApiDto = {
  id: string;
  sortDate: string;
  fullyBooked: boolean;
  hasSpecificTime?: boolean;
  weekdayDate: LocaleTrio;
  timeDetail: LocaleTrio;
  title: LocaleTrio;
  excerpt: LocaleTrio;
  excerptLines?: Partial<Record<Locale, string[]>>;
  imageSrc: string;
  imageAlt: LocaleTrio;
  imageStoragePath?: string;
  updatedAtUtc: string;
};

export function publicEventFromDto(d: PublicEventApiDto): HomeEvent {
  const excerpt = localeTrioFromPartial(d.excerpt);
  return {
    id: d.id,
    sortDate: d.sortDate,
    published: true,
    fullyBooked: d.fullyBooked,
    hasSpecificTime: d.hasSpecificTime ?? true,
    weekdayDate: localeTrioFromPartial(d.weekdayDate),
    timeDetail: localeTrioFromPartial(d.timeDetail),
    title: localeTrioFromPartial(d.title),
    excerpt,
    excerptLines: d.excerptLines as HomeEvent["excerptLines"],
    imageSrc: d.imageSrc,
    imageAlt: localeTrioFromPartial(d.imageAlt),
    imageStoragePath: d.imageStoragePath,
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
    weekdayDate: ev.weekdayDate,
    timeDetail: ev.timeDetail,
    title: ev.title,
    excerpt,
    excerptLines: eventDescriptionLinesFromLocaleTrio(excerpt),
    imageSrc: ev.imageSrc,
    imageAlt: ev.imageAlt,
    imageStoragePath: ev.imageStoragePath,
  };
}

export function emptyHomeEvent(ymd: string): HomeEvent {
  const empty = emptyLocaleTrio("");
  return syncDerivedEventFields({
    id: "",
    sortDate: ymd,
    published: true,
    hasSpecificTime: true,
    timeSlotStart: DEFAULT_EVENT_TIME_START,
    timeSlotEnd: DEFAULT_EVENT_TIME_END,
    fullyBooked: false,
    weekdayDate: empty,
    timeDetail: empty,
    title: empty,
    excerpt: empty,
    imageSrc: "",
    imageAlt: empty,
  });
}
