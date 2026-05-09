"use client";

import Image from "next/image";
import type { CSSProperties } from "react";
import { useEffect, useState } from "react";
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
  /** Treat the SVG for the current surface (black on light; gold gradient on dark — matches primary CTAs). */
  tone?: "onLight" | "onDark";
  /** Fade in smoothly once the client is ready (default: true). */
  fadeInOnMount?: boolean;
};

/** viewBox width ÷ height — mask box needs explicit size; empty masked spans get 0 intrinsic width in flex (WebKit). */
const LOGOTYPE_HW_RATIO = 13268 / 3443;

/** Same asset as the Image `src` — used as a luminance mask over the gold gradient. */
const LOGOTYPE_MASK_STYLE: CSSProperties = {
  maskImage: "url('/assets/logos/el-portero-logotype.svg')",
  WebkitMaskImage: "url('/assets/logos/el-portero-logotype.svg')",
  maskSize: "contain",
  WebkitMaskSize: "contain",
  maskRepeat: "no-repeat",
  WebkitMaskRepeat: "no-repeat",
  maskPosition: "center",
  WebkitMaskPosition: "center",
};

const logotypeSizeClasses: Record<LogoWordmarkProps["size"], string> = {
  header: "h-7 sm:h-8 lg:h-9 xl:h-10",
  hero: "h-14 sm:h-16 md:h-20 lg:h-24 xl:h-28",
  footer: "h-10 sm:h-11",
};

/** Pixel height token for `onDark` mask (must match {@link logotypeSizeClasses} breakpoints). */
const onDarkHeightVarClasses: Record<LogoWordmarkProps["size"], string> = {
  header:
    "[--ep-logo-h:1.75rem] sm:[--ep-logo-h:2rem] lg:[--ep-logo-h:2.25rem] xl:[--ep-logo-h:2.5rem]",
  hero: "[--ep-logo-h:3.5rem] sm:[--ep-logo-h:4rem] md:[--ep-logo-h:5rem] lg:[--ep-logo-h:6rem] xl:[--ep-logo-h:7rem]",
  footer: "[--ep-logo-h:2.5rem] sm:[--ep-logo-h:2.75rem]",
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
  fadeInOnMount = true,
}: LogoWordmarkProps) {
  const { locale: localeHook } = useLocale();
  const locale = localeProp ?? localeHook;

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const alignClass = align === "start" ? "items-start" : "items-center";
  const taglineColorClass =
    tone === "onDark" ? "text-paper/75" : "text-ink/70";

  const goldWordmarkClass =
    `block max-w-full shrink-0 select-none bg-gradient-to-r from-gold-bright/95 via-gold to-gold-bright/95 ${onDarkHeightVarClasses[size]}`;

  const goldWordmarkStyle: CSSProperties = {
    ...LOGOTYPE_MASK_STYLE,
    height: "var(--ep-logo-h)",
    width: `calc(var(--ep-logo-h) * ${LOGOTYPE_HW_RATIO})`,
  };

  return (
    <span
      className={[
        "flex flex-col gap-1.5 leading-none",
        alignClass,
        fadeInOnMount
          ? [
              "will-change-[opacity] transition-opacity duration-700 ease-out motion-reduce:transition-none",
              mounted ? "opacity-100" : "opacity-0",
            ].join(" ")
          : "opacity-100",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {tone === "onDark" ? (
        <span
          role="img"
          aria-label="El Portero"
          className={goldWordmarkClass}
          style={goldWordmarkStyle}
        />
      ) : (
        <Image
          src="/assets/logos/el-portero-logotype.svg"
          alt="El Portero"
          width={640}
          height={160}
          className={`block h-auto w-auto max-w-full select-none ${logotypeSizeClasses[size]}`}
          draggable={false}
          unoptimized
        />
      )}
      {showTagline ? (
        <span className={`${taglineClasses[size]} ${taglineColorClass}`}>
          {t(locale, "brand.dinnerClub")}
        </span>
      ) : null}
    </span>
  );
}
