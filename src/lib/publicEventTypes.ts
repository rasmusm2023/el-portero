import type { Locale } from "@/i18n/strings";

export type LocaleTrio = Record<Locale, string>;

export type HomeEvent = {
  id: string;
  sortDate: string;
  fullyBooked?: boolean;
  weekdayDate: LocaleTrio;
  timeDetail: LocaleTrio;
  title: LocaleTrio;
  excerpt: LocaleTrio;
  imageSrc: string;
  imageAlt: LocaleTrio;
};

export type PublicEventApiDto = {
  id: string;
  sortDate: string;
  fullyBooked: boolean;
  weekdayDate: { en: string; es: string; sv: string };
  timeDetail: { en: string; es: string; sv: string };
  title: { en: string; es: string; sv: string };
  excerpt: { en: string; es: string; sv: string };
  imageSrc: string;
  imageAlt: { en: string; es: string; sv: string };
  updatedAtUtc: string;
};

export function publicEventFromDto(d: PublicEventApiDto): HomeEvent {
  return {
    id: d.id,
    sortDate: d.sortDate,
    fullyBooked: d.fullyBooked,
    weekdayDate: { en: d.weekdayDate.en, es: d.weekdayDate.es, sv: d.weekdayDate.sv },
    timeDetail: { en: d.timeDetail.en, es: d.timeDetail.es, sv: d.timeDetail.sv },
    title: { en: d.title.en, es: d.title.es, sv: d.title.sv },
    excerpt: { en: d.excerpt.en, es: d.excerpt.es, sv: d.excerpt.sv },
    imageSrc: d.imageSrc,
    imageAlt: { en: d.imageAlt.en, es: d.imageAlt.es, sv: d.imageAlt.sv },
  };
}

export function toUpsertBody(ev: HomeEvent) {
  return {
    id: ev.id,
    sortDate: ev.sortDate,
    fullyBooked: ev.fullyBooked ?? false,
    weekdayDate: { en: ev.weekdayDate.en, es: ev.weekdayDate.es, sv: ev.weekdayDate.sv },
    timeDetail: { en: ev.timeDetail.en, es: ev.timeDetail.es, sv: ev.timeDetail.sv },
    title: { en: ev.title.en, es: ev.title.es, sv: ev.title.sv },
    excerpt: { en: ev.excerpt.en, es: ev.excerpt.es, sv: ev.excerpt.sv },
    imageSrc: ev.imageSrc,
    imageAlt: { en: ev.imageAlt.en, es: ev.imageAlt.es, sv: ev.imageAlt.sv },
  };
}

export function emptyHomeEvent(ymd: string): HomeEvent {
  const empty = (v: string): LocaleTrio => ({ en: v, es: v, sv: v });
  return {
    id: "",
    sortDate: ymd,
    fullyBooked: false,
    weekdayDate: empty(""),
    timeDetail: empty(""),
    title: empty(""),
    excerpt: empty(""),
    imageSrc: "",
    imageAlt: empty(""),
  };
}
