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

/** Shared config for horizontal (`MenuSplitSection`) and vertical demo (`MenuSplitSectionVertical`). */
export const MENU_SPLIT_PANELS: MenuSplitPanel[] = [
  {
    key: "dinner",
    src: DINNER_BG,
    href: "/menu/dinner",
    labelKey: "page.menu.dinner",
    srKey: "page.menu.dinnerHeading",
    scheduleKey: "page.menu.scheduleDinner",
  },
  {
    key: "drinks",
    src: DRINKS_BG,
    href: "/menu/drinks",
    labelKey: "page.menu.drinks",
    srKey: "page.menu.drinksHeading",
    scheduleKey: "page.menu.scheduleDrinks",
  },
];
