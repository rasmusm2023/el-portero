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
  /** Treat the SVG for the current surface (black logo on light, inverted on dark). */
  tone?: "onLight" | "onDark";
};

const logotypeSizeClasses: Record<LogoWordmarkProps["size"], string> = {
  header: "h-7 sm:h-8 lg:h-9 xl:h-10",
  hero: "h-14 sm:h-16 md:h-20 lg:h-24 xl:h-28",
  footer: "h-10 sm:h-11",
};

const taglineClasses: Record<LogoWordmarkProps["size"], string> = {
  header:
    "font-sans text-[10px] font-light uppercase tracking-[0.38em] sm:text-xs sm:tracking-[0.42em]",
  hero: "font-sans text-base font-light uppercase tracking-[0.32em] sm:text-lg sm:tracking-[0.36em] md:text-xl",
  footer:
    "font-sans text-[10px] font-light uppercase tracking-[0.35em] sm:text-xs",
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
  tone = "onLight",
}: LogoWordmarkProps) {
  const { locale: localeHook } = useLocale();
  const locale = localeProp ?? localeHook;

  const alignClass = align === "start" ? "items-start" : "items-center";
  const taglineColorClass =
    tone === "onDark" ? "text-paper/75" : "text-ink/70";
  const svgFilterClass = tone === "onDark" ? "invert" : "";

  return (
    <span
      className={`flex flex-col gap-1.5 leading-none ${alignClass} ${className}`}
    >
      <img
        src="/logos/el-portero-logotype.svg"
        alt="El Portero"
        className={`block w-auto max-w-full select-none ${logotypeSizeClasses[size]} ${svgFilterClass}`}
        draggable={false}
        decoding="async"
      />
      {showTagline ? (
        <span className={`${taglineClasses[size]} ${taglineColorClass}`}>
          {t(locale, "brand.dinnerClub")}
        </span>
      ) : null}
    </span>
  );
}
