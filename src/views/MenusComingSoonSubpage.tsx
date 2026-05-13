"use client";

import { MenusComingSoonIntro } from "@/components/menu/MenusComingSoonIntro";
import { PageShell } from "@/components/layout/PageShell";
import { useLocale } from "@/i18n/useLocale";
import { t } from "@/i18n/strings";

/** Dinner / drinks routes when menus are not public yet. */
export function MenusComingSoonSubpage() {
  const { locale } = useLocale();

  return (
    <PageShell title={t(locale, "page.menu.comingSoonTitle")} titleVariant="hero">
      <MenusComingSoonIntro variant="shell" />
    </PageShell>
  );
}
