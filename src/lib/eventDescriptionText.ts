import type { Locale } from "@/i18n/strings";
import type { LocaleTrio } from "@/lib/publicEventTypes";

const LOCALES: Locale[] = ["en", "es", "sv"];

export type EventDescriptionLines = Record<Locale, string[]>;

export function normalizeEventDescriptionText(text: string): string {
  return text
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/&(?:#10|#x0a|NewLine);/gi, "\n")
    .replace(/[\u2028\u2029]/g, "\n")
    .replace(/\r\n?/g, "\n")
    .replace(/\\n/g, "\n");
}

export function eventDescriptionLinesFromText(text: string): string[] {
  return normalizeEventDescriptionText(text).split("\n");
}

export function eventDescriptionTextFromLines(lines: unknown): string | null {
  if (!Array.isArray(lines)) return null;
  return lines.map((line) => String(line ?? "")).join("\n");
}

export function eventDescriptionLinesFromLocaleTrio(excerpt: LocaleTrio): EventDescriptionLines {
  return {
    en: eventDescriptionLinesFromText(excerpt.en),
    es: eventDescriptionLinesFromText(excerpt.es),
    sv: eventDescriptionLinesFromText(excerpt.sv),
  };
}

export function normalizeEventDescriptionLocaleTrio(excerpt: LocaleTrio): LocaleTrio {
  return {
    en: normalizeEventDescriptionText(excerpt.en),
    es: normalizeEventDescriptionText(excerpt.es),
    sv: normalizeEventDescriptionText(excerpt.sv),
  };
}

export function resolveEventDescriptionText(
  excerpt: LocaleTrio,
  linesByLocale: unknown,
): LocaleTrio {
  const linesRecord =
    linesByLocale && typeof linesByLocale === "object"
      ? (linesByLocale as Partial<Record<Locale, unknown>>)
      : {};

  return LOCALES.reduce<LocaleTrio>(
    (out, locale) => {
      const fromLines = eventDescriptionTextFromLines(linesRecord[locale]);
      out[locale] = fromLines ?? normalizeEventDescriptionText(excerpt[locale]);
      return out;
    },
    { en: "", es: "", sv: "" },
  );
}
