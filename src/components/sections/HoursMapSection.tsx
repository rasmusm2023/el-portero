"use client";

import { Clock } from "lucide-react";
import { LocationMap } from "@/components/LocationMap";
import { useLocale } from "@/i18n/useLocale";
import { t } from "@/i18n/strings";

export function HoursMapSection() {
  const { locale } = useLocale();
  const intro =
    locale === "es"
      ? "Horario orientativo — horas reales y excepciones se gestionarán en admin."
      : locale === "sv"
        ? "Exempelöppettider — riktiga tider och undantag kommer i admin."
        : "Illustrative hours — live schedule, exceptions, and open/closed state will come from admin.";

  const rows = [
    { day: "Mon – Thu", hours: "18:00 – 23:00" },
    { day: "Fri – Sat", hours: "18:00 – 00:00" },
    { day: "Sun", hours: "Closed" },
  ];

  return (
    <section
      id="hours"
      aria-labelledby="hours-heading"
      className="scroll-mt-[calc(var(--header-h)+1px)] border-t border-border bg-paper-dark/35"
    >
      <div className="w-full px-5 py-16 sm:px-10 sm:py-20 lg:px-14 xl:px-20">
        <h2
          id="hours-heading"
          className="font-display text-3xl font-medium tracking-tight text-ink sm:text-4xl"
        >
          {t(locale, "page.hours.title")}
        </h2>
        <p className="mt-4 max-w-2xl text-lg text-ink-muted leading-relaxed">
          {intro}
        </p>

        <div className="mt-10 grid gap-10 lg:grid-cols-2 lg:items-start lg:gap-12">
          <div className="max-w-xl rounded-none border border-border bg-paper-dark/50 p-8 lg:max-w-none">
            <div className="flex items-center gap-3 text-ink">
              <Clock className="size-6" strokeWidth={1.5} aria-hidden />
              <p className="text-sm font-medium tracking-[0.2em] text-ink uppercase">
                Europe/Madrid
              </p>
            </div>
            <ul className="mt-8 space-y-4">
              {rows.map((row) => (
                <li
                  key={row.day}
                  className="flex items-baseline justify-between gap-4 border-b border-border pb-4 last:border-0 last:pb-0"
                >
                  <span className="text-ink-muted">{row.day}</span>
                  <span className="font-medium tabular-nums text-ink">
                    {row.hours}
                  </span>
                </li>
              ))}
            </ul>
            <p className="mt-8 text-sm text-ink-muted">
              {locale === "es"
                ? "Indicador abierto/cerrado en tiempo real: en construcción."
                : locale === "sv"
                  ? "Live öppet/stängt: under utveckling."
                  : "Live open/closed indicator: coming with backend integration."}
            </p>
          </div>

          <LocationMap locale={locale} className="lg:pt-1" />
        </div>
      </div>
    </section>
  );
}
