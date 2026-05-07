"use client";

import { useMemo } from "react";
import Link from "next/link";
import { EventImage } from "@/components/events/EventImage";
import { BookTableWidgetButton } from "@/components/BookTableWidgetButton";
import { PageHeroSection } from "@/components/PageHeroSection";
import { bookTableHeroHollowButtonClass } from "@/components/layout/SiteHeader";
import { PageShell } from "@/components/layout/PageShell";
import { usePublicEvents } from "@/hooks/usePublicEvents";
import { useLocale } from "@/i18n/useLocale";
import { t } from "@/i18n/strings";
import { eventCardDateLabel } from "@/lib/eventDisplayDate";
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
                      className="absolute left-[0.875rem] top-0 z-10 flex h-3.5 w-3.5 -translate-x-1/2 shrink-0 rounded-full border-2 border-paper/70 bg-ink shadow-[0_0_0_5px_var(--color-ink)] ring-1 ring-paper/15"
                      aria-hidden
                    />
                    <article className="overflow-hidden rounded-2xl border border-border bg-paper-dark/35 ring-1 ring-border/60 sm:rounded-3xl">
                      <div className="flex flex-col md:flex-row">
                        <div className="relative aspect-[16/10] w-full shrink-0 overflow-hidden bg-ink/5 md:aspect-auto md:w-1/2 md:min-h-[280px] md:min-w-0 md:max-w-none">
                          <EventImage
                            src={ev.imageSrc}
                            alt={ev.imageAlt[locale]}
                            fill
                            className="object-cover"
                            sizes="(max-width: 767px) 100vw, 50vw"
                          />
                          <div
                            className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/35 via-transparent to-transparent md:bg-gradient-to-r md:from-transparent md:via-transparent md:to-paper/8"
                            aria-hidden
                          />
                        </div>
                        <div className="flex min-w-0 flex-1 flex-col justify-between px-6 py-8 sm:px-10 sm:py-10">
                          <div>
                            <time
                              className="mb-3 block text-left text-[10px] font-semibold leading-snug tracking-[0.2em] text-ink-muted uppercase sm:text-[11px]"
                              dateTime={ev.sortDate}
                            >
                              {eventCardDateLabel(ev, locale)}
                            </time>
                            {ev.hasSpecificTime !== false && ev.timeDetail[locale]?.trim() ? (
                              <div className="flex flex-wrap items-center gap-2">
                                <p className="text-xs font-semibold tracking-[0.18em] text-ink-muted/90 uppercase">
                                  {ev.timeDetail[locale]}
                                </p>
                              </div>
                            ) : null}
                            <h2
                              className={`font-display text-2xl font-medium text-paper sm:text-3xl ${
                                ev.hasSpecificTime !== false && ev.timeDetail[locale]?.trim()
                                  ? "mt-3"
                                  : ""
                              }`}
                            >
                              {ev.title[locale]}
                            </h2>
                            <p className="mt-4 text-ink-muted leading-relaxed">{ev.excerpt[locale]}</p>
                          </div>
                          <div className="mt-8 flex flex-wrap gap-2.5">
                            {ev.fullyBooked ? (
                              <button
                                type="button"
                                disabled
                                className="inline-flex shrink-0 cursor-not-allowed items-center justify-center rounded-lg border border-border bg-ink/10 px-4 py-2.5 text-xs font-semibold tracking-[0.2em] text-ink-muted uppercase opacity-80 sm:text-sm"
                                aria-disabled="true"
                              >
                                {t(locale, "page.reserve.fullyBooked")}
                              </button>
                            ) : (
                              <BookTableWidgetButton
                                type="button"
                                className="inline-flex shrink-0 items-center justify-center rounded-lg border border-ink bg-ink px-4 py-2.5 text-xs font-semibold tracking-[0.2em] text-paper uppercase transition-colors hover:bg-ink/90 sm:text-sm"
                              >
                                {t(locale, "nav.reserve")}
                              </BookTableWidgetButton>
                            )}
                          </div>
                        </div>
                      </div>
                    </article>
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
