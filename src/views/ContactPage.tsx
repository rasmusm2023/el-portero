"use client";

import { Mail } from "lucide-react";
import {
  CONTACT_EMAIL,
  contactMailtoHref,
} from "@/config/site";
import { useLocale } from "@/i18n/useLocale";
import { t } from "@/i18n/strings";

const linkCardClass =
  "group flex flex-col gap-2 rounded-lg border border-paper/12 bg-paper-dark/45 px-6 py-5 shadow-[0_8px_28px_-12px_rgba(0,0,0,0.45)] transition-colors hover:border-gold/35 hover:bg-paper-dark/65 sm:px-8 sm:py-6";

export function ContactPage() {
  const { locale } = useLocale();
  const mailHref = contactMailtoHref();

  return (
    <div className="mx-auto w-full max-w-[var(--container-max)] px-4 pb-20 pt-10 sm:px-6 sm:pb-24 sm:pt-12 lg:px-8 lg:pt-16">
      <header className="text-center">
        <h1 className="font-hero-title text-[clamp(2.25rem,6vw,4.25rem)] font-normal leading-[1.05] tracking-[0.14em] text-paper uppercase">
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
            <a href={mailHref} className={linkCardClass}>
              <div className="flex items-center gap-4 sm:gap-5">
                <Mail
                  className="size-9 shrink-0 text-paper/45 sm:size-11"
                  strokeWidth={1.35}
                  aria-hidden
                />
                <div className="min-w-0 flex flex-1 flex-col gap-2">
                  <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-paper/45">
                    {t(locale, "page.contact.emailLabel")}
                  </span>
                  <span className="break-all font-display text-2xl font-medium text-paper group-hover:underline sm:text-3xl">
                    {CONTACT_EMAIL}
                  </span>
                </div>
              </div>
            </a>
          </li>
        </ul>
      </section>
    </div>
  );
}
