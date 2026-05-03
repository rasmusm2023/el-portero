"use client";

import type { Locale } from "@/i18n/strings";
import { t } from "@/i18n/strings";
import { googleMapsEmbedUrl } from "@/constants/venue";

type LocationMapEmbedProps = {
  locale: Locale;
  className?: string;
};

/**
 * Map iframe only — full-bleed; no frame chrome (Google’s own embed UI remains).
 *
 * Browsers may log CSP / “partitioned cookie” notices for third-party Google embeds; that is normal
 * and not controlled by this app’s code unless you replace the embed with a static map image + link.
 */
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
          referrerPolicy="strict-origin-when-cross-origin"
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
