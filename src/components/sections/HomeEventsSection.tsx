"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { EventImage } from "@/components/events/EventImage";
import { publicEventFromDto, type HomeEvent, type PublicEventApiDto } from "@/lib/publicEventTypes";
import { getApiBaseUrl } from "@/lib/apiBase";
import { useLocale } from "@/i18n/useLocale";
import { t } from "@/i18n/strings";

export function HomeEventsSection() {
  const { locale } = useLocale();
  const [homeEvents, setHomeEvents] = useState<HomeEvent[] | null>(null);
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const itemRefs = useMemo(() => new Map<string, HTMLLIElement>(), []);

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

  if (homeEvents === null) return null;

  const sorted = [...homeEvents].sort((a, b) => a.sortDate.localeCompare(b.sortDate));
  if (sorted.length === 0) return null;

  return (
    <section
      aria-labelledby="home-events-heading"
      className="border-t border-border bg-paper"
    >
      <div className="mx-auto w-full max-w-[min(100%,112rem)] px-5 py-20 sm:px-10 sm:py-24 lg:px-14 xl:px-20">
        <div className="flex flex-col items-start gap-10 md:flex-row md:gap-12 lg:gap-14">
          <div className="min-w-0 md:w-1/2 md:max-w-[50%]">
            <h2
              id="home-events-heading"
              className="font-display text-4xl font-semibold tracking-tight text-ink sm:text-5xl"
            >
              {t(locale, "page.home.eventsHeading")}
            </h2>
            <p className="mt-3 text-lg text-ink-muted leading-relaxed">
              {t(locale, "page.home.eventsIntro")}
            </p>
            <div className="mt-6 flex flex-col items-start gap-2">
              <Link
                href="/events"
                className="text-sm font-semibold tracking-[0.2em] text-ink uppercase underline-offset-[0.35em] transition-colors hover:text-ink-muted"
              >
                {t(locale, "page.home.eventsViewAll")}
              </Link>
            </div>
          </div>

          <div className="relative min-w-0 md:ml-auto md:w-1/2 md:max-w-[50%]">
            <div className="relative w-full max-w-[44rem]">
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
                {/* Vertical timeline spine (spans full content height) */}
                <div
                  className="pointer-events-none absolute left-4 top-0 bottom-0 z-0 w-px bg-[linear-gradient(to_bottom,transparent_0%,rgba(10,10,10,0.20)_10%,rgba(10,10,10,0.20)_90%,transparent_100%)]"
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
                      className="absolute left-[0.875rem] top-0 z-10 flex h-3.5 w-3.5 -translate-x-1/2 shrink-0 rounded-full border-2 border-ink bg-paper shadow-[0_0_0_5px_rgb(250,249,246)] ring-1 ring-ink/10"
                      aria-hidden
                    />
                    <time
                      className="mb-3 block text-left text-[10px] font-semibold leading-snug tracking-[0.2em] text-ink-muted uppercase sm:text-[11px]"
                      dateTime={ev.sortDate}
                    >
                      {ev.weekdayDate[locale]}
                    </time>

                    <article className="group flex w-full min-h-[13.5rem] flex-row overflow-hidden rounded-2xl border border-border bg-paper-dark/35 shadow-sm ring-1 ring-border/60 transition-[box-shadow,ring-color] duration-300 hover:shadow-md hover:ring-border sm:min-h-[15rem] sm:rounded-3xl">
                      <div className="relative w-[44%] min-w-[9rem] max-w-[18rem] shrink-0 self-stretch bg-ink/5 sm:w-[46%] sm:min-w-[11rem] sm:max-w-[22rem] xl:max-w-[26rem]">
                        <EventImage
                          src={ev.imageSrc}
                          alt={ev.imageAlt[locale]}
                          fill
                          className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                          sizes="(max-width: 640px) 45vw, (max-width: 1024px) 280px, (max-width: 1280px) 320px, 380px"
                        />
                        <div
                          className="pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-ink/10"
                          aria-hidden
                        />
                      </div>
                      <div className="flex min-h-0 min-w-0 flex-1 flex-col justify-between gap-4 px-4 py-5 sm:gap-5 sm:px-6 sm:py-6">
                        <div className="min-w-0">
                          <h3 className="font-display text-lg font-medium leading-snug tracking-tight text-ink sm:text-xl">
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
                          <Link
                            href="/reserve"
                            className="inline-flex shrink-0 items-center justify-center rounded-lg border border-ink bg-ink px-3.5 py-2.5 text-[10px] font-semibold tracking-[0.2em] text-paper uppercase transition-colors hover:bg-ink/90 sm:px-4 sm:py-2.5 sm:text-xs"
                          >
                            {t(locale, "nav.reserve")}
                          </Link>
                          <Link
                            href="/events"
                            className="inline-flex shrink-0 items-center justify-center rounded-lg border border-ink/30 bg-paper px-3.5 py-2.5 text-[10px] font-semibold tracking-[0.2em] text-ink uppercase transition-colors hover:border-ink hover:bg-ink hover:text-paper sm:px-4 sm:py-2.5 sm:text-xs"
                          >
                            {t(locale, "page.home.eventsCta")}
                          </Link>
                        </div>
                      </div>
                    </article>
                  </li>
                ))}
                </ol>
              </div>

              {/* Scroll fade (top/bottom) so cards don't hard-cut */}
              <div className="pointer-events-none absolute inset-x-0 bottom-0 z-30 h-12 bg-gradient-to-t from-paper to-transparent" aria-hidden />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
