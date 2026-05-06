"use client";

import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { getMenusRevealTargetMs } from "@/config/menusLaunch";
import { t } from "@/i18n/strings";
import { useLocale } from "@/i18n/useLocale";

/** Gold ring uses “full” circumference when this much time remains (10 calendar-day scale). */
const RING_WINDOW_MS = 10 * 86400000;

function useRemainingMs(targetMs: number) {
  /** `null` until client mount so SSR + first paint match (no Date.now() drift). */
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => {
    setNow(Date.now());
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, []);
  if (now === null) return null;
  return Math.max(0, targetMs - now);
}

export function MenusRevealCountdown() {
  const { locale } = useLocale();
  const targetMs = useMemo(() => getMenusRevealTargetMs(), []);
  const remaining = useRemainingMs(targetMs);
  const left = remaining ?? 0;
  const days = Math.floor(left / 86400000);
  const daysStr = days > 999 ? String(days) : String(days);

  const liveSummary = `${days} ${t(locale, "page.menu.countdownDays")}`;

  const ringCirc = 2 * Math.PI * 42;
  /** Stable placeholder arc until mount; avoids SSR/client `Date.now()` mismatch. */
  const arcLen =
    remaining === null
      ? ringCirc * 0.5
      : Math.min(1, Math.max(0.04, left / RING_WINDOW_MS)) * ringCirc;
  const ringDash = `${arcLen.toFixed(4)} ${ringCirc.toFixed(4)}`;

  return (
    <div className="relative mx-auto w-full max-w-lg">
      <span className="sr-only" aria-live="polite" aria-atomic>
        {remaining === null
          ? t(locale, "page.menu.countdownLive")
          : `${t(locale, "page.menu.countdownLive")}: ${liveSummary}`}
      </span>

      <p className="mx-auto mb-8 max-w-[20rem] text-center font-sans text-[11px] font-semibold leading-snug tracking-[0.28em] text-ink-muted uppercase sm:mb-10 sm:max-w-none sm:text-xs sm:tracking-[0.22em]">
        {t(locale, "page.menu.countdownHeading")}
      </p>

      <div className="relative mx-auto flex aspect-square w-[min(17.5rem,88vw)] items-center justify-center sm:w-[19.5rem]">
        <svg
          className="absolute size-full -rotate-90 text-paper/[0.08]"
          viewBox="0 0 100 100"
          aria-hidden
        >
          <circle
            cx="50"
            cy="50"
            r="48"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
          />
        </svg>

        <svg
          className="absolute size-full text-gold/35 animate-menus-reveal-ring"
          viewBox="0 0 100 100"
          aria-hidden
        >
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="currentColor"
            strokeWidth="0.6"
            strokeDasharray="10 14"
            strokeLinecap="round"
          />
        </svg>

        <svg
          className="absolute size-full -rotate-90 text-amber-700/40 transition-all duration-1000 ease-out"
          viewBox="0 0 100 100"
          aria-hidden
        >
          <circle
            cx="50"
            cy="50"
            r="42"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.25"
            strokeDasharray={ringDash}
            strokeLinecap="round"
          />
        </svg>

        <div className="absolute inset-[18%] rounded-full bg-[radial-gradient(circle_at_35%_25%,rgba(255,255,255,0.08),transparent_45%),radial-gradient(circle_at_70%_80%,rgba(201,164,74,0.14),transparent_50%)] ring-1 ring-paper/10" />

        <div className="relative z-10 flex w-[78%] flex-col items-center justify-center text-center">
          <motion.div
            className="rounded-2xl border border-paper/12 bg-paper-dark/85 px-8 py-6 shadow-[0_14px_44px_-18px_rgba(0,0,0,0.55)] backdrop-blur-md sm:rounded-3xl sm:px-10 sm:py-7"
            initial={false}
          >
            <motion.p
              key={remaining === null ? "pending" : daysStr}
              initial={{ opacity: 0.6, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
              className="font-display text-5xl tabular-nums tracking-tight text-paper sm:text-6xl"
              aria-hidden
            >
              {remaining === null ? (
                <span className="inline-block min-w-[3ch] animate-pulse rounded-md bg-paper/15">
                  &nbsp;
                </span>
              ) : (
                daysStr
              )}
            </motion.p>
            <p className="mt-3 text-[11px] font-semibold tracking-[0.22em] text-ink-muted uppercase sm:text-xs">
              {t(locale, "page.menu.countdownDays")}
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
