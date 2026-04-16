"use client";

import { useEffect, useMemo, useState } from "react";
import { ReserveDateField } from "@/components/reservation/ReserveDateField";
import { ReserveInlineSelect } from "@/components/reservation/ReserveInlineSelect";
import {
  getUnavailableTimesForDate,
  hasAnyAvailableTime,
  isDateFullyBooked,
  isTimeSlotBooked,
} from "@/data/reservationAvailability";
import type { Locale } from "@/i18n/strings";
import { useLocale } from "@/i18n/useLocale";
import { t } from "@/i18n/strings";

function guestOptionLabel(count: number, locale: Locale): string {
  if (locale === "sv") {
    return count === 1 ? "1 gäst" : `${count} gäster`;
  }
  if (locale === "es") {
    return count === 1 ? "1 comensal" : `${count} comensales`;
  }
  return count === 1 ? "1 guest" : `${count} guests`;
}

/** 24-hour clock for all locales (including English). */
function formatTimeLabel(value: string): string {
  const [hStr, mStr] = value.split(":");
  return `${hStr.padStart(2, "0")}:${mStr.padStart(2, "0")}`;
}

const TIME_VALUES = (() => {
  const out: string[] = [];
  for (let h = 18; h <= 22; h++) {
    for (const m of [0, 15, 30, 45]) {
      if (h === 22 && m > 0) continue;
      out.push(`${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`);
    }
  }
  return out;
})();

/** Flip to `true` when online booking (Tock / Baemingo / API) is wired. */
const RESERVATION_SYSTEM_LIVE = false;

/**
 * Reservations layout: hero + Tock-style inline bar (party / date / time / book).
 */
export function ReservePage() {
  const { locale } = useLocale();
  const [newsletterThanks, setNewsletterThanks] = useState(false);

  const [guests, setGuests] = useState(2);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [openMenu, setOpenMenu] = useState<"guests" | "date" | "time" | null>(null);

  useEffect(() => {
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpenMenu(null);
    };
    document.addEventListener("keydown", onEsc);
    return () => document.removeEventListener("keydown", onEsc);
  }, []);

  /** Recover if state was ever set to a non-string (e.g. mistaken DOM event). */
  useEffect(() => {
    if (typeof date !== "string") setDate("");
    if (typeof time !== "string") setTime("");
  }, [date, time]);

  /** Clear time if it becomes invalid for the newly selected date. */
  useEffect(() => {
    if (typeof date !== "string" || !date) return;
    setTime((prev) => {
      const p = typeof prev === "string" ? prev : "";
      return p && isTimeSlotBooked(date, p) ? "" : p;
    });
  }, [date]);

  const guestOptions = useMemo(
    () =>
      Array.from({ length: 12 }, (_, i) => {
        const n = i + 1;
        return { value: String(n), label: guestOptionLabel(n, locale) };
      }),
    [locale],
  );

  const timeOptions = useMemo(() => {
    const blocked = date ? getUnavailableTimesForDate(date) : new Set<string>();
    return TIME_VALUES.map((v) => {
      const unavailable = blocked.has(v);
      return {
        value: v,
        label: unavailable
          ? `${formatTimeLabel(v)} · ${t(locale, "page.reserve.timeUnavailable")}`
          : formatTimeLabel(v),
        disabled: unavailable,
      };
    });
  }, [date, locale]);

  const formComplete = Boolean(date && time);
  const noTimesOnDate =
    Boolean(date) &&
    !isDateFullyBooked(date) &&
    !hasAnyAvailableTime(date, TIME_VALUES);

  const bookButtonTitle = !formComplete
    ? t(locale, "page.reserve.bookIncompleteHint")
    : !RESERVATION_SYSTEM_LIVE
      ? t(locale, "page.reserve.bookNowDisabledHint")
      : undefined;

  const bookButtonDisabled = !formComplete || !RESERVATION_SYSTEM_LIVE;

  const bookButtonClass =
    !formComplete
      ? "border border-ink/15 bg-paper-dark/90 text-ink/45 shadow-none hover:bg-paper-dark/90"
      : !RESERVATION_SYSTEM_LIVE
        ? "bg-[#2563eb] text-white opacity-[0.88] hover:bg-[#2563eb]"
        : "bg-[#2563eb] text-white hover:bg-[#1d4ed8]";

  return (
    <div className="mx-auto w-full max-w-[var(--container-max)] px-4 pb-20 pt-10 sm:px-6 sm:pb-24 sm:pt-12 lg:px-8 lg:pt-16">
      <header className="text-center">
        <h1 className="font-hero-title text-[clamp(2.25rem,6vw,4.25rem)] font-normal leading-[1.05] tracking-[0.14em] text-ink uppercase">
          {t(locale, "page.reserve.heroTitle")}
        </h1>
        <p className="mx-auto mt-10 max-w-2xl font-sans text-base leading-[1.75] text-ink-muted sm:mt-12 sm:text-lg">
          {t(locale, "page.reserve.heroBody")}
        </p>
      </header>

      <section
        aria-labelledby="reserve-form-heading"
        className="mx-auto mt-16 max-w-5xl sm:mt-20 md:mt-24"
      >
        <h2 id="reserve-form-heading" className="sr-only">
          {t(locale, "page.reserve.title")}
        </h2>
        <form
          className="space-y-6"
          onSubmit={(e) => {
            e.preventDefault();
          }}
        >
          <div
            className={
              openMenu
                ? "flex w-full min-w-0 flex-row flex-nowrap divide-x divide-ink/12 overflow-visible rounded-md border border-ink/15 bg-white shadow-[0_1px_3px_rgba(10,10,10,0.06)]"
                : "flex w-full min-w-0 flex-row flex-nowrap divide-x divide-ink/12 overflow-x-auto rounded-md border border-ink/15 bg-white shadow-[0_1px_3px_rgba(10,10,10,0.06)] [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            }
            role="group"
            aria-label={t(locale, "page.reserve.title")}
          >
            <div className="relative z-10 flex min-w-[10.5rem] shrink-0 flex-1 flex-col justify-center px-4 py-3 sm:min-w-0">
              <span
                id="reserve-guests-label"
                className="text-[10px] font-semibold uppercase tracking-[0.14em] text-ink/50"
              >
                {t(locale, "page.reserve.labelGuests")}
              </span>
              <ReserveInlineSelect
                id="reserve-guests"
                name="guests"
                labelId="reserve-guests-label"
                value={String(guests)}
                onValueChange={(v) => setGuests(Number(v))}
                options={guestOptions}
                isOpen={openMenu === "guests"}
                onOpenToggle={() =>
                  setOpenMenu((m) => (m === "guests" ? null : "guests"))
                }
                onClose={() => setOpenMenu(null)}
              />
            </div>

            <div className="relative z-10 flex min-w-[11rem] shrink-0 flex-1 flex-col justify-center px-4 py-3 sm:min-w-0">
              <span
                id="reserve-date-label"
                className="text-[10px] font-semibold uppercase tracking-[0.14em] text-ink/50"
              >
                {t(locale, "page.reserve.labelDate")}
              </span>
              <ReserveDateField
                id="reserve-date"
                name="date"
                labelId="reserve-date-label"
                value={typeof date === "string" ? date : ""}
                onValueChange={(iso) => setDate(iso)}
                placeholder={t(locale, "page.reserve.datePlaceholder")}
                dialogAriaLabel={t(locale, "page.reserve.labelDate")}
                isFullyBooked={(iso) => isDateFullyBooked(iso)}
                fullyBookedLabel={t(locale, "page.reserve.fullyBooked")}
                locale={locale}
                isOpen={openMenu === "date"}
                onOpenToggle={() =>
                  setOpenMenu((m) => (m === "date" ? null : "date"))
                }
                onClose={() => setOpenMenu(null)}
              />
            </div>

            <div className="relative z-10 flex min-w-[10.5rem] shrink-0 flex-1 flex-col justify-center px-4 py-3 sm:min-w-0">
              <span
                id="reserve-time-label"
                className="text-[10px] font-semibold uppercase tracking-[0.14em] text-ink/50"
              >
                {t(locale, "page.reserve.labelTime")}
              </span>
              <ReserveInlineSelect
                id="reserve-time"
                name="time"
                labelId="reserve-time-label"
                value={typeof time === "string" ? time : ""}
                onValueChange={(v) => setTime(v)}
                options={timeOptions}
                placeholder={t(locale, "page.reserve.timePlaceholder")}
                isOpen={openMenu === "time"}
                onOpenToggle={() =>
                  setOpenMenu((m) => (m === "time" ? null : "time"))
                }
                onClose={() => setOpenMenu(null)}
              />
            </div>

            <button
              type="button"
              className={`relative z-0 flex min-h-19 min-w-34 shrink-0 items-center justify-center px-5 font-sans text-sm font-semibold transition-colors disabled:cursor-not-allowed ${bookButtonClass}`}
              disabled={bookButtonDisabled}
              title={bookButtonTitle}
              onClick={() => setOpenMenu(null)}
            >
              {t(locale, "page.reserve.bookNow")}
            </button>
          </div>

          {noTimesOnDate ? (
            <p className="text-center text-sm text-ink-muted sm:text-left" role="status">
              {t(locale, "page.reserve.noTimesForDate")}
            </p>
          ) : null}

          <p className="text-center text-xs leading-relaxed text-ink-muted sm:text-left">
            {t(locale, "page.reserve.policyNote")}
          </p>
        </form>
      </section>

      <section
        aria-labelledby="reserve-newsletter-heading"
        className="mx-auto mt-20 max-w-2xl border-t border-border pt-16 text-center sm:mt-24 sm:pt-20 md:mt-28 md:pt-24"
      >
        <h2
          id="reserve-newsletter-heading"
          className="font-hero-title text-2xl font-normal tracking-[0.16em] text-ink uppercase sm:text-3xl sm:tracking-[0.18em]"
        >
          {t(locale, "page.reserve.newsletterHeading")}
        </h2>
        <p className="mx-auto mt-6 max-w-lg font-sans text-base leading-relaxed text-ink-muted sm:mt-8">
          {t(locale, "page.reserve.newsletterBody")}
        </p>

        {newsletterThanks ? (
          <p className="mt-10 font-display text-xl font-medium text-ink" role="status">
            {t(locale, "page.reserve.newsletterThanks")}
          </p>
        ) : (
          <form
            className="mx-auto mt-10 flex max-w-xl flex-col gap-3 sm:mt-12 sm:flex-row sm:items-stretch sm:gap-0 sm:overflow-hidden sm:border sm:border-ink/12 sm:bg-paper sm:shadow-[inset_0_1px_0_rgba(255,255,255,0.6)]"
            onSubmit={(e) => {
              e.preventDefault();
              setNewsletterThanks(true);
            }}
          >
            <label htmlFor="reserve-newsletter-email" className="sr-only">
              {t(locale, "page.reserve.newsletterEmailPlaceholder")}
            </label>
            <input
              id="reserve-newsletter-email"
              name="email"
              type="email"
              autoComplete="email"
              required
              placeholder={t(locale, "page.reserve.newsletterEmailPlaceholder")}
              className="min-h-13 w-full flex-1 border border-ink/12 bg-paper px-4 py-3.5 font-sans text-ink placeholder:text-ink-muted/45 focus:border-ink/35 focus:outline-none focus:ring-1 focus:ring-ink/15 sm:border-0 sm:py-4"
            />
            <button
              type="submit"
              className="min-h-13 shrink-0 border border-ink bg-ink px-8 font-sans text-[11px] font-semibold tracking-[0.22em] text-paper uppercase transition-colors hover:bg-ink/90 sm:border-0 sm:px-10"
            >
              {t(locale, "page.reserve.newsletterSubmit")}
            </button>
          </form>
        )}
      </section>
    </div>
  );
}
