"use client";

import { Instagram, MapPin } from "lucide-react";
import Link from "next/link";
import { LogoWordmark } from "@/components/LogoWordmark";
import { VENUE_ADDRESS, googleMapsSearchUrl } from "@/constants/venue";
import { INSTAGRAM_PROFILE_URL } from "@/config/site";
import { useLocale } from "@/i18n/useLocale";
import { t } from "@/i18n/strings";

export function SiteFooter() {
  const { locale } = useLocale();

  const mapsHref = googleMapsSearchUrl();
  const hours = [
    { day: "Mon", hours: "18:00 – 23:00" },
    { day: "Tue", hours: "18:00 – 23:00" },
    { day: "Wed", hours: "18:00 – 23:00" },
    { day: "Thu", hours: "18:00 – 23:00" },
    { day: "Fri", hours: "18:00 – 00:00" },
    { day: "Sat", hours: "18:00 – 00:00" },
    { day: "Sun", hours: locale === "es" ? "Cerrado" : locale === "sv" ? "Stängt" : "Closed" },
  ];

  return (
    <footer className="border-t border-border bg-ink text-paper">
      <div className="mx-auto w-full max-w-[min(100%,112rem)] px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-4">
          <div className="lg:col-span-1">
            <LogoWordmark size="footer" align="start" tone="onDark" />
            <p className="mt-3 max-w-md text-sm leading-relaxed text-paper/75">
              {locale === "es"
                ? "Experiencia gastronómica en Torrevieja — elegancia, producto y servicio."
                : locale === "sv"
                  ? "Gastronomisk upplevelse i Torrevieja — elegans, råvaror och service."
                  : "Dining in Torrevieja — poise, produce, and hospitality."}
            </p>
          </div>

          <div className="min-w-0">
            <p className="text-xs font-semibold tracking-[0.22em] text-paper/70 uppercase">
              {locale === "es" ? "Encuéntranos" : locale === "sv" ? "Hitta oss" : "Find us"}
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
                {locale === "es" ? "Abrir en Google Maps" : locale === "sv" ? "Öppna i Google Maps" : "Open in Google Maps"}
              </a>
            </div>
          </div>

          <div className="min-w-0">
            <p className="text-xs font-semibold tracking-[0.22em] text-paper/70 uppercase">
              {t(locale, "nav.hours")}
            </p>
            <ul className="mt-4 space-y-2 text-sm text-paper/85">
              {hours.map((row) => (
                <li key={row.day} className="flex items-baseline justify-between gap-4">
                  <span className="text-paper/70">{row.day}</span>
                  <span className="tabular-nums">{row.hours}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="min-w-0">
            <p className="text-xs font-semibold tracking-[0.22em] text-paper/70 uppercase">
              {locale === "es" ? "Enlaces" : locale === "sv" ? "Länkar" : "Links"}
            </p>
            <ul className="mt-4 space-y-2 text-sm text-paper/85">
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

            <div className="mt-6 flex items-center gap-3">
              <a
                href={INSTAGRAM_PROFILE_URL}
                target="_blank"
                rel="noreferrer noopener"
                className="inline-flex items-center gap-2 text-sm text-paper/85 transition-colors hover:text-paper"
              >
                <Instagram className="size-4 text-paper/60" strokeWidth={1.75} aria-hidden />
                Instagram
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-paper/10 pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs tracking-wide text-paper/55 uppercase">
            © {new Date().getFullYear()} El Portero
          </p>
          <Link
            href="/admin"
            className="text-[11px] font-normal tracking-normal text-paper/38 no-underline transition-colors hover:text-paper/60"
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
    </footer>
  );
}
