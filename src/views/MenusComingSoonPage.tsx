"use client";

import { MenusComingSoonIntro } from "@/components/menu/MenusComingSoonIntro";
import { PageHeroSection } from "@/components/PageHeroSection";
import { useLocale } from "@/i18n/useLocale";
import { t } from "@/i18n/strings";

/**
 * Standalone `/menus` hub when {@link MENUS_PUBLIC_LIVE} is false — matches the prior
 * coming-soon treatment (hero block, no menu grids or split panels).
 */
export function MenusComingSoonPage() {
  const { locale } = useLocale();

  return (
    <PageHeroSection heroImages={[]}>
      <div className="mx-auto w-full max-w-3xl pt-[min(34vh,13.5rem)] sm:pt-[min(36vh,15rem)]">
        <h1 className="font-hero-title text-[clamp(2.25rem,6vw,4.25rem)] font-normal leading-[1.05] tracking-[0.14em] text-paper uppercase">
          {t(locale, "page.menu.comingSoonTitle")}
        </h1>
        <MenusComingSoonIntro variant="hero" />
      </div>
    </PageHeroSection>
  );
}
