"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLocale } from "@/i18n/useLocale";
import { t } from "@/i18n/strings";

const items = [
  { href: "/menu/alacarte", labelKey: "page.menu.alacarte" as const },
  { href: "/menu/brunch", labelKey: "page.menu.brunch" as const },
  { href: "/menu/drinks", labelKey: "page.menu.drinks" as const },
];

export function MenuPager() {
  const pathname = usePathname();
  const { locale } = useLocale();

  return (
    <nav
      aria-label={t(locale, "page.menu.subnavAria")}
      className="mb-10 flex flex-wrap gap-2 border-b border-border pb-4"
    >
      {items.map((item) => {
        const active =
          pathname === item.href || pathname.startsWith(`${item.href}/`);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={[
              "inline-flex items-center justify-center rounded-none border px-4 py-2 text-xs font-semibold tracking-[0.18em] uppercase transition-colors",
              active
                ? "border-gold/45 bg-paper-dark text-paper ring-1 ring-gold/20"
                : "border-border bg-paper-dark/45 text-paper/85 hover:border-paper/25 hover:bg-paper-dark/75 hover:text-paper",
            ].join(" ")}
          >
            {t(locale, item.labelKey)}
          </Link>
        );
      })}
    </nav>
  );
}
