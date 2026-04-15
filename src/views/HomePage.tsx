"use client";

import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useRef, useState } from "react";
import { GallerySection } from "@/components/sections/GallerySection";
import { HomeEventsSection } from "@/components/sections/HomeEventsSection";
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
import { LunchMenuExpandedPreview } from "@/components/menu/LunchMenuExpandedPreview";
import type { MenuCategoryData } from "@/data/menuTypes";
import { useLocale } from "@/i18n/useLocale";
import { t } from "@/i18n/strings";

type HomePageProps = {
  heroImages?: string[];
};

const MENU_SPLIT_KEYS: MenuSplitKey[] = ["lunch", "alacarte", "brunch", "drinks"];

const previewCategories: Record<Exclude<MenuSplitKey, "lunch">, MenuCategoryData[]> = {
  drinks: drinksMenuCategories,
  brunch: brunchMenuCategories,
  alacarte: alacarteMenuCategories,
};

export function HomePage({ heroImages = [] }: HomePageProps) {
  const { locale } = useLocale();
  const heroSectionRef = useRef<HTMLElement>(null);
  const [expandedMenu, setExpandedMenu] = useState<MenuSplitKey | null>(null);
  const menuPreviewRef = useRef<HTMLDivElement>(null);

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
                  <h1 className="font-hero-title text-6xl leading-[0.92] tracking-tight text-paper sm:text-7xl md:text-8xl lg:text-9xl">
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

      <MenuSplitSection
        activeKey={expandedMenu}
        onSelect={(key) => {
          if (!MENU_SPLIT_KEYS.includes(key)) return;
          setExpandedMenu((prev) => (prev === key ? null : key));
        }}
      >
        <AnimatePresence initial={false}>
          {expandedMenu ? (
            <motion.div
              key="menu-preview"
              ref={menuPreviewRef}
              role="region"
              aria-label="Menu preview"
              className="pt-6 pb-2 sm:pt-8"
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
                  >
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                      <div className="min-w-0">
                        <h2 className="font-display text-3xl font-medium tracking-tight text-ink sm:text-4xl">
                          {expandedMenu === "lunch" && t(locale, "page.menu.weeklyHeading")}
                          {expandedMenu === "drinks" && t(locale, "page.menu.drinksHeading")}
                          {expandedMenu === "brunch" && t(locale, "page.menu.brunchHeading")}
                          {expandedMenu === "alacarte" && t(locale, "page.menu.alacarteHeading")}
                        </h2>
                        <p className="mt-2 max-w-2xl text-ink-muted leading-relaxed">
                          {expandedMenu === "lunch" && t(locale, "page.menu.weeklyIntro")}
                          {expandedMenu === "drinks" && t(locale, "page.menu.drinksIntro")}
                          {expandedMenu === "brunch" && t(locale, "page.menu.brunchIntro")}
                          {expandedMenu === "alacarte" && t(locale, "page.menu.alacarteIntro")}
                        </p>
                      </div>
                      <div className="flex shrink-0 items-center gap-3">
                        <button
                          type="button"
                          className="inline-flex items-center justify-center rounded-none px-2 py-2 text-xs font-semibold tracking-[0.22em] text-ink/75 uppercase underline-offset-[0.2em] transition-colors hover:text-ink hover:underline"
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
                      {expandedMenu === "lunch" ? (
                        <LunchMenuExpandedPreview />
                      ) : (
                        <MenuCategoryGrid
                          categories={previewCategories[expandedMenu]}
                          locale={locale}
                        />
                      )}
                    </motion.div>
                  </motion.div>
                </AnimatePresence>
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </MenuSplitSection>

      <HomeEventsSection />

      <GallerySection />
      <WeeklyMenuSection />
      <HoursMapSection />
      <InstagramFeedSection />
      <LocationMapSection />
    </div>
  );
}
