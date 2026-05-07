"use client";

import { HeroOpeningCountdown } from "@/components/HeroOpeningCountdown";
import { getMenusRevealTargetMs } from "@/config/menusLaunch";
import { bookTableHeroHollowButtonClass } from "@/components/layout/SiteHeader";
import { BookTableWidgetButton } from "@/components/BookTableWidgetButton";
import { useLocale } from "@/i18n/useLocale";
import { t } from "@/i18n/strings";

export function MenusPreLaunchPanel() {
  const { locale } = useLocale();
  return (
    <div className="relative flex min-h-[min(88vh,52rem)] flex-1 flex-col items-center justify-center overflow-hidden bg-ink px-5 py-16 sm:py-20">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_85%_65%_at_50%_-15%,rgba(201,164,74,0.07),transparent_52%),radial-gradient(ellipse_55%_45%_at_110%_95%,rgba(201,164,74,0.06),transparent_55%),radial-gradient(ellipse_50%_40%_at_-10%_80%,rgba(255,255,255,0.04),transparent_50%)]"
        aria-hidden
      />

      <div className="relative z-10 flex w-full max-w-xl flex-col items-center text-center">
        <p className="mx-auto mb-8 max-w-[22rem] text-center font-sans text-[11px] font-semibold leading-snug tracking-[0.28em] text-paper/80 uppercase sm:mb-10 sm:max-w-none sm:text-xs sm:tracking-[0.22em]">
          MENUS AVAILABLE IN
        </p>
        <HeroOpeningCountdown
          targetDate={new Date(getMenusRevealTargetMs())}
          variant="inline"
        />

        <h1 className="mt-12 font-display text-3xl font-medium tracking-tight text-paper sm:mt-14 sm:text-4xl">
          {t(locale, "page.menu.preLaunchTitle")}
        </h1>
        <p className="mt-6 max-w-lg text-lg text-ink-muted leading-relaxed">
          {t(locale, "page.menu.preLaunchBody")}
        </p>
        <BookTableWidgetButton
          type="button"
          className={`mt-10 ${bookTableHeroHollowButtonClass}`}
        >
          {t(locale, "nav.reserve")}
        </BookTableWidgetButton>
      </div>
    </div>
  );
}
