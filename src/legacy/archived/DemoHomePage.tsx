"use client";

/**
 * Archived experimental layout kept for documentation/case-study reference.
 *
 * IMPORTANT: This file is intentionally NOT imported anywhere in production so it
 * does not affect bundle size or route surface area.
 */

import { AnimatePresence, motion } from "framer-motion";
import { useRef, useState } from "react";
import { GallerySection } from "@/components/sections/GallerySection";
import { HomeEventsSection } from "@/components/sections/HomeEventsSection";
import { InstagramFeedSection } from "@/components/sections/InstagramFeedSection";
import { MenuSplitSectionVertical } from "@/components/sections/MenuSplitSectionVertical";
import {
  PageHeroSection,
  pageHeroHomeTaglineDesktopClass,
  pageHeroHomeTaglineMobileClass,
} from "@/components/PageHeroSection";
import { MenuCategoryGrid } from "@/components/menu/MenuCategoryGrid";
import { SimpleMenuCategoryGrid } from "@/components/menu/SimpleMenuCategoryGrid";
import { LogoWordmark } from "@/components/LogoWordmark";
import type { MenuSplitKey } from "@/data/menuSplitPanels";
import { dinnerMenuCategories } from "@/data/dinnerMenu";
import { drinksMenuCategories } from "@/data/drinksMenu";
import type { MenuCategoryData } from "@/data/menuTypes";
import { LAUNCH_UI_INSTAGRAM } from "@/config/launchUi";
import { useLocale } from "@/i18n/useLocale";
import { t } from "@/i18n/strings";
import type { HeroMontageClip } from "@/lib/heroVideos";
import { useEditablePublishedMenu } from "@/hooks/useEditablePublishedMenu";
import { editableDocToSimpleCategories } from "@/lib/editableMenuDisplay";

type DemoHomePageProps = {
  heroVideos: HeroMontageClip[];
};

const MENU_SPLIT_KEYS: MenuSplitKey[] = ["dinner", "drinks"];

const previewCategories: Record<MenuSplitKey, MenuCategoryData[]> = {
  drinks: drinksMenuCategories,
  dinner: dinnerMenuCategories,
};

/**
 * Experimental home layout: vertical left rail for menu strips (`/demo` only).
 * Production menus live on `/menu` (`MenusHubPage`).
 */
export function DemoHomePage({ heroVideos }: DemoHomePageProps) {
  const { locale } = useLocale();
  const [expandedMenu, setExpandedMenu] = useState<MenuSplitKey | null>(null);
  const menuPreviewRef = useRef<HTMLDivElement>(null);

  const dinnerState = useEditablePublishedMenu("dinner");
  const drinksState = useEditablePublishedMenu("drinks");

  function stateFor(key: MenuSplitKey) {
    if (key === "dinner") return dinnerState;
    return drinksState;
  }

  function previewHeading(key: MenuSplitKey): string {
    const st = stateFor(key);
    const live = Boolean(st.remote?.isPublished && st.remote.categories?.length);
    if (live && st.remote?.title?.trim()) return st.remote.title.trim();
    if (key === "drinks") return t(locale, "page.menu.drinksHeading");
    return t(locale, "page.menu.dinnerHeading");
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <PageHeroSection
        heroImages={[]}
        heroVideos={heroVideos}
        bottomAside={
          <div className="min-w-0 max-w-full">
            <p className={[pageHeroHomeTaglineMobileClass, "font-medium", "text-sm"].join(" ")}>
              {t(locale, "page.home.heroTaglineMobile")}
            </p>
            <p
              className={[pageHeroHomeTaglineDesktopClass, "font-medium", "text-sm sm:text-base"].join(" ")}
            >
              {t(locale, "page.home.heroTagline")}
            </p>
          </div>
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
                    <div className="min-w-0">
                      <h2 className="font-hero-title text-[clamp(1.75rem,4.5vw,3rem)] font-normal leading-[1.05] tracking-[0.14em] text-paper uppercase">
                        {previewHeading(expandedMenu)}
                      </h2>
                    </div>

                    <motion.div
                      transition={{
                        duration: 0.65,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                      className="mt-10"
                    >
                      {(() => {
                        const st = stateFor(expandedMenu);
                        const live = Boolean(st.remote?.isPublished && st.remote.categories?.length);
                        if (live && st.remote) {
                          return <SimpleMenuCategoryGrid categories={editableDocToSimpleCategories(st.remote)} />;
                        }
                        return <MenuCategoryGrid categories={previewCategories[expandedMenu]} locale={locale} />;
                      })()}
                    </motion.div>
                  </motion.div>
                </AnimatePresence>
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </MenuSplitSectionVertical>

      <GallerySection />

      <HomeEventsSection />
      {LAUNCH_UI_INSTAGRAM ? <InstagramFeedSection /> : null}
    </div>
  );
}

