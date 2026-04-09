"use client";

import { MapPin } from "lucide-react";
import Link from "next/link";
import { LogoWordmark } from "@/components/LogoWordmark";
import { VENUE_ADDRESS, googleMapsSearchUrl } from "@/constants/venue";
import { useLocale } from "@/i18n/useLocale";
import { t } from "@/i18n/strings";

export function SiteFooter() {
  const { locale } = useLocale();

  const mapsHref = googleMapsSearchUrl();

  return (
    <footer className="border-t border-border bg-ink text-paper">
      <div className="mx-auto grid max-w-[var(--container-max)] gap-10 px-4 py-14 sm:px-6 lg:grid-cols-2 lg:px-8">
        <div>
          <p className="text-paper">
            <LogoWordmark size="footer" showTagline align="start" />
          </p>
          <p className="mt-3 max-w-md text-sm leading-relaxed text-paper/75">
            {locale === "es"
              ? "Experiencia gastronómica en Torrevieja — elegancia, producto y servicio."
              : locale === "sv"
                ? "Gastronomisk upplevelse i Torrevieja — elegans, råvaror och service."
                : "Dining in Torrevieja — poise, produce, and hospitality."}
          </p>
        </div>
        <div className="flex flex-col gap-4 text-sm text-paper/85">
          <div className="flex gap-3">
            <MapPin className="mt-0.5 size-5 shrink-0 text-paper/50" strokeWidth={1.5} aria-hidden />
            <address className="not-italic">
              <a
                href={mapsHref}
                target="_blank"
                rel="noreferrer noopener"
                className="underline-offset-4 transition-colors hover:text-paper hover:underline"
              >
                {VENUE_ADDRESS}
              </a>
            </address>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6">
            <p className="text-xs tracking-wide text-paper/55 uppercase">
              © {new Date().getFullYear()} El Portero
            </p>
            <Link
              href="/admin"
              className="self-start text-[11px] font-normal tracking-normal text-paper/38 no-underline transition-colors hover:text-paper/60 sm:self-auto sm:shrink-0"
              aria-label={
                locale === "es"
                  ? "Acceso administración (personal)"
                  : locale === "sv"
                    ? "Administration (personal)"
                    : "Staff administration sign-in"
              }
            >
              {t(locale, "footer.staff")}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
