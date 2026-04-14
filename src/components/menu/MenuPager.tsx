"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLocale } from "@/i18n/useLocale";
import { t } from "@/i18n/strings";

const items = [
  { href: "/menu/food", labelKey: "page.menu.food" as const },
  { href: "/menu/drinks", labelKey: "page.menu.drinks" as const },
  { href: "/menu/weekly", labelKey: "page.menu.weekly" as const },
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
                ? "border-ink bg-ink text-paper"
                : "border-border bg-paper text-ink hover:border-ink/35",
            ].join(" ")}
          >
            {t(locale, item.labelKey)}
          </Link>
        );
      })}
    </nav>
  );
}
