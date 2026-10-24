import { locales, type Locale } from "@/i18n/strings";

type LocaleMap = Record<Locale, string>;

/** Staff form + date preview: Swedish first (house language), then the public set. */
export const adminContentLocales: Locale[] = ["sv", "en", "es", "de", "fr"];

export function isLocale(value: string | null | undefined): value is Locale {
  return value != null && (locales as readonly string[]).includes(value);
}

export function htmlLang(locale: Locale): string {
  return locale;
}

export function intlLocaleTag(locale: Locale): string {
  switch (locale) {
    case "sv":
      return "sv-SE";
    case "es":
      return "es-ES";
    case "de":
      return "de-DE";
    case "fr":
      return "fr-FR";
    default:
      return "en-GB";
  }
}

export function emptyLocaleTrio(value = ""): LocaleMap {
  return { en: value, es: value, sv: value, de: value, fr: value };
}

/** Display text for a locale, falling back to English then any filled language. */
export function pickLocaleText(
  trio: Partial<Record<Locale, string>> | null | undefined,
  locale: Locale,
): string {
  const direct = trio?.[locale]?.trim();
  if (direct) return direct;
  const en = trio?.en?.trim();
  if (en) return en;
  for (const code of locales) {
    const text = trio?.[code]?.trim();
    if (text) return text;
  }
  return "";
}

export function localeTrioFromPartial(raw: unknown): LocaleMap {
  const obj = raw && typeof raw === "object" ? (raw as Record<string, unknown>) : {};
  const trio = emptyLocaleTrio("");
  for (const code of locales) {
    trio[code] = typeof obj[code] === "string" ? obj[code] : "";
  }
  return trio;
}

export function sameLocaleTrio(a: LocaleMap, b: LocaleMap): boolean {
  return locales.every((code) => a[code] === b[code]);
}
