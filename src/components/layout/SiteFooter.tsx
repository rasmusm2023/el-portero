"use client";

import { Facebook, Instagram, Mail, MapPin, Phone } from "lucide-react";
import Link from "next/link";
import { LogoWordmark } from "@/components/LogoWordmark";
import { BookTableWidgetButton } from "@/components/BookTableWidgetButton";
import { LocationMapEmbed } from "@/components/LocationMap";
import { VENUE_ADDRESS, googleMapsSearchUrl } from "@/constants/venue";
import {
  CONTACT_EMAIL,
  CONTACT_PHONE,
  FACEBOOK_PROFILE_URL,
  INSTAGRAM_CLUB_HANDLE,
  INSTAGRAM_CLUB_PROFILE_URL,
  INSTAGRAM_HANDLE,
  INSTAGRAM_PROFILE_URL,
  TIKTOK_HANDLE,
  TIKTOK_PROFILE_URL,
  contactMailtoHref,
  contactTelHref,
} from "@/config/site";
import { LAUNCH_UI_OPENING_HOURS } from "@/config/launchUi";
import { useLocale } from "@/i18n/useLocale";
import { t } from "@/i18n/strings";

function TikTokIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="size-4 shrink-0 text-paper/60"
      fill="currentColor"
      aria-hidden
    >
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.77 1.52V6.76a4.85 4.85 0 0 1-1-.07z" />
    </svg>
  );
}

export function SiteFooter() {
  const { locale } = useLocale();

  const mapsHref = googleMapsSearchUrl();

  return (
    <footer className="bg-ink text-paper">
      <div className="w-full border-b border-paper/10">
        <LocationMapEmbed locale={locale} />
      </div>

      <div className="w-full py-8">
        <div className="mx-auto w-full max-w-[min(100%,112rem)] px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-2">
            <div className="min-w-0 lg:max-w-md">
              <LogoWordmark size="footer" align="start" tone="onDark" />
              <div className="mt-5 space-y-3 text-sm leading-relaxed text-paper/85">
                <div className="flex gap-3">
                  <MapPin
                    className="mt-0.5 size-5 shrink-0 text-paper/50"
                    strokeWidth={1.5}
                    aria-hidden
                  />
                  <address className="min-w-0 not-italic">
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
                <div className="flex gap-3">
                  <Mail
                    className="mt-0.5 size-5 shrink-0 text-paper/50"
                    strokeWidth={1.5}
                    aria-hidden
                  />
                  <a
                    href={contactMailtoHref()}
                    className="min-w-0 break-all font-medium text-paper underline decoration-paper/35 underline-offset-[0.2em] transition-colors hover:decoration-paper/80"
                  >
                    {CONTACT_EMAIL}
                  </a>
                </div>
                <div className="flex gap-3">
                  <Phone
                    className="mt-0.5 size-5 shrink-0 text-paper/50"
                    strokeWidth={1.5}
                    aria-hidden
                  />
                  <a
                    href={contactTelHref()}
                    className="min-w-0 font-medium text-paper underline decoration-paper/35 underline-offset-[0.2em] transition-colors hover:decoration-paper/80"
                  >
                    {CONTACT_PHONE}
                  </a>
                </div>
              </div>
            </div>

            <div className="flex min-w-0 flex-col gap-8 lg:flex-row lg:items-start lg:gap-12 xl:gap-16">
              <div className="min-w-0">
                <p className="text-xs font-semibold tracking-[0.22em] text-paper/70 uppercase">
                  {t(locale, "footer.links")}
                </p>
                <ul className="mt-4 space-y-2 text-sm text-paper/85">
                  {/* `/#hours` on home — show when `LAUNCH_UI_OPENING_HOURS` (`config/launchUi.ts`). */}
                  {LAUNCH_UI_OPENING_HOURS ? (
                    <li>
                      <Link className="hover:text-paper" href="/#hours">
                        {t(locale, "page.hours.title")}
                      </Link>
                    </li>
                  ) : null}
                  <li>
                    <BookTableWidgetButton
                      type="button"
                      className="inline border-0 bg-transparent p-0 text-left font-inherit text-inherit hover:text-paper"
                    >
                      {t(locale, "nav.reserve")}
                    </BookTableWidgetButton>
                  </li>
                  <li>
                    <Link className="hover:text-paper" href="/menus">
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
                  <li>
                    <Link className="hover:text-paper" href="/sitemap">
                      {t(locale, "footer.sitemap")}
                    </Link>
                  </li>
                </ul>
              </div>
              <div className="min-w-0 lg:max-w-xs lg:shrink-0 xl:max-w-sm">
                <p className="text-xs font-semibold tracking-[0.22em] text-paper/70 uppercase">
                  {t(locale, "footer.follow")}
                </p>
                <ul className="mt-4 space-y-2 text-sm text-paper/85">
                  <li>
                    <a
                      href={INSTAGRAM_PROFILE_URL}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="inline-flex items-center gap-2 transition-colors hover:text-paper"
                      aria-label={`Instagram ${INSTAGRAM_HANDLE}`}
                    >
                      <Instagram className="size-4 text-paper/60" strokeWidth={1.75} aria-hidden />
                      {INSTAGRAM_HANDLE}
                    </a>
                  </li>
                  <li>
                    <a
                      href={INSTAGRAM_CLUB_PROFILE_URL}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="inline-flex items-center gap-2 transition-colors hover:text-paper"
                      aria-label={`Instagram ${INSTAGRAM_CLUB_HANDLE}`}
                    >
                      <Instagram className="size-4 text-paper/60" strokeWidth={1.75} aria-hidden />
                      {INSTAGRAM_CLUB_HANDLE}
                    </a>
                  </li>
                  <li>
                    <a
                      href={TIKTOK_PROFILE_URL}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="inline-flex items-center gap-2 transition-colors hover:text-paper"
                      aria-label={`TikTok ${TIKTOK_HANDLE}`}
                    >
                      <TikTokIcon />
                      {TIKTOK_HANDLE}
                    </a>
                  </li>
                  <li>
                    <a
                      href={FACEBOOK_PROFILE_URL}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="inline-flex items-center gap-2 transition-colors hover:text-paper"
                      aria-label="Facebook"
                    >
                      <Facebook className="size-4 text-paper/60" strokeWidth={1.75} aria-hidden />
                      Facebook
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between sm:gap-10">
            <p className="text-xs tracking-wide text-paper/55 uppercase">
              © {new Date().getFullYear()} el PORTERO
            </p>
            <p className="max-w-md text-left text-sm leading-relaxed text-paper/75">
              {t(locale, "footer.tagline")}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
