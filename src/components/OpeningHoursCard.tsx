"use client";

/**
 * Opening-hours + live open/closed strip for the home events column. Shown only when
 * `LAUNCH_UI_OPENING_HOURS` is true — see `HomeEventsSection` and `config/launchUi.ts`.
 */
import { useEffect, useState } from "react";
import { useLocale } from "@/i18n/useLocale";
import { t } from "@/i18n/strings";

/** Madrid time; venue open 17:00–01:00 every day (session crosses midnight). */
const OPEN_START_MIN = 17 * 60;
/** First minute we consider closed after night service (01:00). */
const NIGHT_END_MIN = 1 * 60;

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
  const hour = Number(parts.find((p) => p.type === "hour")?.value ?? "0");
  const minute = Number(parts.find((p) => p.type === "minute")?.value ?? "0");

  return { hour, minute };
}

function getVenueStatus(locale: string): VenueStatus {
  const { hour, minute } = getMadridNowParts();
  const minutes = hour * 60 + minute;

  const strings =
    locale === "es"
      ? {
          open: "Abierto ahora",
          closed: "Cerrado ahora",
          closesAt: "Cierra a las",
          opensAt: "Abre a las",
          today: "hoy",
        }
      : locale === "sv"
        ? {
            open: "Öppet nu",
            closed: "Stängt nu",
            closesAt: "Stänger",
            opensAt: "Öppnar",
            today: "i dag",
          }
        : {
            open: "Open now",
            closed: "Closed now",
            closesAt: "Closes at",
            opensAt: "Opens at",
            today: "tonight",
          };

  const fmt = (h: number, m: number) =>
    `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;

  const isOpen =
    minutes >= OPEN_START_MIN || minutes < NIGHT_END_MIN;

  if (isOpen) {
    return {
      isOpen: true,
      label: strings.open,
      detail: `${strings.closesAt} ${fmt(1, 0)} (${strings.today})`,
    };
  }

  return {
    isOpen: false,
    label: strings.closed,
    detail: `${strings.opensAt} ${fmt(17, 0)} (${strings.today})`,
  };
}

const WEEK_ROWS = [
  { day: "Mon", hours: "17:00 – 01:00" },
  { day: "Tue", hours: "17:00 – 01:00" },
  { day: "Wed", hours: "17:00 – 01:00" },
  { day: "Thu", hours: "17:00 – 01:00" },
  { day: "Fri", hours: "17:00 – 01:00" },
  { day: "Sat", hours: "17:00 – 01:00" },
  { day: "Sun", hours: "17:00 – 01:00" },
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
    <div id={id} className={["w-full scroll-mt-[calc(var(--header-h)+1px)]", className].filter(Boolean).join(" ")}>
      <div className="w-full rounded-2xl border border-border bg-paper-dark/65 px-8 py-8 shadow-[0_10px_40px_-14px_rgba(0,0,0,0.55)] ring-1 ring-paper/10 sm:rounded-3xl sm:px-10 sm:py-10 lg:px-12 lg:py-12">
        <h2
          id={headingId}
          className="font-display text-[clamp(1.875rem,2.8vw,2.75rem)] font-semibold tracking-tight text-paper sm:font-medium"
        >
          {t(locale, "page.hours.title")}
        </h2>

        <p
          className="mt-6 font-sans text-base leading-relaxed text-ink-muted sm:mt-7 sm:text-[17px] lg:text-lg"
          role="status"
        >
          <span
            className={`mr-2.5 inline-block size-2.5 translate-y-px rounded-full ${
              status.isOpen ? "bg-emerald-600/80" : "bg-rose-500/75"
            }`}
            aria-hidden
          />
          <span className="font-medium text-paper">{status.label}</span>
          <span className="font-normal"> — {status.detail}</span>
        </p>

        <ul className="mt-8 space-y-3.5 font-sans sm:mt-10 sm:space-y-4">
          {WEEK_ROWS.map((row) => (
            <li
              key={row.day}
              className="flex items-baseline justify-between gap-6 border-b border-paper/10 pb-3.5 last:border-b-0 last:pb-0 sm:gap-8 sm:pb-4"
            >
              <span className="min-w-13 text-base font-normal text-ink-muted sm:min-w-16 sm:text-lg">
                {row.day}
              </span>
              <span className="text-base tabular-nums font-medium text-paper sm:text-lg">
                {row.hours}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
