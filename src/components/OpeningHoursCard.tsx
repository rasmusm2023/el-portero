"use client";

import { useEffect, useState } from "react";
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

const WEEK_ROWS = [
  { day: "Mon", hours: "18:00 – 23:00" },
  { day: "Tue", hours: "18:00 – 23:00" },
  { day: "Wed", hours: "18:00 – 23:00" },
  { day: "Thu", hours: "18:00 – 23:00" },
  { day: "Fri", hours: "18:00 – 00:00" },
  { day: "Sat", hours: "18:00 – 00:00" },
  { day: "Sun", hours: "Closed" },
] as const;

type OpeningHoursCardProps = {
  /** For deep links (`/#hours`). */
  id?: string;
  headingId?: string;
  className?: string;
};

export function OpeningHoursCard({
  id,
  headingId = "hours-heading",
  className = "",
}: OpeningHoursCardProps) {
  const { locale } = useLocale();

  const [, setTick] = useState(0);
  useEffect(() => {
    const timer = window.setInterval(() => setTick((v) => v + 1), 30_000);
    return () => window.clearInterval(timer);
  }, []);

  const status = getVenueStatus(locale);

  return (
    <div id={id} className={["scroll-mt-[calc(var(--header-h)+1px)]", className].filter(Boolean).join(" ")}>
      <div className="max-w-xl rounded-2xl bg-paper/75 px-6 py-6 shadow-[0_4px_28px_-8px_rgba(10,10,10,0.08)] ring-1 ring-ink/6 sm:px-7 sm:py-7 md:max-w-none">
        <h2
          id={headingId}
          className="font-display text-3xl font-semibold tracking-tight text-ink/95 sm:text-[2rem] lg:text-[2.125rem] lg:font-medium"
        >
          {t(locale, "page.hours.title")}
        </h2>

        <p
          className="mt-5 font-sans text-sm leading-relaxed text-ink-muted sm:text-[15px] lg:mt-6"
          role="status"
        >
          <span
            className={`mr-2 inline-block size-2 translate-y-px rounded-full ${
              status.isOpen ? "bg-emerald-600/80" : "bg-rose-500/75"
            }`}
            aria-hidden
          />
          <span className="font-medium text-ink">{status.label}</span>
          <span className="font-normal"> — {status.detail}</span>
        </p>

        <ul className="mt-6 space-y-2.5 font-sans sm:space-y-3">
          {WEEK_ROWS.map((row) => (
            <li
              key={row.day}
              className="flex items-baseline justify-between gap-4"
            >
              <span className="min-w-11 text-[15px] font-normal text-ink-muted">
                {row.day}
              </span>
              <span className="text-[15px] tabular-nums font-medium text-ink sm:text-base">
                {row.hours}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
