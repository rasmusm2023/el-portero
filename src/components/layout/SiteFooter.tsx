"use client";

import { Instagram, Mail, MapPin } from "lucide-react";
import Link from "next/link";
import { LogoWordmark } from "@/components/LogoWordmark";
import { BookTableWidgetButton } from "@/components/BookTableWidgetButton";
import { LocationMapEmbed } from "@/components/LocationMap";
import { VENUE_ADDRESS, googleMapsSearchUrl } from "@/constants/venue";
import {
  CONTACT_EMAIL,
  INSTAGRAM_HANDLE,
  INSTAGRAM_PROFILE_URL,
  contactMailtoHref,
} from "@/config/site";
import { LAUNCH_UI_INSTAGRAM, LAUNCH_UI_OPENING_HOURS } from "@/config/launchUi";
import { useLocale } from "@/i18n/useLocale";
import { t } from "@/i18n/strings";

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
              </div>
            </div>

            <div className="flex min-w-0 flex-col gap-8 lg:flex-row lg:items-start lg:justify-between lg:gap-10 xl:gap-14">
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

                <div className="mt-5 flex flex-col gap-3">
                  {/* Instagram — show when `LAUNCH_UI_INSTAGRAM` (`config/launchUi.ts`). */}
                  {LAUNCH_UI_INSTAGRAM ? (
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
                  ) : null}
                </div>
              </div>
              <p className="max-w-md text-left text-sm leading-relaxed text-paper/75 lg:max-w-xs lg:shrink-0 xl:max-w-sm">
                {t(locale, "footer.tagline")}
              </p>
            </div>
          </div>

          <p className="mt-8 text-xs tracking-wide text-paper/55 uppercase">
            © {new Date().getFullYear()} El Portero
          </p>
        </div>
      </div>
    </footer>
  );
}
