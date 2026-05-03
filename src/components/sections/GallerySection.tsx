"use client";

import Image from "next/image";
import { useLocale } from "@/i18n/useLocale";
import { t, type MessageKey } from "@/i18n/strings";

const GALLERY_ROUNDED =
  "rounded-2xl sm:rounded-3xl shadow-[0_28px_64px_-18px_rgba(10,10,10,0.12)] ring-1 ring-ink/10";

const ROWS: {
  src: string;
  captionKey: MessageKey;
  bodyKey: MessageKey;
  altKey: MessageKey;
}[] = [
  {
    src: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1400&q=85&auto=format&fit=crop",
    captionKey: "page.gallery.caption1",
    bodyKey: "page.gallery.body1",
    altKey: "page.gallery.imageAlt1",
  },
  {
    src: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1400&q=85&auto=format&fit=crop",
    captionKey: "page.gallery.caption2",
    bodyKey: "page.gallery.body2",
    altKey: "page.gallery.imageAlt2",
  },
  {
    // NOTE: Unsplash image IDs occasionally 404; keep a known-good fallback here.
    src: "https://images.unsplash.com/photo-1489944440615-453fc2b6a9a9?w=1400&q=85&auto=format&fit=crop",
    captionKey: "page.gallery.caption3",
    bodyKey: "page.gallery.body3",
    altKey: "page.gallery.imageAlt3",
  },
];

/**
 * Repeating trio: portrait anchor → wide panoramic → tall narrow.
 * Keeps alternating image/caption sides for continuity.
 */
const RHYTHM = [
  {
    row: "",
    image: `relative z-0 aspect-[4/5] w-full shrink-0 overflow-hidden bg-paper-dark md:aspect-[4/5] md:w-[54%] md:max-w-none ${GALLERY_ROUNDED}`,
    sizes: "(max-width: 768px) 100vw, 52vw",
    caption:
      "relative z-10 flex w-full flex-1 items-center md:w-0 md:min-w-0 md:py-4",
    captionBox: "md:-ml-12 md:pl-2 lg:-ml-[4.5rem] lg:pl-4",
    captionBoxRev: "md:-mr-12 md:pr-2 lg:-mr-[4.5rem] lg:pr-4",
  },
  {
    row: "md:items-center",
    image: `relative z-0 aspect-[5/4] w-full shrink-0 overflow-hidden bg-paper-dark md:aspect-[16/10] md:w-[66%] md:max-w-none ${GALLERY_ROUNDED}`,
    sizes: "(max-width: 768px) 100vw, 64vw",
    caption:
      "relative z-10 flex w-full flex-1 items-center md:w-0 md:min-w-0 md:self-stretch md:py-2",
    captionBox: "md:-ml-10 md:pl-1 lg:-ml-14 lg:pl-3",
    captionBoxRev: "md:-mr-10 md:pr-1 lg:-mr-14 lg:pr-3",
  },
  {
    row: "",
    image: `relative z-0 aspect-[3/4] w-full shrink-0 overflow-hidden bg-paper-dark md:aspect-[3/5] md:w-[38%] md:max-w-none ${GALLERY_ROUNDED}`,
    sizes: "(max-width: 768px) 100vw, 38vw",
    caption:
      "relative z-10 flex w-full flex-1 items-center md:w-0 md:min-w-0 md:py-4",
    captionBox: "md:-ml-14 md:pl-2 lg:-ml-20 lg:pl-5",
    captionBoxRev: "md:-mr-14 md:pr-2 lg:-mr-20 lg:pr-5",
  },
] as const;

export function GallerySection() {
  const { locale } = useLocale();

  return (
    <section
      id="gallery"
      aria-labelledby="gallery-heading"
      className="scroll-mt-[calc(var(--header-h)+1px)] border-t border-border bg-paper"
    >
      <h2 id="gallery-heading" className="sr-only">
        {t(locale, "page.gallery.srHeading")}
      </h2>
      <div className="mx-auto w-full max-w-[min(100%,112rem)] px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <div className="mt-0 flex flex-col gap-14 md:gap-17 lg:gap-24">
          {ROWS.map((row, i) => {
            const imageLeft = i % 2 === 0;
            const beat = RHYTHM[i % RHYTHM.length] ?? RHYTHM[0];
            const overlap = imageLeft ? beat.captionBox : beat.captionBoxRev;
            return (
              <div
                key={row.src}
                className={`relative flex flex-col gap-6 md:flex-row md:items-stretch md:gap-0 ${beat.row}`}
              >
                <div
                  className={`${beat.image} ${imageLeft ? "" : "md:order-2"}`}
                >
                  <Image
                    src={row.src}
                    alt={t(locale, row.altKey)}
                    fill
                    className="object-cover"
                    sizes={beat.sizes}
                  />
                </div>
                <div
                  className={`${beat.caption} ${imageLeft ? "" : "md:order-1"} ${overlap}`}
                >
                  <div className="w-full rounded-2xl border border-border bg-paper/95 p-8 shadow-[0_18px_48px_-12px_rgba(15,15,18,0.18)] backdrop-blur-sm sm:rounded-3xl sm:p-10">
                    <p className="font-display text-xl font-medium leading-snug text-ink sm:text-2xl">
                      {t(locale, row.captionKey)}
                    </p>
                    <p className="mt-4 max-w-prose font-sans text-sm leading-relaxed text-ink-muted sm:text-[15px]">
                      {t(locale, row.bodyKey)}
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
