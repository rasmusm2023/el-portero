import type { Locale } from "@/i18n/strings";

const intlLocale: Record<Locale, string> = {
  en: "en-IE",
  es: "es-ES",
  sv: "sv-SE",
  de: "de-DE",
  fr: "fr-FR",
};

/** Amounts are in EUR; shown as numbers only (no symbol). */
export function formatEur(locale: Locale, amount: number): string {
  return new Intl.NumberFormat(intlLocale[locale], {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
}
