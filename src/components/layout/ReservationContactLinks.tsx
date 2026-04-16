"use client";

import { Phone } from "lucide-react";
import {
  BOOKING_PHONE_DISPLAY,
  bookingTelHref,
  bookingWhatsAppHref,
} from "@/config/site";
import { t, type Locale } from "@/i18n/strings";

function WhatsAppGlyph({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden>
      <path
        fill="currentColor"
        d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"
      />
    </svg>
  );
}

export type ReservationContactVariant =
  | "headerLight"
  | "headerDark"
  | "navFooter"
  | "hero";

type ReservationContactLinksProps = {
  locale: Locale;
  variant: ReservationContactVariant;
  className?: string;
};

export function ReservationContactLinks({
  locale,
  variant,
  className = "",
}: ReservationContactLinksProps) {
  const tel = bookingTelHref();
  const wa = bookingWhatsAppHref();

  if (variant === "navFooter") {
    return (
      <div className={`flex w-full max-w-md flex-col gap-3 ${className}`}>
        <div className="flex gap-2 sm:gap-3">
          <a
            href={tel}
            className="flex min-h-[3rem] flex-1 items-center justify-center gap-2 rounded-none border-2 border-ink/35 bg-paper px-3 py-2.5 text-xs font-bold tracking-[0.18em] text-ink uppercase shadow-sm ring-1 ring-ink/8 transition-[border-color,background-color] hover:border-ink hover:bg-ink/[0.04] sm:text-sm sm:tracking-[0.2em]"
            aria-label={t(locale, "header.bookingCallAria")}
          >
            <Phone className="size-4 shrink-0 opacity-90" strokeWidth={2} />
            {t(locale, "header.bookingCall")}
          </a>
          <a
            href={wa}
            target="_blank"
            rel="noopener noreferrer"
            className="flex min-h-[3rem] flex-1 items-center justify-center gap-2 rounded-none border-2 border-[#128C7E]/50 bg-paper px-3 py-2.5 text-xs font-bold tracking-[0.18em] text-[#075E54] uppercase shadow-sm ring-1 ring-[#128C7E]/15 transition-[border-color,background-color] hover:border-[#128C7E] hover:bg-[#128C7E]/6 sm:text-sm sm:tracking-[0.2em]"
            aria-label={t(locale, "header.bookingWhatsAppAria")}
          >
            <WhatsAppGlyph className="size-4 shrink-0" />
            {t(locale, "header.bookingWhatsApp")}
          </a>
        </div>
        <p className="text-center font-mono text-sm text-ink/65">{BOOKING_PHONE_DISPLAY}</p>
      </div>
    );
  }

  if (variant === "hero") {
    return (
      <div className={`flex flex-col gap-2 ${className}`}>
        <div className="flex flex-wrap gap-2">
          <a
            href={tel}
            className="inline-flex min-h-[2.75rem] items-center justify-center gap-2 rounded-none border border-paper/55 bg-paper/10 px-4 py-2 text-[10px] font-bold tracking-[0.2em] text-paper uppercase shadow-sm backdrop-blur-[2px] transition-[background-color,border-color] hover:border-paper/80 hover:bg-paper/18 sm:min-h-[3rem] sm:text-xs sm:tracking-[0.22em]"
            aria-label={t(locale, "header.bookingCallAria")}
          >
            <Phone className="size-4 shrink-0" strokeWidth={2} />
            {t(locale, "header.bookingCall")}
          </a>
          <a
            href={wa}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-[2.75rem] items-center justify-center gap-2 rounded-none border border-emerald-400/45 bg-emerald-950/25 px-4 py-2 text-[10px] font-bold tracking-[0.2em] text-emerald-50 uppercase shadow-sm backdrop-blur-[2px] transition-[background-color,border-color] hover:border-emerald-300/60 hover:bg-emerald-900/35 sm:min-h-[3rem] sm:text-xs sm:tracking-[0.22em]"
            aria-label={t(locale, "header.bookingWhatsAppAria")}
          >
            <WhatsAppGlyph className="size-4 shrink-0 text-emerald-100" />
            {t(locale, "header.bookingWhatsApp")}
          </a>
        </div>
        <p className="font-mono text-[11px] text-paper/75 sm:text-xs">{BOOKING_PHONE_DISPLAY}</p>
      </div>
    );
  }

  const isLight = variant === "headerLight";
  const chipClass = isLight
    ? "border-ink/40 bg-ink/[0.04] text-ink shadow-sm ring-1 ring-ink/10 hover:border-ink hover:bg-ink/10"
    : "border-paper/70 bg-paper/10 text-paper shadow-sm ring-1 ring-white/12 hover:border-paper hover:bg-paper/16";

  return (
    <div className={`flex shrink-0 items-center gap-1 sm:gap-1.5 ${className}`}>
      <a
        href={tel}
        className={`inline-flex max-w-full items-center justify-center gap-1 rounded-none border px-1.5 py-1.5 text-[8px] font-bold tracking-[0.12em] uppercase transition-[color,background-color,border-color] sm:gap-1.5 sm:px-2.5 sm:py-2 sm:text-[9px] sm:tracking-[0.14em] ${chipClass}`}
        aria-label={t(locale, "header.bookingCallAria")}
        title={BOOKING_PHONE_DISPLAY}
      >
        <Phone className="size-3.5 shrink-0 sm:size-4" strokeWidth={2} />
        <span className="hidden sm:inline">{t(locale, "header.bookingCall")}</span>
      </a>
      <a
        href={wa}
        target="_blank"
        rel="noopener noreferrer"
        className={`inline-flex max-w-full items-center justify-center gap-1 rounded-none border px-1.5 py-1.5 text-[8px] font-bold tracking-[0.12em] uppercase transition-[color,background-color,border-color] sm:gap-1.5 sm:px-2.5 sm:py-2 sm:text-[9px] sm:tracking-[0.14em] ${chipClass}`}
        aria-label={t(locale, "header.bookingWhatsAppAria")}
      >
        <WhatsAppGlyph className="size-3.5 shrink-0 sm:size-4" />
        <span className="hidden sm:inline">{t(locale, "header.bookingWhatsApp")}</span>
      </a>
    </div>
  );
}
