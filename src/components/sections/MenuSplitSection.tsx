"use client";

import Image from "next/image";
import Link from "next/link";
import { useLocale } from "@/i18n/useLocale";
import { t } from "@/i18n/strings";

/** Matches `overlayLinkClass` inactive state in SiteHeader (full-screen nav). */
const menuSplitTitleClass =
  "font-sans text-5xl font-bold tracking-tight text-paper/90 transition-colors duration-300 sm:text-6xl md:text-7xl group-hover:text-paper";

const menuSplitSeeMenuClass =
  "font-sans text-xs font-semibold uppercase tracking-[0.28em] text-paper/85 transition-all duration-300 ease-out " +
  "opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 " +
  "group-focus-visible:opacity-100 group-focus-visible:translate-y-0";

/** Fine dining / plated — Unsplash (decorative). */
const FOOD_BG =
  "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=2400&q=80";

/** Wine & bar — Unsplash (decorative). */
const DRINKS_BG =
  "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=2400&q=80";

const panelClass =
  "group relative flex min-h-[min(58vh,26rem)] flex-1 items-center justify-center overflow-hidden border-border px-4 py-16 transition-[color] duration-300 sm:min-h-[min(72vh,40rem)] sm:px-8 lg:min-h-[min(80vh,46rem)] xl:min-h-[min(85vh,52rem)] " +
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/60";

export function MenuSplitSection() {
  const { locale } = useLocale();
  const seeMenu = t(locale, "page.menu.seeMenu");

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
      <div className="grid w-full grid-cols-1 sm:grid-cols-2">
        <Link
          href="/menu/food"
          className={`${panelClass} border-b border-border sm:border-b-0 sm:border-r`}
        >
          <Image
            src={FOOD_BG}
            alt=""
            fill
            sizes="(max-width: 640px) 100vw, 50vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            priority
          />
          <div
            className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/55 to-ink/35 transition-colors duration-300 group-hover:from-ink/92 group-hover:via-ink/60"
            aria-hidden
          />
          <span className="relative z-10 flex flex-col items-center gap-3 text-center">
            <span className={menuSplitTitleClass}>
              {t(locale, "page.menu.food")}
            </span>
            <span className={menuSplitSeeMenuClass}>{seeMenu}</span>
            <span className="sr-only">
              {" "}
              — {t(locale, "page.menu.foodHeading")}
            </span>
          </span>
        </Link>
        <Link href="/menu/drinks" className={panelClass}>
          <Image
            src={DRINKS_BG}
            alt=""
            fill
            sizes="(max-width: 640px) 100vw, 50vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
          <div
            className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/55 to-ink/35 transition-colors duration-300 group-hover:from-ink/92 group-hover:via-ink/60"
            aria-hidden
          />
          <span className="relative z-10 flex flex-col items-center gap-3 text-center">
            <span className={menuSplitTitleClass}>
              {t(locale, "page.menu.drinks")}
            </span>
            <span className={menuSplitSeeMenuClass}>{seeMenu}</span>
            <span className="sr-only">
              {" "}
              — {t(locale, "page.menu.drinksHeading")}
            </span>
          </span>
        </Link>
      </div>
    </section>
  );
}
