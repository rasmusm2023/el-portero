"use client";

import { Phone } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import {
  BOOKING_PHONE_DISPLAY,
  bookingTelHref,
  bookingWhatsAppHref,
} from "@/config/site";
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
        className="mx-auto mt-12 max-w-5xl sm:mt-16 md:mt-20"
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
        aria-labelledby="reserve-alt-heading"
        className="mx-auto mt-16 max-w-5xl border-t border-border pt-14 sm:mt-20 sm:pt-16"
      >
        <div className="flex items-center justify-center gap-3 sm:gap-5">
          <span
            className="h-px min-w-[2.5rem] flex-1 max-w-[10rem] bg-border/90"
            aria-hidden
          />
          <p className="shrink-0 font-sans text-[11px] font-semibold uppercase tracking-[0.32em] text-ink/45">
            {t(locale, "page.reserve.altBookingOr")}
          </p>
          <span
            className="h-px min-w-[2.5rem] flex-1 max-w-[10rem] bg-border/90"
            aria-hidden
          />
        </div>
        <h2
          id="reserve-alt-heading"
          className="mt-8 text-center font-display text-xl font-medium tracking-tight text-ink sm:mt-10 sm:text-2xl"
        >
          {t(locale, "page.reserve.altBookingTitle")}
        </h2>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 sm:gap-6 lg:gap-8">
          <a
            href={bookingTelHref()}
            className="group flex flex-col items-center rounded-2xl border border-ink/12 bg-linear-to-b from-paper to-paper-dark/60 px-6 py-10 text-center shadow-[0_16px_44px_-22px_rgba(10,10,10,0.14)] ring-1 ring-ink/[0.07] outline-none transition-[border-color,box-shadow,ring-color] duration-200 ease-out hover:border-ink/30 hover:shadow-[0_16px_44px_-20px_rgba(10,10,10,0.18)] hover:ring-ink/15 active:border-ink/18 active:shadow-[0_12px_36px_-22px_rgba(10,10,10,0.12)] focus-visible:ring-2 focus-visible:ring-ink/30 focus-visible:ring-offset-2 focus-visible:ring-offset-paper sm:rounded-3xl"
            aria-label={t(locale, "page.reserve.altCallAria")}
          >
            <span className="flex size-16 items-center justify-center rounded-full bg-ink/6 ring-1 ring-ink/10 transition-colors duration-200 ease-out group-hover:bg-ink/12">
              <Phone className="size-7 text-ink" strokeWidth={1.5} aria-hidden />
            </span>
            <p className="mt-7 font-mono text-xl font-medium tracking-[0.12em] text-ink sm:text-2xl">
              {BOOKING_PHONE_DISPLAY}
            </p>
            <span className="mt-9 inline-flex min-h-11 min-w-[8.5rem] items-center justify-center rounded-full border border-ink/25 bg-ink px-8 py-2.5 font-sans text-[11px] font-semibold tracking-[0.24em] text-paper uppercase shadow-sm transition-[background-color,border-color] duration-200 ease-out group-hover:border-gold group-hover:bg-gold">
              {t(locale, "page.reserve.altCall")}
            </span>
          </a>
          <a
            href={bookingWhatsAppHref()}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex flex-col items-center rounded-2xl border border-[#128C7E]/28 bg-linear-to-b from-paper to-[#e8f7f3]/90 px-6 py-10 text-center shadow-[0_16px_44px_-22px_rgba(18,140,126,0.12)] ring-1 ring-[#128C7E]/12 outline-none transition-[border-color,box-shadow,ring-color] duration-200 ease-out hover:border-[#128C7E]/45 hover:shadow-[0_16px_44px_-18px_rgba(18,140,126,0.18)] hover:ring-[#128C7E]/22 active:border-[#128C7E]/30 active:shadow-[0_12px_36px_-20px_rgba(18,140,126,0.12)] focus-visible:ring-2 focus-visible:ring-[#128C7E]/35 focus-visible:ring-offset-2 focus-visible:ring-offset-paper sm:rounded-3xl"
            aria-label={t(locale, "page.reserve.altWhatsAppAria")}
          >
            <span className="flex size-16 items-center justify-center rounded-full bg-[#128C7E]/12 ring-1 ring-[#128C7E]/25 transition-colors duration-200 ease-out group-hover:bg-[#128C7E]/20">
              <svg
                className="size-8 text-[#075E54]"
                viewBox="0 0 24 24"
                aria-hidden
              >
                <path
                  fill="currentColor"
                  d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"
                />
              </svg>
            </span>
            <p className="mt-7 max-w-[14rem] font-sans text-sm leading-relaxed text-[#0d4f47]/90">
              {t(locale, "page.reserve.altWhatsAppHint")}
            </p>
            <span className="mt-9 inline-flex min-h-11 min-w-[8.5rem] items-center justify-center rounded-full border border-[#128C7E]/50 bg-[#128C7E] px-8 py-2.5 font-sans text-[11px] font-semibold tracking-[0.24em] text-white uppercase shadow-sm transition-[background-color,border-color] duration-200 ease-out group-hover:border-[#0f7a6e] group-hover:bg-[#0f7a6e]">
              {t(locale, "page.reserve.altWhatsApp")}
            </span>
          </a>
        </div>
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
