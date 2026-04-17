"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useRef, useState } from "react";
import { GallerySection } from "@/components/sections/GallerySection";
import { HomeEventsSection } from "@/components/sections/HomeEventsSection";
import { InstagramFeedSection } from "@/components/sections/InstagramFeedSection";
import { HoursAndMapSection } from "@/components/sections/HoursAndMapSection";
import { PageHeroSection } from "@/components/PageHeroSection";
import { MenuCategoryGrid } from "@/components/menu/MenuCategoryGrid";
import { LogoWordmark } from "@/components/LogoWordmark";
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

const MENU_SPLIT_KEYS: MenuSplitKey[] = [
  "lunch",
  "alacarte",
  "brunch",
  "drinks",
];

const previewCategories: Record<
  Exclude<MenuSplitKey, "lunch">,
  MenuCategoryData[]
> = {
  drinks: drinksMenuCategories,
  brunch: brunchMenuCategories,
  alacarte: alacarteMenuCategories,
};

export function HomePage({ heroImages = [] }: HomePageProps) {
  const { locale } = useLocale();
  const [expandedMenu, setExpandedMenu] = useState<MenuSplitKey | null>(null);
  const menuPreviewRef = useRef<HTMLDivElement>(null);

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <PageHeroSection
        heroImages={heroImages}
        bottomAside={
          <p className="max-w-[28rem] text-right font-sans text-xs font-medium tracking-[0.22em] text-paper/85 uppercase sm:text-sm">
            South American cuisine fused with Swedish classics — dinner club
            nights in Torrevieja
          </p>
        }
      >
        <div className="mx-auto flex w-full max-w-[46rem] flex-col items-center">
          <LogoWordmark
            size="hero"
            showTagline={false}
            tone="onDark"
            className="mb-5 scale-[1.35] sm:mb-6 sm:scale-[1.5] md:mb-7 md:scale-[1.65]"
          />
        </div>
      </PageHeroSection>

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
                          {expandedMenu === "lunch" &&
                            t(locale, "page.menu.weeklyHeading")}
                          {expandedMenu === "drinks" &&
                            t(locale, "page.menu.drinksHeading")}
                          {expandedMenu === "brunch" &&
                            t(locale, "page.menu.brunchHeading")}
                          {expandedMenu === "alacarte" &&
                            t(locale, "page.menu.alacarteHeading")}
                        </h2>
                        <p className="mt-2 max-w-2xl text-ink-muted leading-relaxed">
                          {expandedMenu === "lunch" &&
                            t(locale, "page.menu.weeklyIntro")}
                          {expandedMenu === "drinks" &&
                            t(locale, "page.menu.drinksIntro")}
                          {expandedMenu === "brunch" &&
                            t(locale, "page.menu.brunchIntro")}
                          {expandedMenu === "alacarte" &&
                            t(locale, "page.menu.alacarteIntro")}
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
      <InstagramFeedSection />
      <HoursAndMapSection />
    </div>
  );
}
