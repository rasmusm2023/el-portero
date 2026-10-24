import { locales, type Locale } from "@/i18n/strings";

type LocaleMap = Record<Locale, string>;

/** Staff form + date preview. English is the default, then the rest of the public set. */
export const adminContentLocales: Locale[] = ["en", "es", "sv", "de", "fr"];

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

export function localeFieldFilled(
  trio: Partial<Record<Locale, string>> | null | undefined,
  locale: Locale,
): boolean {
  return Boolean(trio?.[locale]?.trim());
}

/** True when this language has a title or description of its own (no fallback). */
export function eventCopyFilled(
  title: Partial<Record<Locale, string>> | null | undefined,
  excerpt: Partial<Record<Locale, string>> | null | undefined,
  locale: Locale,
): boolean {
  return localeFieldFilled(title, locale) || localeFieldFilled(excerpt, locale);
}

/**
 * Prefer `preferred`, then English, then any filled language.
 * Used so Translate still works when the preview language is empty.
 */
export function pickTranslateSourceLocale(
  title: Partial<Record<Locale, string>> | null | undefined,
  excerpt: Partial<Record<Locale, string>> | null | undefined,
  preferred: Locale,
): Locale | null {
  const rest = locales.filter((code) => code !== preferred && code !== "en");
  const order: Locale[] = [preferred, "en", ...rest];
  for (const code of order) {
    if (eventCopyFilled(title, excerpt, code)) return code;
  }
  return null;
}

/** Copy incoming values only into locales that are still empty. */
export function fillEmptyLocaleTrio(existing: LocaleMap, incoming: LocaleMap): LocaleMap {
  const out = { ...existing };
  for (const code of locales) {
    if (!out[code]?.trim() && incoming[code]?.trim()) {
      out[code] = incoming[code];
    }
  }
  return out;
}

const detectedLanguageAliases: Record<string, Locale> = {
  swedish: "sv",
  svenska: "sv",
  english: "en",
  engelska: "en",
  spanish: "es",
  espanol: "es",
  español: "es",
  german: "de",
  deutsch: "de",
  french: "fr",
  francais: "fr",
  français: "fr",
};

export function localeFromDetectedLanguage(value: string | null | undefined): Locale | null {
  const key = value?.trim().toLowerCase() ?? "";
  if (!key) return null;
  if (isLocale(key)) return key;
  return detectedLanguageAliases[key] ?? null;
}

/** A non-empty language label that is not Swedish, English, Spanish, German, or French. */
function isOtherDetectedLanguage(value: string | null | undefined): boolean {
  const key = value?.trim().toLowerCase() ?? "";
  return key.length > 0 && localeFromDetectedLanguage(key) == null;
}

/**
 * Keep text that was typed into the wrong language box in the language it
 * was actually written in, and put that box's translation in its place.
 */
export function applyTranslatedLocaleTrio(
  existing: LocaleMap,
  incoming: LocaleMap,
  sourceLocale: Locale,
  detectedLanguage: string | null | undefined,
  original: string,
): { trio: LocaleMap; correctedTo: Locale | null } {
  const detected = localeFromDetectedLanguage(detectedLanguage);
  const out = { ...existing };
  const sourceText = existing[sourceLocale]?.trim() ?? "";
  const originalText = original.trim();
  let correctedTo: Locale | null = null;

  if (detected && detected !== sourceLocale && sourceText && originalText) {
    correctedTo = detected;
    if (!out[detected]?.trim()) out[detected] = originalText;
    if (incoming[sourceLocale]?.trim()) out[sourceLocale] = incoming[sourceLocale];
  } else if (isOtherDetectedLanguage(detectedLanguage) && sourceText && incoming[sourceLocale]?.trim()) {
    out[sourceLocale] = incoming[sourceLocale];
  }

  return { trio: fillEmptyLocaleTrio(out, incoming), correctedTo };
}
