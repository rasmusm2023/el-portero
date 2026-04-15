"use client";

import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useRef, useState } from "react";
import { GallerySection } from "@/components/sections/GallerySection";
import { InstagramFeedSection } from "@/components/sections/InstagramFeedSection";
import { HoursMapSection } from "@/components/sections/HoursMapSection";
import { LocationMapSection } from "@/components/sections/LocationMapSection";
import { WeeklyMenuSection } from "@/components/sections/WeeklyMenuSection";
import { HeroSlideshow } from "@/components/HeroSlideshow";
import { MenuCategoryGrid } from "@/components/menu/MenuCategoryGrid";
import {
  MenuSplitSection,
  type MenuSplitKey,
} from "@/components/sections/MenuSplitSection";
import { alacarteMenuCategories } from "@/data/alacarteMenu";
import { brunchMenuCategories } from "@/data/brunchMenu";
import { drinksMenuCategories } from "@/data/drinksMenu";
import { foodMenuCategories } from "@/data/foodMenu";
import type { MenuCategoryData } from "@/data/menuTypes";
import { useLocale } from "@/i18n/useLocale";
import { t } from "@/i18n/strings";

type HomePageProps = {
  heroImages?: string[];
};

const MENU_SPLIT_KEYS: MenuSplitKey[] = ["food", "alacarte", "brunch", "drinks"];

const previewCategories: Record<MenuSplitKey, MenuCategoryData[]> = {
  food: foodMenuCategories,
  drinks: drinksMenuCategories,
  brunch: brunchMenuCategories,
  alacarte: alacarteMenuCategories,
};

export function HomePage({ heroImages = [] }: HomePageProps) {
  const { locale } = useLocale();
  const heroSectionRef = useRef<HTMLElement>(null);
  const [expandedMenu, setExpandedMenu] = useState<MenuSplitKey | null>(null);
  const menuPreviewRef = useRef<HTMLElement>(null);

  return (
    <div>
      <section
        ref={heroSectionRef}
        className="relative bg-paper pb-6 pt-4 text-ink sm:pb-8 sm:pt-5"
      >
        <div className="mx-auto w-full max-w-[min(100%,112rem)] px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-2xl bg-ink text-paper shadow-[0_28px_64px_-18px_rgba(10,10,10,0.18)] ring-1 ring-ink/10 sm:rounded-3xl">
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
            <div className="relative z-10 flex w-full min-h-[min(82vh,54rem)] flex-col items-center px-5 pb-14 pt-10 sm:px-10 sm:pb-20 sm:pt-12 md:pt-14 lg:px-14 xl:px-20">
              <div className="flex flex-1 flex-col items-center justify-center px-2 py-10 sm:py-14 md:py-16">
                <div className="w-full max-w-5xl text-center text-paper">
                  <h1 className="font-hero-title text-6xl font-normal leading-[0.92] tracking-tight text-paper sm:text-7xl md:text-8xl lg:text-9xl">
                    South American & Swedish
                  </h1>
                  <p className="mx-auto mt-5 max-w-3xl font-sans text-sm font-medium tracking-[0.22em] text-paper/85 uppercase sm:mt-6 sm:text-base">
                    Fusion restaurant & dinner club in Torrevieja
                  </p>
                </div>
              </div>
              <div className="flex w-full max-w-2xl flex-col items-center justify-center gap-6 pb-2 sm:pt-2">
                <div className="flex w-full flex-wrap items-center justify-center gap-3 sm:gap-4">
                  <Link
                    href="/reserve"
                    className="inline-flex min-w-[min(100%,12rem)] items-center justify-center rounded-none border-2 border-paper/85 bg-paper/12 px-8 py-3.5 text-sm font-bold tracking-[0.22em] text-paper uppercase shadow-md shadow-black/25 ring-1 ring-white/15 transition-[color,background-color,border-color,box-shadow,ring-color] hover:border-white hover:bg-white hover:text-ink hover:shadow-lg hover:shadow-black/20 hover:ring-white/40"
                  >
                    Make Reservation
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="w-full">
        <MenuSplitSection
          activeKey={expandedMenu}
          onSelect={(key) => {
            if (!MENU_SPLIT_KEYS.includes(key)) return;
            setExpandedMenu((prev) => (prev === key ? null : key));
          }}
        />

        <AnimatePresence initial={false}>
          {expandedMenu ? (
            <motion.section
              key="menu-preview"
              ref={menuPreviewRef}
              aria-label="Menu preview"
              className={[
                "w-full border-b border-border px-4 pb-12 pt-0 sm:px-6 sm:pb-16 lg:px-8",
                // A warmer, richer surface than plain paper.
                "bg-[radial-gradient(1200px_600px_at_20%_0%,rgba(114,86,60,0.20)_0%,rgba(250,249,246,0.94)_52%,rgba(250,249,246,0.98)_100%)]",
              ].join(" ")}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              style={{ overflow: "hidden" }}
            >
              <div className="mx-auto w-full max-w-[var(--container-max)]">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={expandedMenu}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                    className={[
                      "border border-border p-6 sm:p-10",
                      // Connect to the cards above (feels “drawn out” from them).
                      "-mt-px",
                      "bg-[linear-gradient(180deg,rgba(10,10,10,0.06)_0%,rgba(250,249,246,0.78)_16%,rgba(250,249,246,0.88)_100%)]",
                      "backdrop-blur-[2px]",
                    ].join(" ")}
                  >
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                      <div className="min-w-0">
                        <h2 className="font-display text-3xl font-medium tracking-tight text-ink sm:text-4xl">
                          {expandedMenu === "food" && t(locale, "page.menu.foodHeading")}
                          {expandedMenu === "drinks" && t(locale, "page.menu.drinksHeading")}
                          {expandedMenu === "brunch" && t(locale, "page.menu.brunchHeading")}
                          {expandedMenu === "alacarte" && t(locale, "page.menu.alacarteHeading")}
                        </h2>
                        <p className="mt-2 max-w-2xl text-ink-muted leading-relaxed">
                          {expandedMenu === "food" && t(locale, "page.menu.foodIntro")}
                          {expandedMenu === "drinks" && t(locale, "page.menu.drinksIntro")}
                          {expandedMenu === "brunch" && t(locale, "page.menu.brunchIntro")}
                          {expandedMenu === "alacarte" && t(locale, "page.menu.alacarteIntro")}
                        </p>
                      </div>
                      <div className="flex shrink-0 items-center gap-3">
                        <button
                          type="button"
                          className="inline-flex items-center justify-center rounded-none border border-border bg-paper px-4 py-2 text-xs font-semibold tracking-[0.22em] text-ink uppercase transition-colors hover:border-ink/45"
                          onClick={() => setExpandedMenu(null)}
                        >
                          {locale === "es"
                            ? "Cerrar"
                            : locale === "sv"
                              ? "Stäng"
                              : "Close"}
                        </button>
                      </div>
                    </div>

                    <motion.div
                      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                      className="mt-10"
                    >
                      <MenuCategoryGrid
                        categories={previewCategories[expandedMenu]}
                        locale={locale}
                      />
                    </motion.div>
                  </motion.div>
                </AnimatePresence>
              </div>
            </motion.section>
          ) : null}
        </AnimatePresence>
      </div>

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
      <WeeklyMenuSection />
      <HoursMapSection />
      <InstagramFeedSection />
      <LocationMapSection />
    </div>
  );
}
