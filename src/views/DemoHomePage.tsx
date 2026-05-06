"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useRef, useState } from "react";
import { GallerySection } from "@/components/sections/GallerySection";
import { HomeEventsSection } from "@/components/sections/HomeEventsSection";
import { InstagramFeedSection } from "@/components/sections/InstagramFeedSection";
import { MenuSplitSectionVertical } from "@/components/sections/MenuSplitSectionVertical";
import { PageHeroSection } from "@/components/PageHeroSection";
import { MenuCategoryGrid } from "@/components/menu/MenuCategoryGrid";
import { LogoWordmark } from "@/components/LogoWordmark";
import type { MenuSplitKey } from "@/data/menuSplitPanels";
import { alacarteMenuCategories } from "@/data/alacarteMenu";
import { brunchMenuCategories } from "@/data/brunchMenu";
import { drinksMenuCategories } from "@/data/drinksMenu";
import { LunchMenuExpandedPreview } from "@/components/menu/LunchMenuExpandedPreview";
import type { MenuCategoryData } from "@/data/menuTypes";
import { LAUNCH_UI_INSTAGRAM } from "@/config/launchUi";
import { useLocale } from "@/i18n/useLocale";
import { t } from "@/i18n/strings";
import type { HeroMontageClip } from "@/lib/heroVideos";

type DemoHomePageProps = {
  heroVideos: HeroMontageClip[];
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

/**
 * Experimental home layout: vertical left rail for menu strips (`/demo` only).
 * Production menus live on `/menu` (`MenusHubPage`).
 */
export function DemoHomePage({ heroVideos }: DemoHomePageProps) {
  const { locale } = useLocale();
  const [expandedMenu, setExpandedMenu] = useState<MenuSplitKey | null>(null);
  const menuPreviewRef = useRef<HTMLDivElement>(null);

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <PageHeroSection
        heroImages={[]}
        heroVideos={heroVideos}
        bottomAside={
          <p className="max-w-[min(52rem,calc(100%-3rem))] shrink whitespace-pre-line text-right font-sans text-xs font-medium leading-snug tracking-[0.14em] text-paper/85 uppercase sm:max-w-[min(52rem,calc(100%-4rem))] sm:text-sm sm:tracking-[0.18em] lg:tracking-[0.22em] lg:pe-2 xl:pe-3">
            {t(locale, "page.home.heroTagline")}
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

      <MenuSplitSectionVertical
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
              className="pt-2 pb-2 sm:pt-0 lg:pt-1"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
              style={{ overflow: "hidden" }}
            >
              <div className="mx-auto w-full max-w-[var(--container-max)] lg:mx-0">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={expandedMenu}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  >
                    {expandedMenu === "lunch" ? (
                      <LunchMenuExpandedPreview />
                    ) : (
                      <>
                        <div className="min-w-0">
                          <h2 className="font-hero-title text-[clamp(1.75rem,4.5vw,3rem)] font-normal leading-[1.05] tracking-[0.14em] text-paper uppercase">
                            {expandedMenu === "drinks" &&
                              t(locale, "page.menu.drinksHeading")}
                            {expandedMenu === "brunch" &&
                              t(locale, "page.menu.brunchHeading")}
                            {expandedMenu === "alacarte" &&
                              t(locale, "page.menu.alacarteHeading")}
                          </h2>
                        </div>

                        <motion.div
                          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
                          className="mt-10"
                        >
                          <MenuCategoryGrid
                            categories={previewCategories[expandedMenu]}
                            locale={locale}
                          />
                        </motion.div>
                      </>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </MenuSplitSectionVertical>

      <GallerySection />

      <HomeEventsSection />
      {/* Instagram grid: gated by `LAUNCH_UI_INSTAGRAM` in `config/launchUi.ts`. */}
      {LAUNCH_UI_INSTAGRAM ? <InstagramFeedSection /> : null}
    </div>
  );
}
