"use client";

import { useLocale } from "@/i18n/useLocale";
import { t } from "@/i18n/strings";

const ROWS = 3;

export function GallerySection() {
  const { locale } = useLocale();
  const intro =
    locale === "es"
      ? "Imágenes del restaurante — próximamente desde el administrador."
      : locale === "sv"
        ? "Bilder från restaurangen — snart från admin."
        : "Photography from the dining room and kitchen — wired to the CMS next.";

  const captions = Array.from({ length: ROWS }, (_, i) => {
    const n = i + 1;
    if (locale === "es") return `Espacio ${n} — texto de ejemplo.`;
    if (locale === "sv") return `Rum ${n} — exempeltext.`;
    return `Room ${n} — placeholder copy for the gallery.`;
  });

  return (
    <section
      id="gallery"
      aria-labelledby="gallery-heading"
      className="scroll-mt-[calc(var(--header-h)+1px)] border-t border-border bg-paper"
    >
      <div className="w-full px-5 py-16 sm:px-10 sm:py-20 lg:px-14 xl:px-20">
        <h2
          id="gallery-heading"
          className="font-display text-3xl font-medium tracking-tight text-ink sm:text-4xl"
        >
          {t(locale, "page.gallery.title")}
        </h2>
        <p className="mt-4 max-w-2xl text-lg text-ink-muted leading-relaxed">
          {intro}
        </p>

        <div className="mt-14 flex flex-col gap-12 md:gap-16 lg:gap-20">
          {captions.map((caption, i) => {
            const imageLeft = i % 2 === 0;
            return (
              <div
                key={i}
                className={`relative flex flex-col gap-6 md:min-h-[min(28rem,70vw)] md:flex-row md:items-stretch md:gap-0 ${
                  imageLeft ? "" : "md:flex-row-reverse"
                }`}
              >
                <div
                  className="relative z-0 aspect-[4/5] w-full shrink-0 overflow-hidden rounded-none bg-gradient-to-br from-paper-dark via-paper to-ink/5 ring-1 ring-border md:aspect-auto md:w-1/2 md:min-h-[min(28rem,62vh)] md:max-w-none"
                  role="img"
                  aria-label={
                    locale === "es"
                      ? "Marcador de imagen"
                      : locale === "sv"
                        ? "Bildplatshållare"
                        : "Image placeholder"
                  }
                />
                <div
                  className={`relative z-10 flex w-full flex-1 items-center md:w-1/2 md:min-w-0 ${
                    imageLeft
                      ? "md:-ml-12 md:pl-2 lg:-ml-20 lg:pl-4"
                      : "md:-mr-12 md:pr-2 lg:-mr-20 lg:pr-4"
                  }`}
                >
                  <div className="w-full border border-border bg-paper/95 p-8 shadow-[0_18px_48px_-12px_rgba(15,15,18,0.18)] backdrop-blur-sm sm:p-10">
                    <p className="font-display text-xl font-medium leading-snug text-ink sm:text-2xl">
                      {caption}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
