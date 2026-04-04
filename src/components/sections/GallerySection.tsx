"use client";

import { useLocale } from "@/i18n/useLocale";
import { t } from "@/i18n/strings";

export function GallerySection() {
  const { locale } = useLocale();
  const intro =
    locale === "es"
      ? "Imágenes del restaurante — próximamente desde el administrador."
      : locale === "sv"
        ? "Bilder från restaurangen — snart från admin."
        : "Photography from the dining room and kitchen — wired to the CMS next.";

  const tiles = Array.from({ length: 6 }, (_, i) => i);

  return (
    <section
      id="gallery"
      aria-labelledby="gallery-heading"
      className="scroll-mt-[calc(var(--header-h)+1px)] border-t border-border bg-paper"
    >
      <div className="mx-auto max-w-[var(--container-max)] px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <h2
          id="gallery-heading"
          className="font-display text-3xl font-medium tracking-tight text-ink sm:text-4xl"
        >
          {t(locale, "page.gallery.title")}
        </h2>
        <p className="mt-4 max-w-2xl text-lg text-ink-muted leading-relaxed">
          {intro}
        </p>
        <div className="mt-10 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
          {tiles.map((i) => (
            <div
              key={i}
              className="aspect-[4/5] rounded-md bg-gradient-to-br from-paper-dark via-paper to-ink/5 ring-1 ring-border"
              role="img"
              aria-label={
                locale === "es"
                  ? "Marcador de imagen"
                  : locale === "sv"
                    ? "Bildplatshållare"
                    : "Image placeholder"
              }
            />
          ))}
        </div>
      </div>
    </section>
  );
}
