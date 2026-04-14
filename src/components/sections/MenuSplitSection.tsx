"use client";

import Image from "next/image";
import Link from "next/link";
import { useLocale } from "@/i18n/useLocale";
import { t } from "@/i18n/strings";

export type MenuSplitKey = "food" | "drinks";

type MenuSplitSectionProps = {
  onSelect?: (key: MenuSplitKey) => void;
};

/** Matches `overlayLinkClass` inactive state in SiteHeader (full-screen nav). */
const menuSplitTitleClass =
  "font-sans text-5xl font-bold tracking-tight text-paper/90 transition-colors duration-300 sm:text-6xl md:text-7xl group-hover:text-paper";

const menuSplitSeeMenuClass =
  "font-sans text-xs font-semibold uppercase tracking-[0.28em] text-paper/85 transition-all duration-300 ease-out " +
  "opacity-100 translate-y-0";

/** Fine dining / plated — Unsplash (decorative). */
const FOOD_BG =
  "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=2400&q=80";

/** Wine & bar — Unsplash (decorative). */
const DRINKS_BG =
  "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=2400&q=80";

const panelBaseClass =
  "group relative flex items-center justify-center overflow-hidden px-4 py-16 transition-[color] duration-300 sm:px-8 " +
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/60";

const panelHeightClass =
  "min-h-[min(30vh,15rem)] sm:min-h-[min(36vh,21rem)] lg:min-h-[min(40vh,24rem)] xl:min-h-[min(42vh,26rem)]";

// Mobile panels have horizontal padding (`px-4`), so the image is slightly narrower than viewport.
const mobilePanelSizes = "calc(100vw - 2rem)";

export function MenuSplitSection({ onSelect }: MenuSplitSectionProps) {
  const { locale } = useLocale();
  const seeMenu = t(locale, "page.menu.seeMenu");
  const interactive = Boolean(onSelect);

  return (
    <section
      aria-label={
        locale === "es"
          ? "Elegir carta de comida o bebidas"
          : locale === "sv"
            ? "Välj mat- eller dryckesmeny"
            : "Choose food or drinks menu"
      }
      className="border-b border-border bg-ink"
    >
      {/* Mobile: stacked. Desktop: horizontal panels with a diagonal seam. */}
      <div className="w-full">
        <div className="grid w-full grid-cols-1 sm:hidden">
          {interactive ? (
            <button
              type="button"
              className={`${panelBaseClass} ${panelHeightClass} w-full`}
              onClick={() => onSelect?.("food")}
            >
              <Image
                src={FOOD_BG}
                alt=""
                fill
                sizes={mobilePanelSizes}
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                priority
              />
              <div
                className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/55 to-ink/35 transition-colors duration-300 group-hover:from-ink/92 group-hover:via-ink/60"
                aria-hidden
              />
              <span className="relative z-10 flex flex-col items-center gap-3 text-center">
                <span className={menuSplitTitleClass}>{t(locale, "page.menu.food")}</span>
                <span className={menuSplitSeeMenuClass}>{seeMenu}</span>
                <span className="sr-only"> — {t(locale, "page.menu.foodHeading")}</span>
              </span>
            </button>
          ) : (
            <Link href="/menu/food" className={`${panelBaseClass} ${panelHeightClass}`}>
            <Image
              src={FOOD_BG}
              alt=""
              fill
              sizes={mobilePanelSizes}
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              priority
            />
            <div
              className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/55 to-ink/35 transition-colors duration-300 group-hover:from-ink/92 group-hover:via-ink/60"
              aria-hidden
            />
            <span className="relative z-10 flex flex-col items-center gap-3 text-center">
              <span className={menuSplitTitleClass}>{t(locale, "page.menu.food")}</span>
              <span className={menuSplitSeeMenuClass}>{seeMenu}</span>
              <span className="sr-only"> — {t(locale, "page.menu.foodHeading")}</span>
            </span>
            </Link>
          )}

          {interactive ? (
            <button
              type="button"
              className={`${panelBaseClass} ${panelHeightClass} w-full`}
              onClick={() => onSelect?.("drinks")}
            >
              <Image
                src={DRINKS_BG}
                alt=""
                fill
                sizes={mobilePanelSizes}
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
              <div
                className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/55 to-ink/35 transition-colors duration-300 group-hover:from-ink/92 group-hover:via-ink/60"
                aria-hidden
              />
              <span className="relative z-10 flex flex-col items-center gap-3 text-center">
                <span className={menuSplitTitleClass}>{t(locale, "page.menu.drinks")}</span>
                <span className={menuSplitSeeMenuClass}>{seeMenu}</span>
                <span className="sr-only"> — {t(locale, "page.menu.drinksHeading")}</span>
              </span>
            </button>
          ) : (
            <Link href="/menu/drinks" className={`${panelBaseClass} ${panelHeightClass}`}>
            <Image
              src={DRINKS_BG}
              alt=""
              fill
              sizes={mobilePanelSizes}
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />
            <div
              className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/55 to-ink/35 transition-colors duration-300 group-hover:from-ink/92 group-hover:via-ink/60"
              aria-hidden
            />
            <span className="relative z-10 flex flex-col items-center gap-3 text-center">
              <span className={menuSplitTitleClass}>{t(locale, "page.menu.drinks")}</span>
              <span className={menuSplitSeeMenuClass}>{seeMenu}</span>
              <span className="sr-only"> — {t(locale, "page.menu.drinksHeading")}</span>
            </span>
            </Link>
          )}
        </div>

        <div className="relative hidden w-full overflow-hidden bg-ink sm:block">
          <div className="relative flex w-full">
            {interactive ? (
              <button
                type="button"
                className={[
                  panelBaseClass,
                  `z-10 w-[56%] ${panelHeightClass}`,
                  "[clip-path:polygon(0_0,100%_0,82%_100%,0_100%)]",
                ].join(" ")}
                onClick={() => onSelect?.("food")}
              >
                <Image
                  src={FOOD_BG}
                  alt=""
                  fill
                  sizes="60vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  priority
                />
                <div
                  className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/55 to-ink/35 transition-colors duration-300 group-hover:from-ink/92 group-hover:via-ink/60"
                  aria-hidden
                />
                <span className="relative z-10 flex w-full max-w-[26rem] flex-col items-center gap-3 text-center [transform:translateX(-8%)]">
                  <span className={menuSplitTitleClass}>{t(locale, "page.menu.food")}</span>
                  <span className={menuSplitSeeMenuClass}>{seeMenu}</span>
                  <span className="sr-only"> — {t(locale, "page.menu.foodHeading")}</span>
                </span>
              </button>
            ) : (
              <Link
                href="/menu/food"
                className={[
                  panelBaseClass,
                  `z-10 w-[56%] ${panelHeightClass}`,
                  "[clip-path:polygon(0_0,100%_0,82%_100%,0_100%)]",
                ].join(" ")}
              >
              <Image
                src={FOOD_BG}
                alt=""
                fill
                sizes="60vw"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                priority
              />
              <div
                className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/55 to-ink/35 transition-colors duration-300 group-hover:from-ink/92 group-hover:via-ink/60"
                aria-hidden
              />
              <span className="relative z-10 flex w-full max-w-[26rem] flex-col items-center gap-3 text-center [transform:translateX(-8%)]">
                <span className={menuSplitTitleClass}>{t(locale, "page.menu.food")}</span>
                <span className={menuSplitSeeMenuClass}>{seeMenu}</span>
                <span className="sr-only"> — {t(locale, "page.menu.foodHeading")}</span>
              </span>
              </Link>
            )}

            {interactive ? (
              <button
                type="button"
                className={[
                  panelBaseClass,
                  `z-20 w-[56%] -ml-[12%] ${panelHeightClass}`,
                  "[clip-path:polygon(18%_0,100%_0,100%_100%,0_100%)]",
                ].join(" ")}
                onClick={() => onSelect?.("drinks")}
              >
                <Image
                  src={DRINKS_BG}
                  alt=""
                  fill
                  sizes="60vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
                <div
                  className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/55 to-ink/35 transition-colors duration-300 group-hover:from-ink/92 group-hover:via-ink/60"
                  aria-hidden
                />
                <span className="relative z-10 flex w-full max-w-[26rem] flex-col items-center gap-3 text-center [transform:translateX(8%)]">
                  <span className={menuSplitTitleClass}>{t(locale, "page.menu.drinks")}</span>
                  <span className={menuSplitSeeMenuClass}>{seeMenu}</span>
                  <span className="sr-only"> — {t(locale, "page.menu.drinksHeading")}</span>
                </span>
              </button>
            ) : (
              <Link
                href="/menu/drinks"
                className={[
                  panelBaseClass,
                  `z-20 w-[56%] -ml-[12%] ${panelHeightClass}`,
                  "[clip-path:polygon(18%_0,100%_0,100%_100%,0_100%)]",
                ].join(" ")}
              >
              <Image
                src={DRINKS_BG}
                alt=""
                fill
                sizes="60vw"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
              <div
                className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/55 to-ink/35 transition-colors duration-300 group-hover:from-ink/92 group-hover:via-ink/60"
                aria-hidden
              />
              <span className="relative z-10 flex w-full max-w-[26rem] flex-col items-center gap-3 text-center [transform:translateX(8%)]">
                <span className={menuSplitTitleClass}>{t(locale, "page.menu.drinks")}</span>
                <span className={menuSplitSeeMenuClass}>{seeMenu}</span>
                <span className="sr-only"> — {t(locale, "page.menu.drinksHeading")}</span>
              </span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
