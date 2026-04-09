"use client";

import Link from "next/link";
import { useRef } from "react";
import { LogoWordmark } from "@/components/LogoWordmark";
import { GallerySection } from "@/components/sections/GallerySection";
import { InstagramFeedSection } from "@/components/sections/InstagramFeedSection";
import { HoursMapSection } from "@/components/sections/HoursMapSection";
import { HeroSlideshow } from "@/components/HeroSlideshow";
import { MenuSplitSection } from "@/components/sections/MenuSplitSection";
import { useLocale } from "@/i18n/useLocale";
import { t } from "@/i18n/strings";

type HomePageProps = {
  heroImages?: string[];
};

export function HomePage({ heroImages = [] }: HomePageProps) {
  const { locale } = useLocale();
  const heroSectionRef = useRef<HTMLElement>(null);

  return (
    <div>
      <section
        ref={heroSectionRef}
        className="relative -mt-[var(--header-h)] overflow-hidden border-b border-border bg-ink text-paper"
      >
        <HeroSlideshow images={heroImages} containerRef={heroSectionRef} />
        {heroImages.length > 0 && (
          <div
            className="absolute inset-0 z-[1] bg-ink/50"
            aria-hidden
          />
        )}
        <div
          className="absolute inset-0 z-[2] opacity-40"
          style={{
            backgroundImage: `radial-gradient(ellipse at 30% 20%, rgba(255,255,255,0.06) 0%, transparent 55%),
              radial-gradient(ellipse at 70% 80%, rgba(255,255,255,0.04) 0%, transparent 50%)`,
          }}
          aria-hidden
        />
        <div className="relative z-10 flex w-full min-h-[min(88vh,56rem)] flex-col items-center px-5 pb-16 pt-[calc(var(--header-h)+6rem)] sm:px-10 sm:pb-20 sm:pt-[calc(var(--header-h)+7rem)] lg:px-14 xl:px-20">
          <div className="flex flex-1 flex-col items-center justify-center px-2 py-10 sm:py-14 md:py-16">
            <div className="w-full max-w-5xl text-center text-paper">
              <LogoWordmark size="hero" showTagline />
            </div>
          </div>
          <div className="flex w-full max-w-2xl flex-col items-center justify-center gap-6 pb-2 sm:pt-2">
            <div className="flex w-full flex-wrap items-center justify-center gap-3 sm:gap-4">
              <Link
                href="/reserve"
                className="inline-flex min-w-[min(100%,12rem)] items-center justify-center rounded-none border-2 border-paper/85 bg-paper/12 px-8 py-3.5 text-sm font-bold tracking-[0.22em] text-paper uppercase shadow-md shadow-black/25 ring-1 ring-white/15 transition-[color,background-color,border-color,box-shadow,ring-color] hover:border-white hover:bg-white hover:text-ink hover:shadow-lg hover:shadow-black/20 hover:ring-white/40"
              >
                {t(locale, "nav.reserve")}
              </Link>
              <Link
                href="/menu"
                className="inline-flex min-w-[min(100%,10rem)] items-center justify-center rounded-none border border-paper/40 bg-transparent px-6 py-3 text-sm font-medium tracking-[0.16em] text-paper/90 uppercase transition-colors hover:border-paper/65 hover:text-paper"
              >
                {t(locale, "nav.menu")}
              </Link>
            </div>
          </div>
        </div>
      </section>

      <MenuSplitSection />

      <section className="w-full px-5 py-20 sm:px-10 lg:px-14 xl:px-20">
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
                  : "Seasonal plates, a considered wine list, and a room finished in light and shadow."}
            </p>
            <Link
              href="/menu"
              className="mt-6 inline-block text-sm font-medium tracking-wide text-ink uppercase underline-offset-4 hover:underline"
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
              className="mt-6 inline-block text-sm font-medium tracking-wide text-ink uppercase underline-offset-4 hover:underline"
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
              className="mt-6 inline-block text-sm font-medium tracking-wide text-ink uppercase underline-offset-4 hover:underline"
            >
              {t(locale, "nav.hours")}
            </Link>
          </article>
        </div>
      </section>

      <GallerySection />
      <HoursMapSection />
      <InstagramFeedSection />
    </div>
  );
}
