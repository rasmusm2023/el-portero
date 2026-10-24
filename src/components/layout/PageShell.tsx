"use client";

import type { ReactNode } from "react";

type PageShellProps = {
  title?: string;
  intro?: ReactNode;
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
  /** Light staff workspace vs public venue pages. */
  tone?: "public" | "admin";
  children: ReactNode;
};

export function PageShell({
  title,
  intro,
  introVariant = "default",
  showDocumentHeader = true,
  titleVariant = "default",
  maxWidthClassName,
  tone = "public",
  children,
}: PageShellProps) {
  const isAdmin = tone === "admin";
  const titleClassName =
    titleVariant === "hero"
      ? "font-hero-title text-[clamp(2.25rem,6vw,4.25rem)] font-normal leading-[1.05] tracking-[0.14em] text-paper uppercase"
      : isAdmin
        ? "font-display text-3xl font-medium tracking-tight text-zinc-900 sm:text-4xl"
        : "font-display text-4xl font-medium tracking-tight text-paper sm:text-5xl";

  const introClassName =
    introVariant === "display"
      ? "mt-4 max-w-4xl font-display text-2xl text-paper leading-relaxed"
      : isAdmin
        ? "mt-3 text-base text-zinc-600 leading-relaxed"
        : "mt-4 text-lg text-ink-muted leading-relaxed";

  const headerMaxClass =
    intro && introVariant === "display"
      ? "max-w-4xl"
      : maxWidthClassName
        ? "max-w-5xl"
        : "max-w-3xl";

  return (
    <div
      className={[
        "mx-auto px-4 sm:px-6 lg:px-8",
        isAdmin ? "py-8 sm:py-10" : "py-16",
        maxWidthClassName ?? "max-w-[var(--container-max)]",
      ].join(" ")}
    >
      {showDocumentHeader && title ? (
        <header className={[isAdmin ? "mb-8" : "mb-12", headerMaxClass].join(" ")}>
          <h1 className={titleClassName}>{title}</h1>
          {intro ? (
            <div className={introClassName}>{intro}</div>
          ) : null}
        </header>
      ) : null}
      {children}
    </div>
  );
}
