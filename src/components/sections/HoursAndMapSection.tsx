"use client";

import { Clock } from "lucide-react";
import { LocationMap } from "@/components/LocationMap";
import { useEffect, useMemo, useState } from "react";
import { useLocale } from "@/i18n/useLocale";
import { t } from "@/i18n/strings";

type VenueStatus = {
  isOpen: boolean;
  label: string;
  detail: string;
};

function getMadridNowParts() {
  const dtf = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Europe/Madrid",
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  const parts = dtf.formatToParts(new Date());
  const weekday = parts.find((p) => p.type === "weekday")?.value ?? "Mon";
  const hour = Number(parts.find((p) => p.type === "hour")?.value ?? "0");
  const minute = Number(parts.find((p) => p.type === "minute")?.value ?? "0");

  return { weekday, hour, minute };
}

function getVenueStatus(locale: string): VenueStatus {
  const { weekday, hour, minute } = getMadridNowParts();
  const minutes = hour * 60 + minute;

  // Hours as displayed in the section.
  const OPEN_18 = 18 * 60;
  const CLOSE_23 = 23 * 60;
  const CLOSE_24 = 24 * 60;

  const isSun = weekday.startsWith("Sun");
  const isFri = weekday.startsWith("Fri");
  const isSat = weekday.startsWith("Sat");
  const isMonThu =
    weekday.startsWith("Mon") ||
    weekday.startsWith("Tue") ||
    weekday.startsWith("Wed") ||
    weekday.startsWith("Thu");

  const strings =
    locale === "es"
      ? {
          open: "Abierto ahora",
          closed: "Cerrado ahora",
          closesAt: "Cierra a las",
          opensAt: "Abre a las",
          today: "hoy",
          sunClosed: "Domingo cerrado",
        }
      : locale === "sv"
        ? {
            open: "Öppet nu",
            closed: "Stängt nu",
            closesAt: "Stänger",
            opensAt: "Öppnar",
            today: "idag",
            sunClosed: "Söndag stängt",
          }
        : {
            open: "Open now",
            closed: "Closed now",
            closesAt: "Closes at",
            opensAt: "Opens at",
            today: "today",
            sunClosed: "Sunday closed",
          };

  const fmt = (m: number) => {
    const h = Math.floor(m / 60) % 24;
    const mm = String(m % 60).padStart(2, "0");
    return `${String(h).padStart(2, "0")}:${mm}`;
  };

  if (isSun) {
    return { isOpen: false, label: strings.closed, detail: strings.sunClosed };
  }

  const close = isFri || isSat ? CLOSE_24 : isMonThu ? CLOSE_23 : CLOSE_23;
  const open = OPEN_18;

  const isOpen = minutes >= open && minutes < close;

  if (isOpen) {
    return {
      isOpen: true,
      label: strings.open,
      detail: `${strings.closesAt} ${fmt(close)} (${strings.today})`,
    };
  }

  return {
    isOpen: false,
    label: strings.closed,
    detail: `${strings.opensAt} ${fmt(open)} (${strings.today})`,
  };
}

export function HoursAndMapSection() {
  const { locale } = useLocale();
  const intro = "Subtitle example";

  const rows = [
    { day: "Mon", hours: "18:00 – 23:00" },
    { day: "Tue", hours: "18:00 – 23:00" },
    { day: "Wed", hours: "18:00 – 23:00" },
    { day: "Thu", hours: "18:00 – 23:00" },
    { day: "Fri", hours: "18:00 – 00:00" },
    { day: "Sat", hours: "18:00 – 00:00" },
    { day: "Sun", hours: "Closed" },
  ];

  const [tick, setTick] = useState(0);
  useEffect(() => {
    const id = window.setInterval(() => setTick((v) => v + 1), 30_000);
    return () => window.clearInterval(id);
  }, []);

  const status = useMemo(() => getVenueStatus(locale), [locale, tick]);

  return (
    <section
      id="hours"
      aria-labelledby="hours-heading"
      className="scroll-mt-[calc(var(--header-h)+1px)] border-t border-border bg-paper-dark/35"
    >
      <div className="w-full px-5 py-16 sm:px-10 sm:py-20 lg:px-14 xl:px-20">
        <div className="mx-auto w-full max-w-[min(100%,112rem)]">
          <div className="grid items-start gap-10 lg:grid-cols-2 lg:gap-14">
            <div className="min-w-0">
              <h2
                id="hours-heading"
                className="font-display text-4xl font-semibold tracking-tight text-ink sm:text-5xl"
              >
                {t(locale, "page.hours.title")}
              </h2>
              <p className="mt-4 max-w-2xl text-lg text-ink-muted leading-relaxed">
                {intro}
              </p>

              <div className="mt-10 max-w-xl rounded-none border border-border bg-paper-dark/50 p-8">
                <div className="flex items-center gap-3 text-ink">
                  <Clock className="size-6" strokeWidth={1.5} aria-hidden />
                </div>
                <div className="mt-5 flex flex-wrap items-center gap-3">
                  <span
                    className={[
                      "inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold tracking-[0.18em] uppercase",
                      status.isOpen
                        ? "border-emerald-600/25 bg-emerald-600/10 text-emerald-900"
                        : "border-rose-600/25 bg-rose-600/10 text-rose-900",
                    ].join(" ")}
                  >
                    {status.label}
                  </span>
                  <span className="text-sm text-ink-muted">{status.detail}</span>
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
              </div>
            </div>

            <div className="min-w-0">
              <LocationMap locale={locale} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

