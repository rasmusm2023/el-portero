"use client";

import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { MENU_SPLIT_PANELS, type MenuSplitKey } from "@/data/menuSplitPanels";
import { useLocale } from "@/i18n/useLocale";
import { t, type MessageKey } from "@/i18n/strings";

export type { MenuSplitKey } from "@/data/menuSplitPanels";

type MenuSplitSectionProps = {
  onSelect?: (key: MenuSplitKey) => void;
  /** When set (e.g. expanded menu on home), that panel’s image renders in black & white. */
  activeKey?: MenuSplitKey | null;
  /** Renders below the menu cards, inside the same section (e.g. expanded menu preview on home). */
  children?: ReactNode;
};

/** Matches hero + header horizontal inset. */
const contentGutterClass =
  "mx-auto w-full max-w-[min(100%,112rem)] px-4 sm:px-6 lg:px-8";

/** Matches hero image card radius; paper base so split seams match section (`bg-paper`). */
const insetCardShellClass =
  "relative overflow-visible rounded-2xl bg-paper shadow-[0_28px_64px_-18px_rgba(10,10,10,0.12)] sm:rounded-3xl";

/** Same display face + uppercase tracking as `page.reserve.heroTitle` (Reserve hero). */
const menuSplitTitleClass =
  "font-hero-title font-normal uppercase leading-[1.05] tracking-[0.14em] text-paper/90 " +
  "text-[clamp(1.5rem,4vw,3.25rem)] transition-colors duration-300 group-hover/panel:text-paper";

const menuSplitSeeMenuClass =
  "font-sans text-xs font-semibold uppercase tracking-[0.28em] text-paper/85 transition-all duration-300 ease-out " +
  "opacity-100 translate-y-0 underline underline-offset-[0.35em] decoration-paper/35 " +
  "group-hover/panel:decoration-paper/75 group-hover/panel:translate-x-0.5";

const panelBaseClass =
  "group/panel relative flex min-h-0 flex-col items-center justify-center overflow-hidden px-3 py-12 transition-[color,transform] duration-300 sm:px-5 sm:py-14 md:py-16 " +
  "cursor-pointer select-none " +
  "hover:brightness-[1.06] active:brightness-[1.02] " +
  "ring-2 ring-paper/0 hover:ring-paper/25 " +
  "transform-gpu will-change-transform " +
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-paper/60 " +
  "isolate";

const panelMinHeightClass =
  "min-h-[min(28vh,13rem)] sm:min-h-[min(30vh,15rem)] md:min-h-[min(34vh,17rem)] lg:min-h-[min(32vh,16rem)]";

/** Desktop: one row of four equal columns. */
const desktopFourColHeightClass =
  "min-h-[min(28vh,14rem)] sm:min-h-[min(34vh,17rem)] lg:min-h-[min(38vh,20rem)] xl:min-h-[min(40vh,21rem)]";

/** Horizontal run of each seam vs panel width — keep small so splits read as a hint, not a wide band. */
const SPLIT_LEAN_FRAC = 0.05;

function clipPathStyle(
  clipPath: string,
  zIndex: number,
): { clipPath: string; WebkitClipPath: string; zIndex: number } {
  return { clipPath, WebkitClipPath: clipPath, zIndex };
}

/** Trapezoid clips for equal-width quarters: first/last only cut one side; middles cut both. */
function splitLeanPolygon(quarterIndex: number): string {
  const d = 100 * SPLIT_LEAN_FRAC;
  const br = 100 - d;
  if (quarterIndex === 0) {
    return `polygon(0 0, 100% 0, ${br}% 100%, 0 100%)`;
  }
  if (quarterIndex === 3) {
    return `polygon(${d}% 0, 100% 0, 100% 100%, 0 100%)`;
  }
  return `polygon(${d}% 0, 100% 0, ${br}% 100%, 0 100%)`;
}

/**
 * Transform scales on an outer wrapper; filter (grayscale) on an inner wrapper so easing stays smooth
 * (mixing both on one layer often looks stepped in WebKit).
 */
function MenuPanelPhoto({
  src,
  sizes,
  priority,
  dimmed,
}: {
  src: string;
  sizes: string;
  priority?: boolean;
  dimmed: boolean;
}) {
  return (
    <div className="pointer-events-none absolute inset-0 z-0" aria-hidden>
      <div
        className={[
          "h-full w-full origin-center scale-100 transform-gpu will-change-transform",
          "backface-hidden",
          "transition-transform duration-[1250ms] ease-[cubic-bezier(0.25,0.46,0.45,0.99)]",
          "motion-reduce:transition-none motion-reduce:duration-0",
          "group-hover/panel:scale-[1.045]",
          "motion-reduce:group-hover/panel:scale-100",
        ].join(" ")}
      >
        <div
          className={[
            "relative h-full w-full",
            "transition-[filter] duration-700 ease-out motion-reduce:transition-none",
            dimmed ? "grayscale" : "",
          ]
            .filter(Boolean)
            .join(" ")}
        >
          <Image
            src={src}
            alt=""
            fill
            sizes={sizes}
            className="object-cover"
            priority={priority}
            draggable={false}
          />
        </div>
      </div>
    </div>
  );
}

function PanelContent({
  labelKey,
  srKey,
  seeMenu,
  titleAlignClass = "",
  selected,
}: {
  labelKey: MessageKey;
  srKey: MessageKey;
  seeMenu: string;
  /** e.g. diagonal seam title nudge */
  titleAlignClass?: string;
  selected: boolean;
}) {
  const { locale } = useLocale();
  return (
    <>
      <div
        className="absolute inset-0 z-[1] bg-gradient-to-t from-ink/90 via-ink/55 to-ink/35 transition-colors duration-500 ease-out group-hover/panel:from-ink/92 group-hover/panel:via-ink/60"
        aria-hidden
      />
      <span
        className={[
          "relative z-[2] flex h-full w-full flex-col items-center px-2 text-center transform-gpu will-change-transform",
          "gap-2 sm:gap-3",
          "transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none",
          "justify-end pb-7 sm:pb-9",
          selected ? "translate-y-0" : "-translate-y-10 sm:-translate-y-12",
        ].join(" ")}
      >
        <span
          className={
            titleAlignClass ? `${menuSplitTitleClass} ${titleAlignClass}` : menuSplitTitleClass
          }
        >
          {t(locale, labelKey)}
        </span>
        <span className={menuSplitSeeMenuClass}>{seeMenu}</span>
        <span className="sr-only">
          {" "}
          — {t(locale, srKey)}
        </span>
      </span>
    </>
  );
}

export function MenuSplitSection({ onSelect, activeKey = null, children }: MenuSplitSectionProps) {
  const { locale } = useLocale();
  const seeMenu = t(locale, "page.menu.seeMenu");
  const interactive = Boolean(onSelect);

  return (
    <section
      id="menus"
      aria-label={
        locale === "es"
          ? "Elegir tipo de carta"
          : locale === "sv"
            ? "Välj meny"
            : "Choose a menu"
      }
      className="scroll-mt-[calc(var(--header-h)+0.5rem)] bg-paper"
    >
      <div className={`${contentGutterClass} py-6 sm:py-8`}>
        <div className={insetCardShellClass}>
          <div className="overflow-hidden rounded-2xl bg-paper sm:rounded-3xl">
            <div className="flex flex-col gap-0 bg-paper">
              <div className="flex flex-col gap-0 sm:hidden">
              {MENU_SPLIT_PANELS.map((panel, index) => {
                const isSelected = activeKey === panel.key;
                const hasSelection = activeKey != null;
                const dimmed = hasSelection && !isSelected;
                const sizes =
                  "(max-width: 639px) min(100vw - 2rem, 112rem), (max-width: 1279px) 50vw, 25vw";

                const inner = (
                  <>
                    <MenuPanelPhoto
                      src={panel.src}
                      sizes={sizes}
                      priority={index === 0}
                      dimmed={dimmed}
                    />
                    <PanelContent
                      labelKey={panel.labelKey}
                      srKey={panel.srKey}
                      seeMenu={seeMenu}
                      selected={isSelected}
                    />
                  </>
                );

                const selectedClass = hasSelection && isSelected ? "z-[2] ring-paper/40" : "";
                const unselectedClass = hasSelection && !isSelected ? "z-[1] opacity-95" : "";

                return interactive ? (
                  <button
                    key={panel.key}
                    type="button"
                    className={`${panelBaseClass} ${panelMinHeightClass} w-full bg-ink ${selectedClass} ${unselectedClass}`}
                    onClick={() => onSelect?.(panel.key)}
                  >
                    {inner}
                  </button>
                ) : (
                  <Link
                    key={panel.key}
                    href={panel.href}
                    className={`${panelBaseClass} ${panelMinHeightClass} bg-ink`}
                  >
                    {inner}
                  </Link>
                );
              })}
            </div>
              <div className="hidden w-full grid-cols-4 gap-0 bg-paper sm:grid">
                {MENU_SPLIT_PANELS.map((panel, index) => {
                const isSelected = activeKey === panel.key;
                const hasSelection = activeKey != null;
                const dimmed = hasSelection && !isSelected;
                const sizes =
                  "(max-width: 639px) min(100vw - 2rem, 112rem), (max-width: 1023px) 25vw, 25vw";

                const titleNudge =
                  index === 0
                    ? "[transform:translateX(-1.5%)]"
                    : index === 3
                      ? "[transform:translateX(1.5%)]"
                      : "";

                const inner = (
                  <>
                    <MenuPanelPhoto
                      src={panel.src}
                      sizes={sizes}
                      priority={index === 0}
                      dimmed={dimmed}
                    />
                    <PanelContent
                      labelKey={panel.labelKey}
                      srKey={panel.srKey}
                      seeMenu={seeMenu}
                      titleAlignClass={titleNudge}
                      selected={isSelected}
                    />
                  </>
                );

                const selectedClass = hasSelection && isSelected ? "z-[2] ring-paper/40" : "";
                const unselectedClass = hasSelection && !isSelected ? "z-[1] opacity-95" : "";

                const cellClass = `${panelBaseClass} ${desktopFourColHeightClass} min-w-0 bg-ink ${selectedClass} ${unselectedClass}`;

                const leanStyle = clipPathStyle(splitLeanPolygon(index), index);

                return interactive ? (
                  <button
                    key={panel.key}
                    type="button"
                    className={cellClass}
                    style={leanStyle}
                    onClick={() => onSelect?.(panel.key)}
                  >
                    {inner}
                  </button>
                ) : (
                  <Link key={panel.key} href={panel.href} className={cellClass} style={leanStyle}>
                    {inner}
                  </Link>
                );
              })}
            </div>
          </div>
          </div>
        </div>
        {children}
      </div>
    </section>
  );
}
