"use client";

import { useMemo, useRef } from "react";
import Link from "next/link";
import { EventImage } from "@/components/events/EventImage";
import { BookTableWidgetButton } from "@/components/BookTableWidgetButton";
import { OpeningHoursCard } from "@/components/OpeningHoursCard";
import { LAUNCH_UI_OPENING_HOURS } from "@/config/launchUi";
import { usePublicEvents } from "@/hooks/usePublicEvents";
import { useLocale } from "@/i18n/useLocale";
import { t } from "@/i18n/strings";

export function HomeEventsSection() {
  const { locale } = useLocale();
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const itemRefs = useMemo(() => new Map<string, HTMLLIElement>(), []);

  const { events, ready } = usePublicEvents();
  const sorted = useMemo(() => events, [events]);

  return (
    <section
      aria-labelledby="home-events-heading"
      className="border-t border-border bg-ink"
    >
      <div className="mx-auto w-full max-w-[min(100%,112rem)] px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
        <div
          className={[
            "flex flex-col gap-12",
            LAUNCH_UI_OPENING_HOURS ? "lg:flex-row lg:items-start lg:gap-14 xl:gap-16" : "",
          ].join(" ")}
        >
          <div className="min-w-0 flex-1">
            <header className="max-w-xl">
              <h2
                id="home-events-heading"
                className="font-display text-4xl font-semibold tracking-tight text-paper sm:text-5xl"
              >
                {t(locale, "page.home.eventsHeading")}
              </h2>
              <p className="mt-3 text-lg text-ink-muted leading-relaxed">
                {t(locale, "page.home.eventsIntro")}
              </p>
              <div className="mt-6 flex flex-col items-start gap-2">
                <Link
                  href="/events"
                  className="text-sm font-semibold tracking-[0.2em] text-paper uppercase underline decoration-paper/35 underline-offset-[0.35em] transition-colors hover:text-ink-muted hover:decoration-paper/25"
                >
                  {t(locale, "page.home.eventsViewAll")}
                </Link>
              </div>
            </header>

            <div className="relative mt-10 w-full lg:mt-12">
              {!ready ? (
                <p className="max-w-md text-base text-ink-muted leading-relaxed">
                  {t(locale, "page.home.eventsLoading")}
                </p>
              ) : sorted.length === 0 ? (
                <p className="max-w-md text-base text-ink-muted leading-relaxed">
                  {t(locale, "page.home.eventsEmpty")}
                </p>
              ) : (
                <div
                  className={[
                    "relative w-full max-h-[min(72vh,46rem)] overflow-y-auto overscroll-y-contain scroll-smooth pr-2 pt-0",
                    "snap-y snap-mandatory",
                    "touch-pan-y",
                    "[scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
                  ].join(" ")}
                  ref={viewportRef}
                  tabIndex={0}
                  role="region"
                  aria-label={t(locale, "page.home.eventsHeading")}
                >
                  <ol className="relative z-10 m-0 flex list-none flex-col gap-10 pb-2 pt-0">
                    <div
                      className="pointer-events-none absolute left-4 top-0 bottom-0 z-0 w-px bg-[linear-gradient(to_bottom,transparent_0%,rgba(255,255,255,0.14)_10%,rgba(255,255,255,0.14)_90%,transparent_100%)]"
                      aria-hidden
                    />
                    {sorted.map((ev) => (
                      <li
                        key={ev.id}
                        className="relative w-full snap-start pl-10"
                        ref={(node) => {
                          if (!node) {
                            itemRefs.delete(ev.id);
                            return;
                          }
                          itemRefs.set(ev.id, node);
                        }}
                      >
                        <span
                          className="absolute left-[0.875rem] top-0 z-10 flex h-3.5 w-3.5 -translate-x-1/2 shrink-0 rounded-full border-2 border-paper/70 bg-ink shadow-[0_0_0_5px_var(--color-ink)] ring-1 ring-paper/15"
                          aria-hidden
                        />
                        <time
                          className="mb-3 block text-left text-[10px] font-semibold leading-snug tracking-[0.2em] text-ink-muted uppercase sm:text-[11px]"
                          dateTime={ev.sortDate}
                        >
                          {ev.weekdayDate[locale]}
                        </time>

                        <article className="flex w-full min-h-[13.5rem] flex-row overflow-hidden rounded-2xl border border-border bg-paper-dark/35 shadow-sm ring-1 ring-border/60 transition-[box-shadow,ring-color] duration-300 hover:shadow-md hover:ring-border sm:min-h-[15rem] sm:rounded-3xl">
                          <div className="relative w-[44%] min-w-[9rem] max-w-[18rem] shrink-0 self-stretch bg-ink/5 sm:w-[46%] sm:min-w-[11rem] sm:max-w-[22rem] xl:max-w-[26rem]">
                            <EventImage
                              src={ev.imageSrc}
                              alt={ev.imageAlt[locale]}
                              fill
                              className="object-cover"
                              sizes="(max-width: 640px) 45vw, (max-width: 1024px) 280px, (max-width: 1280px) 320px, 380px"
                            />
                            <div
                              className="pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-paper/8"
                              aria-hidden
                            />
                          </div>
                          <div className="flex min-h-0 min-w-0 flex-1 flex-col justify-between gap-4 px-4 py-5 sm:gap-5 sm:px-6 sm:py-6">
                            <div className="min-w-0">
                              <h3 className="font-display text-lg font-medium leading-snug tracking-tight text-paper sm:text-xl">
                                {ev.title[locale]}
                              </h3>
                              <p className="mt-2 text-[11px] font-semibold leading-snug tracking-[0.18em] text-ink-muted uppercase sm:text-xs sm:tracking-[0.2em]">
                                {ev.timeDetail[locale]}
                              </p>
                              <p className="mt-2 line-clamp-4 text-sm leading-relaxed text-ink-muted sm:line-clamp-3 sm:mt-2.5">
                                {ev.excerpt[locale]}
                              </p>
                            </div>
                            <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
                              {ev.fullyBooked ? (
                                <button
                                  type="button"
                                  disabled
                                  className="inline-flex shrink-0 cursor-not-allowed items-center justify-center rounded-lg border border-border bg-ink/10 px-3.5 py-2.5 text-[10px] font-semibold tracking-[0.2em] text-ink-muted uppercase opacity-80 sm:px-4 sm:py-2.5 sm:text-xs"
                                  aria-disabled="true"
                                >
                                  {t(locale, "page.reserve.fullyBooked")}
                                </button>
                              ) : (
                                <BookTableWidgetButton
                                  type="button"
                                  className="inline-flex shrink-0 items-center justify-center rounded-lg border border-ink bg-ink px-3.5 py-2.5 text-[10px] font-semibold tracking-[0.2em] text-paper uppercase transition-colors hover:bg-ink/90 sm:px-4 sm:py-2.5 sm:text-xs"
                                >
                                  {t(locale, "nav.reserve")}
                                </BookTableWidgetButton>
                              )}
                            </div>
                          </div>
                        </article>
                      </li>
                    ))}
                  </ol>
                </div>
              )}
              {sorted.length > 0 ? (
                <div
                  className="pointer-events-none absolute inset-x-0 bottom-0 z-30 h-12 bg-gradient-to-t from-ink to-transparent"
                  aria-hidden
                />
              ) : null}
            </div>
          </div>

          {LAUNCH_UI_OPENING_HOURS ? (
            <aside className="w-full shrink-0 lg:sticky lg:top-[calc(var(--header-h)+1rem)] lg:w-[min(100%,22rem)] xl:w-[min(100%,24rem)]">
              {/* Opening hours card + `#hours` anchor: flip `LAUNCH_UI_OPENING_HOURS` in `config/launchUi.ts`. */}
              <OpeningHoursCard id="hours" headingId="home-hours-heading" />
            </aside>
          ) : null}
        </div>
      </div>
    </section>
  );
}
