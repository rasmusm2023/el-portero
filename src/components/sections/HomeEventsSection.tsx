"use client";

import Image from "next/image";
import Link from "next/link";
import { homeEvents } from "@/data/homeEvents";
import { useLocale } from "@/i18n/useLocale";
import { t } from "@/i18n/strings";

export function HomeEventsSection() {
  const { locale } = useLocale();
  const sorted = [...homeEvents].sort((a, b) => a.sortDate.localeCompare(b.sortDate));

  if (sorted.length === 0) return null;

  return (
    <section
      aria-labelledby="home-events-heading"
      className="border-t border-border bg-paper"
    >
      <div className="mx-auto w-full max-w-[var(--container-max)] px-5 pt-20 pb-0 sm:px-10 sm:pt-24 lg:px-14 xl:px-20">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between sm:gap-8">
          <div className="min-w-0">
            <h2
              id="home-events-heading"
              className="font-display text-3xl font-medium tracking-tight text-ink sm:text-4xl"
            >
              {t(locale, "page.home.eventsHeading")}
            </h2>
            <p className="mt-3 max-w-2xl text-lg text-ink-muted leading-relaxed">
              {t(locale, "page.home.eventsIntro")}
            </p>
          </div>
          <div className="flex shrink-0 flex-col items-start gap-2 sm:items-end">
            <p className="text-xs font-medium tracking-[0.18em] text-ink-muted uppercase sm:text-right">
              {t(locale, "page.home.eventsScrollHint")}
            </p>
            <Link
              href="/events"
              className="text-sm font-semibold tracking-[0.2em] text-ink uppercase underline-offset-[0.35em] transition-colors hover:text-ink-muted"
            >
              {t(locale, "page.home.eventsViewAll")}
            </Link>
          </div>
        </div>
      </div>

      {/* Full-bleed strip: wider than site container so the timeline uses horizontal space */}
      <div className="relative mt-12 w-screen max-w-[100vw] left-1/2 -translate-x-1/2">
        <div className="mx-auto w-full max-w-[min(100vw,112rem)] px-4 pb-20 pt-0 sm:px-6 sm:pb-24 lg:px-10 xl:px-16 2xl:px-20">
          <div
            className={[
              "overflow-x-auto overflow-y-visible overscroll-x-contain scroll-smooth pb-3 pt-2",
              "snap-x snap-mandatory",
              "[scrollbar-width:thin]",
              "[&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-track]:bg-paper-dark/50 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-ink/25",
            ].join(" ")}
            tabIndex={0}
            role="region"
            aria-label={t(locale, "page.home.eventsHeading")}
          >
            <div className="relative inline-flex min-h-[min(26rem,58vh)] w-max max-w-none gap-10 pr-4 sm:gap-12 sm:pr-6 lg:gap-14 lg:pr-10">
              {/* Timeline spine — spans full scroll content width */}
              <div
                className="pointer-events-none absolute left-0 right-0 top-[13px] z-0 h-px bg-gradient-to-r from-transparent via-ink/25 to-transparent"
                aria-hidden
              />

              <ol className="relative z-10 m-0 flex list-none gap-10 p-0 sm:gap-12 lg:gap-14">
                {sorted.map((ev) => (
                  <li
                    key={ev.id}
                    className="w-[min(92vw,38rem)] shrink-0 snap-center sm:w-[46rem] lg:w-[52rem] xl:w-[min(90vw,58rem)]"
                  >
                    <div className="flex flex-col items-center pb-3">
                      <span
                        className="relative z-10 flex h-3.5 w-3.5 shrink-0 rounded-full border-2 border-ink bg-paper shadow-[0_0_0_5px_rgb(250,249,246)] ring-1 ring-ink/10"
                        aria-hidden
                      />
                      <time
                        className="mt-3 max-w-[20rem] text-center text-[10px] font-semibold leading-snug tracking-[0.2em] text-ink-muted uppercase sm:text-[11px]"
                        dateTime={ev.sortDate}
                      >
                        {ev.weekdayDate[locale]}
                      </time>
                    </div>

                    <article className="group flex min-h-[13.5rem] flex-row overflow-hidden rounded-2xl border border-border bg-paper-dark/35 shadow-sm ring-1 ring-border/60 transition-[box-shadow,ring-color] duration-300 hover:shadow-md hover:ring-border sm:min-h-[15rem] sm:rounded-3xl">
                      <div className="relative w-[44%] min-w-[9rem] max-w-[18rem] shrink-0 self-stretch bg-ink/5 sm:w-[46%] sm:min-w-[11rem] sm:max-w-[22rem] xl:max-w-[26rem]">
                        <Image
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
          </div>
        </div>
      </div>
    </section>
  );
}
