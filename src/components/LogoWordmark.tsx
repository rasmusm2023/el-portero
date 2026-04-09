"use client";

import { t } from "@/i18n/strings";
import type { Locale } from "@/i18n/strings";
import { useLocale } from "@/i18n/useLocale";

type LogoWordmarkProps = {
  size: "header" | "hero" | "footer";
  className?: string;
  /** “Dinner Club” in light sans below the wordmark. */
  showTagline?: boolean;
  /** Horizontal alignment of the stacked wordmark + tagline. */
  align?: "center" | "start";
  /** When set, overrides hook locale (e.g. rare static use). */
  locale?: Locale;
};

const wordmarkSizeClasses: Record<LogoWordmarkProps["size"], string> = {
  header: "text-2xl sm:text-3xl lg:text-4xl xl:text-[2.75rem]",
  hero: "text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-[6rem]",
  footer: "text-3xl",
};

const taglineClasses: Record<LogoWordmarkProps["size"], string> = {
  header:
    "font-sans text-[10px] font-light uppercase tracking-[0.38em] text-current/75 sm:text-xs sm:tracking-[0.42em]",
  hero: "font-sans text-base font-light uppercase tracking-[0.32em] text-current/85 sm:text-lg sm:tracking-[0.36em] md:text-xl",
  footer:
    "font-sans text-[10px] font-light uppercase tracking-[0.35em] text-current/70 sm:text-xs",
};

/**
 * Brand wordmark: “el” + “PORTERO”, optional “Dinner Club” tagline (light sans).
 */
export function LogoWordmark({
  size,
  className = "",
  showTagline = false,
  align = "center",
  locale: localeProp,
}: LogoWordmarkProps) {
  const { locale: localeHook } = useLocale();
  const locale = localeProp ?? localeHook;

  const alignClass = align === "start" ? "items-start" : "items-center";

  return (
    <span
      className={`flex flex-col gap-1.5 leading-none transition-colors duration-300 ${alignClass} ${wordmarkSizeClasses[size]} ${className}`}
    >
      <span className="inline-flex items-baseline gap-x-[0.2em] whitespace-nowrap font-logo">
        <span className="text-[0.58em] font-normal lowercase">el</span>
        <span className="font-bold uppercase tracking-[0.09em]">PORTERO</span>
      </span>
      {showTagline ? (
        <span className={taglineClasses[size]}>
          {t(locale, "brand.dinnerClub")}
        </span>
      ) : null}
    </span>
  );
}
