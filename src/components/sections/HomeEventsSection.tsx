"use client";

import Link from "next/link";
import { EventCard } from "@/components/events/EventCard";
import { OpeningHoursCard } from "@/components/OpeningHoursCard";
import { LAUNCH_UI_OPENING_HOURS } from "@/config/launchUi";
import { usePublicEvents } from "@/hooks/usePublicEvents";
import { useLocale } from "@/i18n/useLocale";
import { t } from "@/i18n/strings";

export function HomeEventsSection() {
  const { locale } = useLocale();
  const { events, ready } = usePublicEvents();

  return (
    <section
      aria-labelledby="home-events-heading"
      className="border-t border-border bg-ink"
    >
      <div className="mx-auto w-full max-w-[min(100%,112rem)] px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
        <div
          className={[
            "flex flex-col gap-12",
            LAUNCH_UI_OPENING_HOURS ? "lg:flex-row lg:items-start lg:gap-16 xl:gap-20 2xl:gap-24" : "",
          ].join(" ")}
        >
          <div className="min-w-0 flex-1">
            <header className="max-w-4xl 2xl:max-w-5xl">
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
              ) : events.length === 0 ? (
                <p className="max-w-md text-base text-ink-muted leading-relaxed">
                  {t(locale, "page.home.eventsEmpty")}
                </p>
              ) : (
                <div className="w-full">
                  <ol className="relative z-10 m-0 flex list-none flex-col gap-10">
                    <div
                      className="pointer-events-none absolute left-4 top-0 bottom-0 z-0 w-px bg-[linear-gradient(to_bottom,transparent_0%,rgba(255,255,255,0.14)_10%,rgba(255,255,255,0.14)_90%,transparent_100%)]"
                      aria-hidden
                    />
                    {events.map((ev) => (
                      <li
                        key={ev.id}
                        className="relative w-full pl-10"
                      >
                        <span
                          className="absolute left-3.5 top-0 z-10 flex h-3.5 w-3.5 -translate-x-1/2 shrink-0 rounded-full border-2 border-paper/70 bg-ink shadow-[0_0_0_5px_var(--color-ink)] ring-1 ring-paper/15"
                          aria-hidden
                        />
                        <EventCard event={ev} locale={locale} variant="home" />
                      </li>
                    ))}
                  </ol>
                </div>
              )}
            </div>
          </div>

          {LAUNCH_UI_OPENING_HOURS ? (
            <aside className="w-full shrink-0 lg:sticky lg:top-[calc(var(--header-h)+1rem)] lg:w-[min(100%,32rem)] xl:w-[min(100%,40rem)] 2xl:w-[min(100%,44rem)]">
              {/* Opening hours card + `#hours` anchor: flip `LAUNCH_UI_OPENING_HOURS` in `config/launchUi.ts`. */}
              <OpeningHoursCard id="hours" headingId="home-hours-heading" />
            </aside>
          ) : null}
        </div>
      </div>
    </section>
  );
}
