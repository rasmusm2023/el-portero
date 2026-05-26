"use client";

import { useMemo } from "react";
import Link from "next/link";
import { EventCard } from "@/components/events/EventCard";
import { PageHeroSection } from "@/components/PageHeroSection";
import { bookTableHeroHollowButtonClass } from "@/components/layout/SiteHeader";
import { PageShell } from "@/components/layout/PageShell";
import { usePublicEvents } from "@/hooks/usePublicEvents";
import { useLocale } from "@/i18n/useLocale";
import { t } from "@/i18n/strings";
import { getEventsMontageClips } from "@/lib/eventsVideos";

type EventsPageProps = {
  heroImages: string[];
};

export function EventsPage({ heroImages }: EventsPageProps) {
  const { locale } = useLocale();
  const { events, ready } = usePublicEvents();
  const heroVideos = useMemo(() => getEventsMontageClips(), []);

  return (
    <>
      <PageHeroSection heroImages={heroImages} heroVideos={heroVideos}>
        <h1 className="font-hero-title text-[clamp(2.25rem,6vw,4.25rem)] font-normal leading-[1.05] tracking-[0.14em] text-paper uppercase">
          {t(locale, "page.events.title")}
        </h1>
        <p className="mx-auto mt-8 max-w-2xl font-sans text-base leading-[1.75] text-paper/85 sm:mt-10 sm:text-lg">
          {t(locale, "page.events.heroSubtitle")}
        </p>
        <div className="mt-10 flex justify-center sm:mt-12">
          <Link
            href="/contact"
            className={bookTableHeroHollowButtonClass}
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
              <h3 className="font-display text-2xl font-medium tracking-tight text-paper sm:text-3xl">
                {t(locale, "page.events.explainPublicTitle")}
              </h3>
              <p className="mt-4 text-ink-muted leading-relaxed sm:text-lg">
                {t(locale, "page.events.explainPublicBody")}
              </p>
            </div>
            <div>
              <h3 className="font-display text-2xl font-medium tracking-tight text-paper sm:text-3xl">
                {t(locale, "page.events.explainPrivateTitle")}
              </h3>
              <p className="mt-4 text-ink-muted leading-relaxed sm:text-lg">
                {t(locale, "page.events.explainPrivateBody")}
              </p>
              <Link
                href="/contact"
                className="mt-6 inline-flex items-center gap-2 font-sans text-sm font-semibold text-paper underline decoration-paper/30 underline-offset-[0.25em] transition-colors hover:decoration-gold/55"
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
            className="font-display text-2xl font-medium tracking-tight text-paper sm:text-3xl"
          >
            {t(locale, "page.events.listHeading")}
          </h2>

          {!ready ? (
            <div className="mt-8 px-2 text-ink-muted sm:text-lg">
              {t(locale, "page.events.listLoading")}
            </div>
          ) : events.length === 0 ? (
            <div className="mt-8 rounded-none border border-dashed border-border bg-paper-dark/50 px-6 py-12 text-center">
              <p className="text-ink-muted sm:text-lg">{t(locale, "page.events.listEmpty")}</p>
            </div>
          ) : (
            <div className="relative mt-8 w-full sm:mt-10">
              <ol className="relative z-10 m-0 flex list-none flex-col gap-10">
                <div
                  className="pointer-events-none absolute left-4 top-0 bottom-0 z-0 w-px bg-[linear-gradient(to_bottom,transparent_0%,rgba(255,255,255,0.14)_10%,rgba(255,255,255,0.14)_90%,transparent_100%)]"
                  aria-hidden
                />
                {events.map((ev) => (
                  <li key={ev.id} className="relative w-full pl-10">
                    <span
                      className="absolute left-3.5 top-0 z-10 flex h-3.5 w-3.5 -translate-x-1/2 shrink-0 rounded-full border-2 border-paper/70 bg-ink shadow-[0_0_0_5px_var(--color-ink)] ring-1 ring-paper/15"
                      aria-hidden
                    />
                    <EventCard event={ev} locale={locale} variant="listing" />
                  </li>
                ))}
              </ol>
            </div>
          )}
        </section>
      </PageShell>
    </>
  );
}
