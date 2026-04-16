"use client";

import { MenuPager } from "@/components/menu/MenuPager";
import { MenuCategoryGrid } from "@/components/menu/MenuCategoryGrid";
import { PageShell } from "@/components/layout/PageShell";
import { alacarteMenuCategories } from "@/data/alacarteMenu";
import { useLocale } from "@/i18n/useLocale";
import { t } from "@/i18n/strings";

export function AlacarteMenuPage() {
  const { locale } = useLocale();

  return (
    <PageShell title={t(locale, "page.menu.title")} intro={t(locale, "page.menu.alacarteIntro")}>
      <MenuPager />
      <MenuCategoryGrid categories={alacarteMenuCategories} locale={locale} />
    </PageShell>
  );
}
