"use client";

import { Instagram, MapPin } from "lucide-react";
import Link from "next/link";
import { LogoWordmark } from "@/components/LogoWordmark";
import { LocationMapEmbed } from "@/components/LocationMap";
import { VENUE_ADDRESS, googleMapsSearchUrl } from "@/constants/venue";
import {
  INSTAGRAM_HANDLE,
  INSTAGRAM_PROFILE_URL,
  bookingWhatsAppHref,
} from "@/config/site";
import { useLocale } from "@/i18n/useLocale";
import { t } from "@/i18n/strings";

export function SiteFooter() {
  const { locale } = useLocale();

  const mapsHref = googleMapsSearchUrl();

  return (
    <footer className="border-t border-border bg-ink text-paper">
      <div className="w-full border-b border-paper/10">
        <LocationMapEmbed locale={locale} />
      </div>

      <div className="mx-auto w-full max-w-[min(100%,112rem)] px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-3">
          <div className="lg:col-span-1">
            <LogoWordmark size="footer" align="start" tone="onDark" />
            <p className="mt-3 max-w-md text-sm leading-relaxed text-paper/75">
              {t(locale, "footer.tagline")}
            </p>
          </div>

          <div className="min-w-0">
            <p className="text-xs font-semibold tracking-[0.22em] text-paper/70 uppercase">
              {locale === "es"
                ? "Encuéntranos"
                : locale === "sv"
                  ? "Hitta oss"
                  : "Find us"}
            </p>
            <div className="mt-4 flex gap-3 text-sm text-paper/85">
              <MapPin
                className="mt-0.5 size-5 shrink-0 text-paper/50"
                strokeWidth={1.5}
                aria-hidden
              />
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
            <div className="mt-4">
              <a
                href={mapsHref}
                target="_blank"
                rel="noreferrer noopener"
                className="text-sm font-medium tracking-wide text-paper underline decoration-paper/35 underline-offset-[0.25em] transition-colors hover:decoration-paper/80"
              >
                {t(locale, "footer.openInMaps")}
              </a>
            </div>
          </div>

          <div className="min-w-0">
            <p className="text-xs font-semibold tracking-[0.22em] text-paper/70 uppercase">
              {t(locale, "footer.links")}
            </p>
            <ul className="mt-4 space-y-2 text-sm text-paper/85">
              <li>
                <Link className="hover:text-paper" href="/#hours">
                  {t(locale, "page.hours.title")}
                </Link>
              </li>
              <li>
                <Link className="hover:text-paper" href="/reserve">
                  {t(locale, "nav.reserve")}
                </Link>
              </li>
              <li>
                <Link className="hover:text-paper" href="/menu">
                  {t(locale, "nav.menu")}
                </Link>
              </li>
              <li>
                <Link className="hover:text-paper" href="/events">
                  {t(locale, "nav.events")}
                </Link>
              </li>
              <li>
                <Link className="hover:text-paper" href="/contact">
                  {t(locale, "nav.contact")}
                </Link>
              </li>
            </ul>

            <div className="mt-5 flex flex-col gap-3">
              <a
                href={INSTAGRAM_PROFILE_URL}
                target="_blank"
                rel="noreferrer noopener"
                className="inline-flex items-center gap-2 text-sm text-paper/85 transition-colors hover:text-paper"
                aria-label={t(locale, "page.home.instagramAria")}
              >
                <Instagram
                  className="size-4 text-paper/60"
                  strokeWidth={1.75}
                  aria-hidden
                />
                {INSTAGRAM_HANDLE}
              </a>
              <a
                href={bookingWhatsAppHref()}
                target="_blank"
                rel="noreferrer noopener"
                className="inline-flex items-center gap-2 text-sm text-paper/85 transition-colors hover:text-paper"
                aria-label={t(locale, "footer.whatsappAria")}
              >
                <svg
                  className="size-4 shrink-0 text-emerald-400/90"
                  viewBox="0 0 24 24"
                  aria-hidden
                >
                  <path
                    fill="currentColor"
                    d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"
                  />
                </svg>
                {t(locale, "footer.whatsapp")}
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto w-full max-w-[min(100%,112rem)] px-4 pb-8 pt-0 sm:px-6 lg:px-8">
        <p className="text-xs tracking-wide text-paper/55 uppercase">
          © {new Date().getFullYear()} El Portero
        </p>
      </div>
    </footer>
  );
}
