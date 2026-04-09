"use client";

import { MenuCategoryGrid } from "@/components/menu/MenuCategoryGrid";
import { PageShell } from "@/components/layout/PageShell";
import { foodMenuCategories } from "@/data/foodMenu";
import { useLocale } from "@/i18n/useLocale";
import { t } from "@/i18n/strings";

export function FoodMenuPage() {
  const { locale } = useLocale();

  return (
    <PageShell title={t(locale, "page.menu.foodHeading")} intro={t(locale, "page.menu.foodIntro")}>
      <MenuCategoryGrid categories={foodMenuCategories} locale={locale} />
    </PageShell>
  );
}
