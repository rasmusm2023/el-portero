"use client";

import {
  BOOKING_PHONE_DISPLAY,
  CONTACT_EMAIL,
  bookingTelHref,
  contactMailtoHref,
} from "@/config/site";
import { useLocale } from "@/i18n/useLocale";
import { t } from "@/i18n/strings";

const linkCardClass =
  "group flex flex-col gap-2 rounded-lg border border-ink/15 bg-paper px-6 py-5 shadow-[0_1px_3px_rgba(10,10,10,0.06)] transition-colors hover:border-ink/25 hover:bg-paper-dark/30 sm:px-8 sm:py-6";

export function ContactPage() {
  const { locale } = useLocale();
  const mailHref = contactMailtoHref();

  return (
    <div className="mx-auto w-full max-w-[var(--container-max)] px-4 pb-20 pt-10 sm:px-6 sm:pb-24 sm:pt-12 lg:px-8 lg:pt-16">
      <header className="text-center">
        <h1 className="font-hero-title text-[clamp(2.25rem,6vw,4.25rem)] font-normal leading-[1.05] tracking-[0.14em] text-ink uppercase">
          {t(locale, "page.contact.heroTitle")}
        </h1>
        <p className="mx-auto mt-10 max-w-2xl font-sans text-base leading-[1.75] text-ink-muted sm:mt-12 sm:text-lg">
          {t(locale, "page.contact.heroBody")}
        </p>
      </header>

      <section
        aria-labelledby="contact-methods-heading"
        className="mx-auto mt-14 max-w-lg sm:mt-16 md:mt-20"
      >
        <h2 id="contact-methods-heading" className="sr-only">
          {t(locale, "page.contact.title")}
        </h2>
        <ul className="flex flex-col gap-4 sm:gap-5">
          <li>
            <a href={bookingTelHref()} className={linkCardClass}>
              <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-ink/50">
                {t(locale, "page.contact.phoneLabel")}
              </span>
              <span className="font-display text-2xl font-medium text-ink group-hover:underline sm:text-3xl">
                {BOOKING_PHONE_DISPLAY}
              </span>
            </a>
          </li>
          <li>
            <a href={mailHref} className={linkCardClass}>
              <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-ink/50">
                {t(locale, "page.contact.emailLabel")}
              </span>
              <span className="break-all font-display text-2xl font-medium text-ink group-hover:underline sm:text-3xl">
                {CONTACT_EMAIL}
              </span>
              <span className="mt-1 font-sans text-sm leading-relaxed text-ink-muted">
                {t(locale, "page.contact.mailtoHint")}
              </span>
            </a>
          </li>
        </ul>
      </section>
    </div>
  );
}
