"use client";

import { MenuPager } from "@/components/menu/MenuPager";
import { MenuCategoryGrid } from "@/components/menu/MenuCategoryGrid";
import { PageShell } from "@/components/layout/PageShell";
import { brunchMenuCategories } from "@/data/brunchMenu";
import { useLocale } from "@/i18n/useLocale";
import { t } from "@/i18n/strings";

export function BrunchMenuPage() {
  const { locale } = useLocale();

  return (
    <PageShell title={t(locale, "page.menu.title")} titleVariant="hero">
      <MenuPager />
      <MenuCategoryGrid categories={brunchMenuCategories} locale={locale} />
    </PageShell>
  );
}
