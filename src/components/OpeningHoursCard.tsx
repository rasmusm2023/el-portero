"use client";

/**
 * Opening-hours + live open/closed strip for the home events column. Shown only when
 * `LAUNCH_UI_OPENING_HOURS` is true — see `HomeEventsSection` and `config/launchUi.ts`.
 */
import { useEffect, useMemo, useState } from "react";
import { useLocale } from "@/i18n/useLocale";
import { t, type MessageKey } from "@/i18n/strings";
import { usePublishedOpeningHours } from "@/hooks/usePublishedOpeningHours";
import { resolvePublicOpeningHours } from "@/lib/openingHoursTypes";
import { getVenueStatus, formatDayHoursLine } from "@/lib/openingHoursVenueStatus";

type OpeningHoursCardProps = {
  /** For deep links (`/#hours`). */
  id?: string;
  headingId?: string;
  className?: string;
};

const DAY_PUBLIC_LABEL_KEYS: Record<string, MessageKey> = {
  mon: "openingHours.day.mon",
  tue: "openingHours.day.tue",
  wed: "openingHours.day.wed",
  thu: "openingHours.day.thu",
  fri: "openingHours.day.fri",
  sat: "openingHours.day.sat",
  sun: "openingHours.day.sun",
};

export function OpeningHoursCard({
  id,
  headingId = "hours-heading",
  className = "",
}: OpeningHoursCardProps) {
  const { locale } = useLocale();
  const { remote, ready } = usePublishedOpeningHours();
  const schedule = useMemo(
    () => (ready ? resolvePublicOpeningHours(remote) : null),
    [ready, remote],
  );

  const [, setTick] = useState(0);
  useEffect(() => {
    const timer = window.setInterval(() => setTick((v) => v + 1), 30_000);
    return () => window.clearInterval(timer);
  }, []);

  if (!schedule) {
    return (
      <div
        id={id}
        className={["w-full scroll-mt-[calc(var(--header-h)+1px)]", className].filter(Boolean).join(" ")}
        aria-busy="true"
      />
    );
  }

  const status = getVenueStatus(locale, schedule);

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
          {schedule.rows.map((row) => (
            <li
              key={row.dayKey}
              className="flex items-baseline justify-between gap-6 border-b border-paper/10 pb-3.5 last:border-b-0 last:pb-0 sm:gap-8 sm:pb-4"
            >
              <span className="min-w-13 text-base font-normal text-ink-muted sm:min-w-16 sm:text-lg">
                {t(locale, DAY_PUBLIC_LABEL_KEYS[row.dayKey] ?? "openingHours.day.mon")}
              </span>
              <span className="text-base font-medium tabular-nums text-paper sm:text-lg">
                {formatDayHoursLine(locale, row)}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
