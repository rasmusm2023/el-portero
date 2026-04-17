"use client";

import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  MENU_SPLIT_PANELS,
  type MenuSplitKey,
} from "@/data/menuSplitPanels";
import { useLocale } from "@/i18n/useLocale";
import { t, type MessageKey } from "@/i18n/strings";

type MenuSplitSectionVerticalProps = {
  onSelect?: (key: MenuSplitKey) => void;
  activeKey?: MenuSplitKey | null;
  children?: ReactNode;
};

/** Shared easing: smooth deceleration for flex height + opacity changes. */
const stripEase = "ease-[cubic-bezier(0.22,1,0.36,1)]";

const stripTransition =
  `transition-[flex-grow,flex-basis,min-height,opacity,box-shadow] duration-700 ${stripEase} motion-reduce:transition-none`;

const panelStripBase =
  `group/panel relative flex min-h-0 w-full flex-col overflow-hidden rounded-lg bg-ink ${stripTransition} ` +
  "hover:brightness-[1.05] active:brightness-[0.98] " +
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-paper/60 " +
  "isolate";

const panelStripButton = `${panelStripBase} cursor-pointer select-none`;
const panelStripLink = `${panelStripBase} cursor-pointer`;

function StripPhoto({
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
          "h-full w-full origin-center scale-100 transform-gpu",
          "transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none",
          "group-hover/panel:scale-[1.03] motion-reduce:group-hover/panel:scale-100",
        ].join(" ")}
      >
        <div
          className={[
            "relative h-full w-full",
            "transition-[filter] duration-700 ease-[cubic-bezier(0.33,1,0.68,1)] motion-reduce:transition-none",
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

function StripContent({
  labelKey,
  srKey,
  seeMenu,
  isActive,
  isDimmed,
}: {
  labelKey: MessageKey;
  srKey: MessageKey;
  seeMenu: string;
  isActive: boolean;
  isDimmed: boolean;
}) {
  const { locale } = useLocale();
  const titleClass = [
    "min-w-0 flex-1 pr-2 text-left font-hero-title uppercase leading-[1.05] tracking-[0.1em] text-paper transition-[color,opacity] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none",
    isActive
      ? "text-[clamp(1.45rem,3.4vw,2.35rem)]"
      : isDimmed
        ? "text-[clamp(1.2rem,2.75vw,1.85rem)] text-paper/82"
        : "text-[clamp(1.35rem,3vw,2.1rem)] text-paper/95",
  ].join(" ");

  const seeClass = [
    "shrink-0 self-center text-right font-sans text-[11px] font-semibold uppercase tracking-[0.22em] underline underline-offset-[0.3em] transition-[color,opacity,text-decoration-color] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none sm:text-xs md:text-sm",
    isDimmed
      ? "text-paper/50 decoration-paper/20"
      : isActive
        ? "text-paper/90 decoration-paper/45"
        : "text-paper/80 decoration-paper/35",
  ].join(" ");

  return (
    <>
      <div
        className="absolute inset-0 z-[1] bg-gradient-to-r from-ink/92 via-ink/55 to-ink/28 transition-opacity duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none group-hover/panel:from-ink/94 group-hover/panel:via-ink/58"
        aria-hidden
      />
      <div className="relative z-[2] flex h-full min-h-0 w-full flex-row items-center justify-between gap-3 px-3.5 py-2.5 sm:gap-4 sm:px-4 sm:py-3 md:py-3.5">
        <span className={titleClass}>{t(locale, labelKey)}</span>
        <span className={seeClass}>{seeMenu}</span>
        <span className="sr-only">
          {" "}
          — {t(locale, srKey)}
        </span>
      </div>
    </>
  );
}

/**
 * Demo / alternate layout: narrow vertical stack on the left, tighter rows;
 * the active panel grows in height. Pair with `DemoHomePage` only.
 */
export function MenuSplitSectionVertical({
  onSelect,
  activeKey = null,
  children,
}: MenuSplitSectionVerticalProps) {
  const { locale } = useLocale();
  const seeMenu = t(locale, "page.menu.seeMenu");
  const interactive = Boolean(onSelect);
  const hasSelection = activeKey != null;
  /** Left rail is ~30% width on large screens — request matching image resolution. */
  const sizes = "(max-width: 1023px) 100vw, 30vw";

  return (
    <section
      id="menus-demo"
      aria-label={
        locale === "es"
          ? "Elegir tipo de carta (demo)"
          : locale === "sv"
            ? "Välj meny (demo)"
            : "Choose a menu (demo)"
      }
      className="scroll-mt-[calc(var(--header-h)+0.5rem)] bg-paper"
    >
      <div className="mx-auto w-full max-w-[min(100%,112rem)] px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <div className="flex flex-col gap-6 lg:grid lg:grid-cols-[minmax(0,30%)_minmax(0,70%)] lg:items-stretch lg:gap-8">
          <div className="flex min-w-0 w-full flex-col">
            <div className="flex h-[min(720px,78vh)] flex-col gap-2.5 sm:h-[min(780px,80vh)] sm:gap-3 lg:h-[min(880px,82vh)]">
              {MENU_SPLIT_PANELS.map((panel, index) => {
                const isSelected = activeKey === panel.key;
                const dimmed = hasSelection && !isSelected;

                const flexPart = !hasSelection
                  ? "flex-1 basis-0 min-h-[10.5rem] sm:min-h-[11.5rem]"
                  : isSelected
                    ? "flex-[2.85] basis-0 min-h-[9.5rem] sm:min-h-[10.5rem]"
                    : "flex-1 basis-0 min-h-[4rem] sm:min-h-[4.5rem]";

                const ring =
                  hasSelection && isSelected
                    ? "z-[2] ring-2 ring-paper/45"
                    : hasSelection && dimmed
                      ? "z-[1] opacity-[0.92]"
                      : "";

                const inner = (
                  <>
                    <StripPhoto
                      src={panel.src}
                      sizes={sizes}
                      priority={index === 0}
                      dimmed={dimmed}
                    />
                    <StripContent
                      labelKey={panel.labelKey}
                      srKey={panel.srKey}
                      seeMenu={seeMenu}
                      isActive={isSelected}
                      isDimmed={dimmed}
                    />
                  </>
                );

                return interactive ? (
                  <button
                    key={panel.key}
                    type="button"
                    className={`${panelStripButton} ${flexPart} ${ring}`}
                    onClick={() => onSelect?.(panel.key)}
                  >
                    {inner}
                  </button>
                ) : (
                  <Link
                    key={panel.key}
                    href={panel.href}
                    className={`${panelStripLink} ${flexPart}`}
                  >
                    {inner}
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="min-w-0 w-full lg:flex lg:flex-col lg:justify-start">
            {children}
          </div>
        </div>
      </div>
    </section>
  );
}
