import type { MessageKey } from "@/i18n/strings";

export type MenuSplitKey = "drinks" | "dinner";

export type MenuSplitPanel = {
  key: MenuSplitKey;
  src: string;
  href: string;
  labelKey: MessageKey;
  srKey: MessageKey;
  /** Short line: days + hours (shown between title and “See menu”). */
  scheduleKey: MessageKey;
};

const DRINKS_BG =
  "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=2400&q=80";
const DINNER_BG =
  "https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=2400&q=80";

const SPLIT_LEAN_FRAC = 0.05;

/** Trapezoid clip for N equal columns in `MenuSplitSection` (desktop row). */
export function splitLeanClipPath(index: number, panelCount: number): string {
  const d = 100 * SPLIT_LEAN_FRAC;
  const br = 100 - d;
  if (panelCount <= 1) {
    return "polygon(0 0, 100% 0, 100% 100%, 0 100%)";
  }
  if (panelCount === 2) {
    if (index === 0) return `polygon(0 0, 100% 0, ${br}% 100%, 0 100%)`;
    return `polygon(${d}% 0, 100% 0, 100% 100%, 0 100%)`;
  }
  if (index === 0) return `polygon(0 0, 100% 0, ${br}% 100%, 0 100%)`;
  if (index === panelCount - 1) {
    return `polygon(${d}% 0, 100% 0, 100% 100%, 0 100%)`;
  }
  return `polygon(${d}% 0, 100% 0, ${br}% 100%, 0 100%)`;
}

/** Public menu cards — omit drinks when that menu is not published. */
export function visibleMenuSplitPanels(showDrinks: boolean): MenuSplitPanel[] {
  if (showDrinks) return MENU_SPLIT_PANELS;
  return MENU_SPLIT_PANELS.filter((panel) => panel.key !== "drinks");
}

/** Shared config for horizontal (`MenuSplitSection`) and vertical demo (`MenuSplitSectionVertical`). */
export const MENU_SPLIT_PANELS: MenuSplitPanel[] = [
  {
    key: "dinner",
    src: DINNER_BG,
    href: "/menus/dinner",
    labelKey: "page.menu.dinner",
    srKey: "page.menu.dinnerHeading",
    scheduleKey: "page.menu.scheduleDinner",
  },
  {
    key: "drinks",
    src: DRINKS_BG,
    href: "/menus/drinks",
    labelKey: "page.menu.drinks",
    srKey: "page.menu.drinksHeading",
    scheduleKey: "page.menu.scheduleDrinks",
  },
];
