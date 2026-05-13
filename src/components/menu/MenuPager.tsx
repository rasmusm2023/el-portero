"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLocale } from "@/i18n/useLocale";
import { t } from "@/i18n/strings";
import { MENU_TAB_NAV_CLASS } from "@/components/menu/menuPageTypography";

const items = [
  { href: "/menu/dinner", labelKey: "page.menu.dinner" as const },
  { href: "/menu/drinks", labelKey: "page.menu.drinks" as const },
];

type MenuPagerProps = {
  /** Merged onto the `<nav>` — use for layout when the pager sits beside other controls. */
  className?: string;
};

export function MenuPager({ className }: MenuPagerProps) {
  const pathname = usePathname();
  const { locale } = useLocale();

  return (
    <nav
      aria-label={t(locale, "page.menu.subnavAria")}
      className={[
        "mb-10 flex flex-wrap items-end justify-center gap-x-10 gap-y-3 border-b border-border pb-4 sm:gap-x-14",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {items.map((item) => {
        const active =
          pathname === item.href || pathname.startsWith(`${item.href}/`);
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            data-active={active}
            className={MENU_TAB_NAV_CLASS}
          >
            {t(locale, item.labelKey)}
          </Link>
        );
      })}
    </nav>
  );
}
