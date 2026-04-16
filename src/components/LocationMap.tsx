"use client";

import Link from "next/link";
import type { Locale } from "@/i18n/strings";
import { t } from "@/i18n/strings";
import {
  googleMapsEmbedUrl,
  googleMapsSearchUrl,
} from "@/constants/venue";

type LocationMapEmbedProps = {
  locale: Locale;
  className?: string;
};

/** Map iframe only (bordered frame). */
export function LocationMapEmbed({ locale, className }: LocationMapEmbedProps) {
  const embedSrc = googleMapsEmbedUrl();

  return (
    <div
      className={["flex min-h-0 w-full flex-col", className ?? ""]
        .filter(Boolean)
        .join(" ")}
    >
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-none border border-ink/20 bg-paper shadow-[inset_0_0_0_1px_rgba(250,249,246,0.06)]">
        <div className="relative aspect-[4/3] min-h-[320px] w-full lg:aspect-auto lg:min-h-[432px] lg:flex-1">
          {/* No grayscale filter — it would mute Google’s default red place marker. */}
          <div className="absolute inset-0">
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
    </div>
  );
}

type MapsFooterLinkProps = {
  locale: Locale;
  /** e.g. `mt-0` when parent grid already adds vertical gap */
  className?: string;
};

export function MapsFooterLink({ locale, className }: MapsFooterLinkProps) {
  const openHref = googleMapsSearchUrl();

  return (
    <p
      className={["mt-4 text-center lg:mt-0", className].filter(Boolean).join(" ")}
    >
      <Link
        href={openHref}
        target="_blank"
        rel="noopener noreferrer"
        className="text-sm font-medium tracking-wide text-ink underline decoration-ink/40 underline-offset-[0.25em] transition-colors hover:decoration-ink hover:underline"
      >
        {t(locale, "page.hours.openInMaps")}
      </Link>
    </p>
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
      <MapsFooterLink locale={locale} />
    </div>
  );
}
