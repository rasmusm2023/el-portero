"use client";

import { useLocale } from "@/i18n/useLocale";
import { t } from "@/i18n/strings";

type Props = {
  /** Extra top spacing after hero-sized heading vs PageShell heading. */
  variant?: "hero" | "shell";
};

export function MenusComingSoonIntro({ variant = "hero" }: Props) {
  const { locale } = useLocale();
  const titleGap =
    variant === "hero"
      ? "mt-6 font-sans text-base leading-[1.75] text-paper/85 sm:mt-7 sm:text-lg"
      : "mt-6 text-lg leading-relaxed text-ink-muted";

  return <p className={titleGap}>{t(locale, "page.menu.comingSoonBody")}</p>;
}
