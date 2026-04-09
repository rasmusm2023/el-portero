"use client";

import Link from "next/link";
import type { Locale } from "@/i18n/strings";
import { t } from "@/i18n/strings";
import {
  googleMapsEmbedUrl,
  googleMapsSearchUrl,
} from "@/constants/venue";

type LocationMapProps = {
  locale: Locale;
  className?: string;
};

export function LocationMap({ locale, className }: LocationMapProps) {
  const embedSrc = googleMapsEmbedUrl();
  const openHref = googleMapsSearchUrl();

  return (
    <div className={className}>
      <h2 className="font-display text-xl font-medium text-ink">
        {t(locale, "page.hours.map")}
      </h2>
      <div className="mt-4 overflow-hidden rounded-none border border-border bg-paper-dark/40 shadow-sm ring-1 ring-border/80">
        <div className="relative aspect-[4/3] min-h-[240px] w-full lg:aspect-auto lg:min-h-[320px]">
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
      <p className="mt-3 text-center">
        <Link
          href={openHref}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-ink underline-offset-4 transition-colors hover:text-ink-muted hover:underline"
        >
          {t(locale, "page.hours.openInMaps")}
        </Link>
      </p>
    </div>
  );
}
