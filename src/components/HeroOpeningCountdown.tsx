"use client";

import { useEffect, useMemo, useState } from "react";
import { useLocale } from "@/i18n/useLocale";
import { t } from "@/i18n/strings";

function pad2(n: number) {
  return n.toString().padStart(2, "0");
}

function useCountdownParts(target: Date) {
  /** `null` until mount — avoids SSR/client `Date.now()` drift (same pattern as menu countdown ring). */
  const [parts, setParts] = useState<ReturnType<typeof computeParts> | null>(null);

  useEffect(() => {
    const tick = () => setParts(computeParts(target));
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, [target]);

  return parts;
}

function computeParts(target: Date) {
  const now = Date.now();
  const end = target.getTime();
  const ms = Math.max(0, end - now);
  const sec = Math.floor(ms / 1000);
  const days = Math.floor(sec / 86400);
  const hours = Math.floor((sec % 86400) / 3600);
  const minutes = Math.floor((sec % 3600) / 60);
  return { days, hours, minutes };
}

type Props = {
  targetDate: Date;
};

function localeTag(locale: string) {
  if (locale === "es") return "es-ES";
  if (locale === "sv") return "sv-SE";
  return "en-GB";
}

function Segment({
  value,
  label,
}: {
  value: string | number;
  label: string;
}) {
  return (
    <div className="flex min-w-[4.5rem] flex-col items-center justify-center px-[clamp(0.85rem,3.2vw,2.25rem)] py-[clamp(0.65rem,2.2vw,1.35rem)] sm:min-w-[5.5rem] sm:py-7">
      <span
        className="font-countdown-heavy tabular-nums tracking-[0.03em] text-paper/26"
        style={{
          fontSize: "clamp(2.4rem, 9.5vw, 5.75rem)",
          lineHeight: 0.88,
        }}
      >
        {value}
      </span>
      <span className="mt-[0.65em] max-w-[8em] text-center font-sans text-[10px] font-semibold uppercase leading-tight tracking-[0.42em] text-paper/34 sm:text-[11px] sm:tracking-[0.48em]">
        {label}
      </span>
    </div>
  );
}

export function HeroOpeningCountdown({ targetDate }: Props) {
  const { locale } = useLocale();
  const parts = useCountdownParts(targetDate);
  const days = parts?.days ?? 0;
  const hours = parts?.hours ?? 0;
  const minutes = parts?.minutes ?? 0;

  const dateCaption = useMemo(
    () =>
      new Intl.DateTimeFormat(localeTag(locale), {
        day: "numeric",
        month: "short",
        year: "numeric",
      }).format(targetDate),
    [targetDate, locale],
  );

  return (
    <div
      className="pointer-events-none absolute inset-0 z-[4] flex items-center justify-center overflow-hidden px-3 sm:px-6"
      aria-hidden
    >
      <div className="flex max-w-[min(100%,52rem)] -translate-y-[clamp(6rem,26vh,15rem)] flex-col items-center gap-5 sm:gap-6 sm:-translate-y-[clamp(7.5rem,28vh,17rem)]">
        <p className="text-center font-sans text-[10px] font-medium uppercase tracking-[0.55em] text-paper/90 sm:text-[11px] sm:tracking-[0.62em]">
          <span className="text-paper">{t(locale, "page.home.countdownLabel")}</span>
          <span className="mx-2 text-paper/55" aria-hidden>
            ·
          </span>
          <span className="text-paper">{dateCaption}</span>
        </p>

        <div
          className={`flex w-full max-w-[min(100%,46rem)] items-stretch overflow-hidden rounded-2xl border border-paper/[0.09] bg-gradient-to-b from-paper/[0.07] to-transparent shadow-[0_28px_90px_-24px_rgba(0,0,0,0.65),inset_0_1px_0_0_rgba(255,255,255,0.07)] backdrop-blur-md transition-opacity duration-300 sm:rounded-3xl ${
            parts === null ? "opacity-0" : "opacity-100"
          }`}
        >
          <Segment value={days} label="Days" />
          <div
            className="w-px shrink-0 bg-gradient-to-b from-transparent via-paper/18 to-transparent"
            aria-hidden
          />
          <Segment value={pad2(hours)} label="Hours" />
          <div
            className="w-px shrink-0 bg-gradient-to-b from-transparent via-paper/18 to-transparent"
            aria-hidden
          />
          <Segment value={pad2(minutes)} label="Min" />
        </div>
      </div>
    </div>
  );
}
