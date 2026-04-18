"use client";

import type { Locale } from "@/i18n/strings";
import { t } from "@/i18n/strings";
import { googleMapsEmbedUrl } from "@/constants/venue";

type LocationMapEmbedProps = {
  locale: Locale;
  className?: string;
};

/** Map iframe only — full-bleed; no frame chrome (Google’s own embed UI remains). */
export function LocationMapEmbed({ locale, className }: LocationMapEmbedProps) {
  const embedSrc = googleMapsEmbedUrl();

  return (
    <div
      className={["flex min-h-0 w-full flex-col", className ?? ""]
        .filter(Boolean)
        .join(" ")}
    >
      <div className="relative min-h-[280px] w-full sm:min-h-[320px] lg:min-h-[min(28rem,50vh)]">
        <iframe
          title={t(locale, "page.hours.mapIframeTitle")}
          src={embedSrc}
          className="absolute inset-0 h-full w-full border-0"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
        />
      </div>
    </div>
  );
}

type LocationMapProps = {
  locale: Locale;
  className?: string;
};

export function LocationMap({ locale, className }: LocationMapProps) {
  return (
    <div
      className={["flex min-h-0 w-full flex-col", className ?? ""]
        .filter(Boolean)
        .join(" ")}
    >
      <LocationMapEmbed locale={locale} className="lg:flex-1" />
    </div>
  );
}
