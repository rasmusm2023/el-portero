"use client";

import { MenuPager } from "@/components/menu/MenuPager";
import { MenuCategoryGrid } from "@/components/menu/MenuCategoryGrid";
import { PageShell } from "@/components/layout/PageShell";
import { drinksMenuCategories } from "@/data/drinksMenu";
import { useLocale } from "@/i18n/useLocale";
import { t } from "@/i18n/strings";

export function DrinksMenuPage() {
  const { locale } = useLocale();

  return (
    <PageShell title={t(locale, "page.menu.drinksHeading")} intro={t(locale, "page.menu.drinksIntro")}>
      <MenuPager />
      <MenuCategoryGrid categories={drinksMenuCategories} locale={locale} />
    </PageShell>
  );
}
