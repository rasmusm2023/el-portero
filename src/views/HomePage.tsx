"use client";

import Link from "next/link";
import { GallerySection } from "@/components/sections/GallerySection";
import { HoursMapSection } from "@/components/sections/HoursMapSection";
import { useLocale } from "@/i18n/useLocale";
import { t } from "@/i18n/strings";

export function HomePage() {
  const { locale } = useLocale();

  const heroCopy =
    locale === "es"
      ? "Una cocina con alma mediterránea y un servicio impecable frente al mar."
      : locale === "sv"
        ? "Medelhavskänsla, precision och värme — i hjärtat av Torrevieja."
        : "Mediterranean soul, precise execution, and warm hospitality — in the heart of Torrevieja.";

  return (
    <div>
      <section className="relative overflow-hidden border-b border-border bg-ink text-paper">
        <div
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage: `radial-gradient(ellipse at 30% 20%, rgba(184,146,74,0.35) 0%, transparent 55%),
              radial-gradient(ellipse at 70% 80%, rgba(184,146,74,0.2) 0%, transparent 50%)`,
          }}
          aria-hidden
        />
        <div className="relative mx-auto flex min-h-[min(78vh,52rem)] max-w-[var(--container-max)] flex-col justify-end gap-8 px-4 pb-20 pt-28 sm:px-6 lg:px-8">
          <p className="max-w-xl font-display text-4xl font-medium leading-[1.15] tracking-tight sm:text-5xl lg:text-6xl">
            El Portero
          </p>
          <p className="max-w-xl text-lg text-paper/85 leading-relaxed sm:text-xl">
            {heroCopy}
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/reserve"
              className="inline-flex items-center justify-center rounded-md bg-gold px-6 py-3 text-sm font-medium tracking-[0.14em] text-ink uppercase transition-colors hover:bg-gold-bright"
            >
              {t(locale, "nav.reserve")}
            </Link>
            <Link
              href="/menu"
              className="inline-flex items-center justify-center rounded-md border border-paper/35 px-6 py-3 text-sm font-medium tracking-[0.14em] text-paper uppercase transition-colors hover:border-gold hover:text-gold"
            >
              {t(locale, "nav.menu")}
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[var(--container-max)] px-4 py-20 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-3">
          <article className="border border-border bg-paper-dark/60 p-8">
            <h2 className="font-display text-2xl font-medium text-ink">
              {locale === "es"
                ? "La mesa"
                : locale === "sv"
                  ? "Bordet"
                  : "The table"}
            </h2>
            <p className="mt-3 text-ink-muted leading-relaxed">
              {locale === "es"
                ? "Menú de temporada, vinos seleccionados y un ambiente cuidado al detalle."
                : locale === "sv"
                  ? "Säsongens rätter, utvalda viner och en detaljerad atmosfär."
                  : "Seasonal plates, a considered wine list, and a room finished in gold and shadow."}
            </p>
            <Link
              href="/menu"
              className="mt-6 inline-block text-sm font-medium tracking-wide text-gold uppercase underline-offset-4 hover:underline"
            >
              {t(locale, "nav.menu")}
            </Link>
          </article>
          <article className="border border-border bg-paper-dark/60 p-8">
            <h2 className="font-display text-2xl font-medium text-ink">
              {locale === "es"
                ? "Eventos"
                : locale === "sv"
                  ? "Evenemang"
                  : "Occasions"}
            </h2>
            <p className="mt-3 text-ink-muted leading-relaxed">
              {locale === "es"
                ? "Cenas privadas y celebraciones — consulte fechas próximas."
                : locale === "sv"
                  ? "Privata middagar och firanden — se kommande datum."
                  : "Private dining and celebrations — see what is coming up."}
            </p>
            <Link
              href="/events"
              className="mt-6 inline-block text-sm font-medium tracking-wide text-gold uppercase underline-offset-4 hover:underline"
            >
              {t(locale, "nav.events")}
            </Link>
          </article>
          <article className="border border-border bg-paper-dark/60 p-8">
            <h2 className="font-display text-2xl font-medium text-ink">
              {locale === "es"
                ? "Visítanos"
                : locale === "sv"
                  ? "Besök oss"
                  : "Visit us"}
            </h2>
            <p className="mt-3 text-ink-muted leading-relaxed">
              C. Ulpiano, 28 — Torrevieja, Alicante.
            </p>
            <Link
              href="/#hours"
              className="mt-6 inline-block text-sm font-medium tracking-wide text-gold uppercase underline-offset-4 hover:underline"
            >
              {t(locale, "nav.hours")}
            </Link>
          </article>
        </div>
      </section>

      <GallerySection />
      <HoursMapSection />
    </div>
  );
}
