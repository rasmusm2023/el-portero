"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useRef, useState } from "react";
import { MenuCategoryGrid } from "@/components/menu/MenuCategoryGrid";
import { SimpleMenuCategoryGrid } from "@/components/menu/SimpleMenuCategoryGrid";
import {
  MenuSplitSection,
  type MenuSplitKey,
} from "@/components/sections/MenuSplitSection";
import { alacarteMenuCategories } from "@/data/alacarteMenu";
import { brunchMenuCategories } from "@/data/brunchMenu";
import { drinksMenuCategories } from "@/data/drinksMenu";
import type { MenuCategoryData } from "@/data/menuTypes";
import { MENUS_PUBLIC_LIVE } from "@/config/menusPublic";
import { useEditablePublishedMenu } from "@/hooks/useEditablePublishedMenu";
import { editableDocToSimpleCategories } from "@/lib/editableMenuDisplay";
import { useLocale } from "@/i18n/useLocale";
import { t } from "@/i18n/strings";
import { MenusComingSoonPage } from "@/views/MenusComingSoonPage";

const MENU_SPLIT_KEYS: MenuSplitKey[] = ["alacarte", "brunch", "drinks"];

const previewCategories: Record<MenuSplitKey, MenuCategoryData[]> = {
  drinks: drinksMenuCategories,
  brunch: brunchMenuCategories,
  alacarte: alacarteMenuCategories,
};

/**
 * Full-width menu cards + inline previews — first content below the site header at `/menu`.
 */
export function MenusHubPage() {
  const { locale } = useLocale();
  const [expandedMenu, setExpandedMenu] = useState<MenuSplitKey | null>(null);
  const menuPreviewRef = useRef<HTMLDivElement>(null);

  const alacarteState = useEditablePublishedMenu("alacarte");
  const brunchState = useEditablePublishedMenu("brunch");
  const drinksState = useEditablePublishedMenu("drinks");

  if (!MENUS_PUBLIC_LIVE) {
    return <MenusComingSoonPage />;
  }

  function stateFor(key: MenuSplitKey) {
    if (key === "alacarte") return alacarteState;
    if (key === "brunch") return brunchState;
    return drinksState;
  }

  function previewHeading(key: MenuSplitKey): string {
    const st = stateFor(key);
    const live = Boolean(st.remote?.isPublished && st.remote.categories?.length);
    if (live && st.remote?.title?.trim()) return st.remote.title.trim();
    if (key === "drinks") return t(locale, "page.menu.drinksHeading");
    if (key === "brunch") return t(locale, "page.menu.brunchHeading");
    return t(locale, "page.menu.alacarteHeading");
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <MenuSplitSection
        activeKey={expandedMenu}
        onSelect={(key) => {
          if (!MENU_SPLIT_KEYS.includes(key)) return;
          setExpandedMenu((prev) => (prev === key ? null : key));
        }}
      >
        {!expandedMenu ? (
          <div className="mx-auto w-full max-w-[var(--container-max)] pb-2 pt-6 sm:pt-8">
            <p className="max-w-2xl text-lg text-ink-muted leading-relaxed">
              {t(locale, "page.menu.hubHint")}
            </p>
          </div>
        ) : null}
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
                    <div className="min-w-0">
                      <h2 className="font-hero-title text-[clamp(1.75rem,4.5vw,3rem)] font-normal leading-[1.05] tracking-[0.14em] text-paper uppercase">
                        {previewHeading(expandedMenu)}
                      </h2>
                    </div>

                    <motion.div
                      transition={{
                        duration: 0.55,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                      className="mt-10"
                    >
                      {(() => {
                        const st = stateFor(expandedMenu);
                        const live = Boolean(st.remote?.isPublished && st.remote.categories?.length);
                        if (live && st.remote) {
                          return (
                            <SimpleMenuCategoryGrid
                              categories={editableDocToSimpleCategories(st.remote)}
                            />
                          );
                        }
                        return (
                          <MenuCategoryGrid
                            categories={previewCategories[expandedMenu]}
                            locale={locale}
                          />
                        );
                      })()}
                    </motion.div>
                  </motion.div>
                </AnimatePresence>
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </MenuSplitSection>
    </div>
  );
}
