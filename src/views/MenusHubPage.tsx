"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { MenuCategoryGrid } from "@/components/menu/MenuCategoryGrid";
import { SimpleMenuCategoryGrid } from "@/components/menu/SimpleMenuCategoryGrid";
import { AllergenLegend } from "@/components/menu/AllergenLegend";
import { PageShell } from "@/components/layout/PageShell";
import { dinnerMenuCategories } from "@/data/dinnerMenu";
import { drinksMenuCategories } from "@/data/drinksMenu";
import type { MenuCategoryData } from "@/data/menuTypes";
import { useEditablePublishedMenu } from "@/hooks/useEditablePublishedMenu";
import { useMenusPublicVisibility } from "@/hooks/useMenusPublicVisibility";
import { editableDocToSimpleCategories } from "@/lib/editableMenuDisplay";
import { isFirebaseConfigured } from "@/lib/firebase/client";
import {
  isEditableMenuPublished,
  showGuestMenuTab,
} from "@/lib/editableMenuPublished";
import { useLocale } from "@/i18n/useLocale";
import { t, type MessageKey } from "@/i18n/strings";
import { MenusComingSoonPage } from "@/views/MenusComingSoonPage";
import { MENU_TAB_NAV_CLASS } from "@/components/menu/menuPageTypography";

type MenuTab = "dinner" | "drinks";

const TABS: { key: MenuTab; labelKey: MessageKey }[] = [
  { key: "dinner", labelKey: "page.menu.dinner" },
  { key: "drinks", labelKey: "page.menu.drinks" },
];

const previewCategories: Record<MenuTab, MenuCategoryData[]> = {
  dinner: dinnerMenuCategories,
  drinks: drinksMenuCategories,
};

/**
 * `/menus` hub. Tabbed text nav — only tabs for menus that are published (when Firebase
 * is on). No static fallback for an unpublished slot. Firebase off: both tabs + seed data.
 */
export function MenusHubPage() {
  const { locale } = useLocale();
  const [activeKey, setActiveKey] = useState<MenuTab>("dinner");

  const dinnerState = useEditablePublishedMenu("dinner");
  const drinksState = useEditablePublishedMenu("drinks");
  const visibility = useMenusPublicVisibility();
  const showDinner = showGuestMenuTab(dinnerState.ready, dinnerState.remote);
  const showDrinks = showGuestMenuTab(drinksState.ready, drinksState.remote);
  const tabs = useMemo(
    () =>
      TABS.filter(
        (tab) =>
          (tab.key !== "dinner" || showDinner) && (tab.key !== "drinks" || showDrinks),
      ),
    [showDinner, showDrinks],
  );

  useEffect(() => {
    if (tabs.some((tab) => tab.key === activeKey)) return;
    const first = tabs[0]?.key;
    if (first) setActiveKey(first);
  }, [tabs, activeKey]);

  if (visibility.ready && !visibility.showFullMenu) {
    return <MenusComingSoonPage />;
  }

  function stateFor(key: MenuTab) {
    if (key === "dinner") return dinnerState;
    return drinksState;
  }

  const activeState = stateFor(activeKey);
  const activeReady = activeState.ready;
  const showLoading = !visibility.ready || (!activeReady && isFirebaseConfigured());

  return (
    <PageShell showDocumentHeader={false}>
      <nav
        aria-label={t(locale, "page.menu.subnavAria")}
        className="mb-10 flex flex-wrap items-end justify-center gap-x-10 gap-y-3 border-b border-border pb-4 sm:gap-x-14"
      >
        {tabs.map((tab) => {
          const active = tab.key === activeKey;
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveKey(tab.key)}
              aria-pressed={active}
              data-active={active}
              className={MENU_TAB_NAV_CLASS}
            >
              {t(locale, tab.labelKey)}
            </button>
          );
        })}
      </nav>

      {showLoading ? (
        <p className="mb-8 text-sm text-ink-muted">Loading…</p>
      ) : (
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={activeKey}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
          >
            {(() => {
              const live = isEditableMenuPublished(activeState.remote);
              if (live && activeState.remote) {
                return (
                  <SimpleMenuCategoryGrid
                    categories={editableDocToSimpleCategories(activeState.remote)}
                  />
                );
              }
              if (isFirebaseConfigured() && activeReady && !live) {
                return null;
              }
              return (
                <MenuCategoryGrid
                  categories={previewCategories[activeKey]}
                  locale={locale}
                />
              );
            })()}
            {activeKey !== "drinks" ? <AllergenLegend /> : null}
          </motion.div>
        </AnimatePresence>
      )}
    </PageShell>
  );
}
