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
      <div className="overflow-hidden rounded-none border-2 border-ink bg-paper shadow-[inset_0_0_0_1px_rgba(250,249,246,0.06)]">
        <div className="relative aspect-[4/3] min-h-[320px] w-full lg:aspect-auto lg:min-h-[432px]">
          {/* Grayscale + contrast keeps the embed strictly black/white without API styling. */}
          <div className="absolute inset-0 grayscale contrast-[1.06] brightness-[0.98]">
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
      </div>
      <p className="mt-4 text-center">
        <Link
          href={openHref}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm font-medium tracking-wide text-ink underline decoration-ink/40 underline-offset-[0.25em] transition-colors hover:decoration-ink hover:underline"
        >
          {t(locale, "page.hours.openInMaps")}
        </Link>
      </p>
    </div>
  );
}
