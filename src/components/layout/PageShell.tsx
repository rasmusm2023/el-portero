"use client";

import type { ReactNode } from "react";

type PageShellProps = {
  title?: string;
  intro?: string;
  /** Match category headings on menu pages (`font-display text-2xl`), e.g. lunch intro under the hero title. */
  introVariant?: "default" | "display";
  /** When false, skip the document title block (e.g. title already appears in {@link PageHeroSection}). */
  showDocumentHeader?: boolean;
  /** Match {@link PageHeroSection} / reserve-style page titles (`font-hero-title`). */
  titleVariant?: "default" | "hero";
  /**
   * Override the outer `max-w-*` (default: site 72rem container). Wider for admin or data-dense UIs.
   * Example: `max-w-[min(100%,112rem)]` or `max-w-7xl`.
   */
  maxWidthClassName?: string;
  children: ReactNode;
};

export function PageShell({
  title,
  intro,
  introVariant = "default",
  showDocumentHeader = true,
  titleVariant = "default",
  maxWidthClassName,
  children,
}: PageShellProps) {
  const titleClassName =
    titleVariant === "hero"
      ? "font-hero-title text-[clamp(2.25rem,6vw,4.25rem)] font-normal leading-[1.05] tracking-[0.14em] text-ink uppercase"
      : "font-display text-4xl font-medium tracking-tight text-ink sm:text-5xl";

  const introClassName =
    introVariant === "display"
      ? "mt-4 max-w-4xl font-display text-2xl text-ink leading-relaxed"
      : "mt-4 text-lg text-ink-muted leading-relaxed";

  const headerMaxClass =
    intro && introVariant === "display"
      ? "max-w-4xl"
      : maxWidthClassName
        ? "max-w-5xl"
        : "max-w-3xl";

  return (
    <div
      className={["mx-auto px-4 py-16 sm:px-6 lg:px-8", maxWidthClassName ?? "max-w-[var(--container-max)]"].join(" ")}
    >
      {showDocumentHeader && title ? (
        <header className={["mb-12", headerMaxClass].join(" ")}>
          <h1 className={titleClassName}>{title}</h1>
          {intro ? (
            <p className={introClassName}>{intro}</p>
          ) : null}
        </header>
      ) : null}
      {children}
    </div>
  );
}
