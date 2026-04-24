"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { EventImage } from "@/components/events/EventImage";
import { PageHeroSection } from "@/components/PageHeroSection";
import { PageShell } from "@/components/layout/PageShell";
import { publicEventFromDto, type HomeEvent, type PublicEventApiDto } from "@/lib/publicEventTypes";
import { getApiBaseUrl } from "@/lib/apiBase";
import { useLocale } from "@/i18n/useLocale";
import { t } from "@/i18n/strings";

type EventsPageProps = {
  heroImages: string[];
};

export function EventsPage({ heroImages }: EventsPageProps) {
  const { locale } = useLocale();
  const [homeEvents, setHomeEvents] = useState<HomeEvent[] | null>(null);
  const apiBase = getApiBaseUrl();

  useEffect(() => {
    (async () => {
      try {
        const r = await fetch(`${apiBase}/api/events`, { method: "GET" });
        if (!r.ok) {
          setHomeEvents([]);
          return;
        }
        const data = (await r.json()) as PublicEventApiDto[];
        setHomeEvents(data.map(publicEventFromDto));
      } catch {
        setHomeEvents([]);
      }
    })();
  }, [apiBase]);

  if (homeEvents === null) {
    return (
      <>
        <PageHeroSection heroImages={heroImages}>
          <h1 className="font-hero-title text-[clamp(2.25rem,6vw,4.25rem)] font-normal leading-[1.05] tracking-[0.14em] text-paper uppercase">
            {t(locale, "page.events.title")}
          </h1>
          <p className="mx-auto mt-8 max-w-2xl font-sans text-base leading-[1.75] text-paper/85 sm:mt-10 sm:text-lg">
            {t(locale, "page.events.heroSubtitle")}
          </p>
        </PageHeroSection>
        <PageShell showDocumentHeader={false}>
          <p className="text-ink-muted">
            {locale === "es" ? "Cargando…" : locale === "sv" ? "Laddar…" : "Loading…"}
          </p>
        </PageShell>
      </>
    );
  }

  const sorted = [...homeEvents].sort((a, b) => a.sortDate.localeCompare(b.sortDate));

  return (
    <>
      <PageHeroSection heroImages={heroImages}>
        <h1 className="font-hero-title text-[clamp(2.25rem,6vw,4.25rem)] font-normal leading-[1.05] tracking-[0.14em] text-paper uppercase">
          {t(locale, "page.events.title")}
        </h1>
        <p className="mx-auto mt-8 max-w-2xl font-sans text-base leading-[1.75] text-paper/85 sm:mt-10 sm:text-lg">
          {t(locale, "page.events.heroSubtitle")}
        </p>
        <div className="mt-10 flex justify-center sm:mt-12">
          <Link
            href="/contact"
            className="inline-flex min-h-12 items-center justify-center rounded-md border border-white/25 bg-paper px-10 py-3.5 font-sans text-xs font-bold tracking-[0.22em] text-ink uppercase shadow-[0_12px_36px_-12px_rgba(0,0,0,0.45)] outline-none transition-[background-color,box-shadow,border-color] duration-200 ease-out hover:border-white/50 hover:bg-paper hover:shadow-[0_14px_44px_-12px_rgba(0,0,0,0.38)] active:bg-paper/95 active:shadow-[0_10px_32px_-14px_rgba(0,0,0,0.42)] focus-visible:ring-2 focus-visible:ring-paper/55 focus-visible:ring-offset-2 focus-visible:ring-offset-ink/40 sm:min-h-13 sm:rounded-lg sm:px-12 sm:text-sm sm:tracking-[0.24em]"
            aria-label={t(locale, "page.events.heroInquiryAria")}
          >
            {t(locale, "page.events.heroInquiryCta")}
          </Link>
        </div>
      </PageHeroSection>

      <PageShell showDocumentHeader={false}>
        <section
          aria-label={t(locale, "page.events.sectionOverviewLabel")}
          className="border-b border-border/70 pb-12 sm:pb-14"
        >
          <div className="grid gap-10 lg:grid-cols-2 lg:gap-14">
            <div>
              <h3 className="font-display text-2xl font-medium tracking-tight text-ink sm:text-3xl">
                {t(locale, "page.events.explainPublicTitle")}
              </h3>
              <p className="mt-4 text-ink-muted leading-relaxed sm:text-lg">
                {t(locale, "page.events.explainPublicBody")}
              </p>
            </div>
            <div>
              <h3 className="font-display text-2xl font-medium tracking-tight text-ink sm:text-3xl">
                {t(locale, "page.events.explainPrivateTitle")}
              </h3>
              <p className="mt-4 text-ink-muted leading-relaxed sm:text-lg">
                {t(locale, "page.events.explainPrivateBody")}
              </p>
              <Link
                href="/contact"
                className="mt-6 inline-flex items-center gap-2 font-sans text-sm font-semibold text-ink underline decoration-ink/25 underline-offset-[0.25em] transition-colors hover:decoration-ink/60"
              >
                {t(locale, "page.events.heroInquiryCta")}
                <span aria-hidden>→</span>
              </Link>
            </div>
          </div>
        </section>

        <section className="pt-12 sm:pt-14" aria-labelledby="events-calendar-heading">
          <h2
            id="events-calendar-heading"
            className="font-display text-2xl font-medium tracking-tight text-ink sm:text-3xl"
          >
            {t(locale, "page.events.listHeading")}
          </h2>

          {sorted.length === 0 ? (
            <div className="mt-8 rounded-none border border-dashed border-border bg-paper-dark/50 px-6 py-12 text-center">
              <p className="text-ink-muted sm:text-lg">{t(locale, "page.events.listEmpty")}</p>
            </div>
          ) : (
            <ul className="mt-8 flex flex-col gap-10 sm:mt-10">
            {sorted.map((ev) => (
              <li key={ev.id}>
                <article className="overflow-hidden rounded-2xl border border-border bg-paper-dark/35 ring-1 ring-border/60 sm:rounded-3xl">
                  <div className="flex flex-col md:flex-row">
                    <div className="relative aspect-[16/10] w-full shrink-0 overflow-hidden bg-ink/5 md:aspect-auto md:w-[min(100%,30rem)] md:min-h-[280px]">
                      <EventImage
                        src={ev.imageSrc}
                        alt={ev.imageAlt[locale]}
                        fill
                        className="object-cover"
                        sizes="(max-width: 767px) 100vw, 30rem"
                      />
                    </div>
                    <div className="flex min-w-0 flex-1 flex-col justify-between px-6 py-8 sm:px-10 sm:py-10">
                      <div>
                        <p className="text-xs font-semibold tracking-[0.22em] text-ink-muted uppercase">
                          {ev.weekdayDate[locale]}
                        </p>
                        <div className="mt-2 flex flex-wrap items-center gap-2">
                          <p className="text-xs font-semibold tracking-[0.18em] text-ink-muted/90 uppercase">
                            {ev.timeDetail[locale]}
                          </p>
                          {ev.fullyBooked ? (
                            <span className="inline-flex items-center rounded-full border border-border bg-paper px-2.5 py-1 text-[0.7rem] font-semibold tracking-[0.18em] text-ink uppercase">
                              {t(locale, "page.reserve.fullyBooked")}
                            </span>
                          ) : null}
                        </div>
                        <h2 className="mt-3 font-display text-2xl font-medium text-ink sm:text-3xl">
                          {ev.title[locale]}
                        </h2>
                        <p className="mt-4 text-ink-muted leading-relaxed">{ev.excerpt[locale]}</p>
                      </div>
                      <div className="mt-8 flex flex-wrap gap-2.5">
                        <Link
                          href="/reserve"
                          className="inline-flex shrink-0 items-center justify-center rounded-lg border border-ink bg-ink px-4 py-2.5 text-xs font-semibold tracking-[0.2em] text-paper uppercase transition-colors hover:bg-ink/90 sm:text-sm"
                        >
                          {t(locale, "nav.reserve")}
                        </Link>
                      </div>
                    </div>
                  </div>
                </article>
              </li>
            ))}
            </ul>
          )}
        </section>
      </PageShell>
    </>
  );
}
