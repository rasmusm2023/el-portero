"use client";

import { useEffect, useRef } from "react";
import { useLocale } from "@/i18n/useLocale";
import { t, type MessageKey } from "@/i18n/strings";

/** Subtle vertical parallax inside the crop; respects `prefers-reduced-motion`. */
function GalleryParallaxVideo({
  src,
  ariaLabel,
  coverScale = 1.18,
  objectPosition = "50% 50%",
}: {
  src: string;
  ariaLabel: string;
  /** Combined with object-cover; lower = show more of the frame (“zoom out”). */
  coverScale?: number;
  objectPosition?: string;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const wrap = wrapRef.current;
    if (!wrap) return;

    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mq.matches) return;

    let raf = 0;
    const strength = 0.3;

    const tick = () => {
      const video = wrap.querySelector("video");
      if (!video) return;
      const rect = wrap.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      if (rect.bottom < 0 || rect.top > vh) return;
      const centerOffset = rect.top + rect.height / 2 - vh / 2;
      const y = (-centerOffset / vh) * rect.height * strength;
      video.style.transform = `translate3d(0,${y.toFixed(2)}px,0) scale(${coverScale})`;
    };

    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(tick);
    };

    tick();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
      const video = wrap.querySelector("video");
      if (video) video.style.removeProperty("transform");
    };
  }, [coverScale]);

  return (
    <div ref={wrapRef} className="absolute inset-0 overflow-hidden bg-ink">
      <video
        className="h-full w-full object-cover will-change-transform"
        style={{
          minHeight: "100%",
          minWidth: "100%",
          objectPosition,
        }}
        src={src}
        aria-label={ariaLabel}
        muted
        playsInline
        loop
        autoPlay
        preload="metadata"
      />
    </div>
  );
}

/** Zoom for rotated landscape→portrait arepas; keep low so the full dish reads in-frame. */
const BASE_ROTATED_SCALE = 1.04;

/** Landscape asset shown as portrait: rotate (e.g. 90°) + zoom so the frame fills. */
function GalleryParallaxRotatedImage({
  src,
  alt,
  rotateDeg,
}: {
  src: string;
  alt: string;
  rotateDeg: number;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const wrap = wrapRef.current;
    const img = imgRef.current;
    if (!wrap || !img) return;

    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mq.matches) {
      img.style.transform = `rotate(${rotateDeg}deg) scale(${BASE_ROTATED_SCALE})`;
      img.style.transformOrigin = "center center";
      return;
    }

    let raf = 0;
    const strength = 0.3;

    const apply = (y: number) => {
      img.style.transform = `translate3d(0,${y.toFixed(2)}px,0) rotate(${rotateDeg}deg) scale(${BASE_ROTATED_SCALE})`;
      img.style.transformOrigin = "center center";
    };

    const tick = () => {
      const rect = wrap.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      if (rect.bottom < 0 || rect.top > vh) return;
      const centerOffset = rect.top + rect.height / 2 - vh / 2;
      const y = (-centerOffset / vh) * rect.height * strength;
      apply(y);
    };

    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(tick);
    };

    tick();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
      img.style.removeProperty("transform");
      img.style.removeProperty("transform-origin");
    };
  }, [rotateDeg]);

  return (
    <div
      ref={wrapRef}
      className="absolute inset-0 flex items-center justify-center overflow-hidden bg-ink"
    >
      {/* Raw img: composed rotate + parallax transform; next/image fights fill+transform in this layout. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        ref={imgRef}
        src={src}
        alt={alt}
        className="pointer-events-none max-h-none max-w-none shrink-0 object-cover"
        style={{
          minHeight: "104%",
          minWidth: "104%",
          transform: `rotate(${rotateDeg}deg) scale(${BASE_ROTATED_SCALE})`,
          transformOrigin: "center center",
        }}
        loading="lazy"
        decoding="async"
        draggable={false}
      />
    </div>
  );
}

const GALLERY_IMAGE_FRAME =
  "shadow-[0_28px_64px_-18px_rgba(10,10,10,0.12)] ring-1 ring-ink/10";

type GalleryMedia =
  | {
      kind: "video";
      src: string;
      coverScale?: number;
      objectPosition?: string;
    }
  | { kind: "image"; src: string; rotateDeg: number };

const ROWS: {
  media: GalleryMedia;
  captionKey: MessageKey;
  bodyKey: MessageKey;
  altKey: MessageKey;
}[] = [
  {
    media: {
      kind: "image",
      src: "/images/delicious-homemade-arepas-with-avocado-and-cheese-toppings-SBI-351110372-preview.jpg",
      rotateDeg: 90,
    },
    captionKey: "page.gallery.caption1",
    bodyKey: "page.gallery.body1",
    altKey: "page.gallery.imageAlt1",
  },
  {
    media: {
      kind: "video",
      src: "/videos/delicious-swedish-meatballs-with-mashed-potatoes-and-cranberry-sauce-SBV-349166281-preview.mp4",
      coverScale: 1.06,
      objectPosition: "50% 46%",
    },
    captionKey: "page.gallery.caption2",
    bodyKey: "page.gallery.body2",
    altKey: "page.gallery.imageAlt2",
  },
  {
    media: {
      kind: "video",
      src: "/videos/skilled-bartender-expertly-mixing-cocktail-ingredients-at-bar-counter-SBV-333451099-preview.mp4",
    },
    captionKey: "page.gallery.caption3",
    bodyKey: "page.gallery.body3",
    altKey: "page.gallery.imageAlt3",
  },
];

/**
 * Repeating trio: portrait anchor → wide panoramic → tall narrow.
 * Alternates image/caption sides; first row image is on the **right** (clearer space under the hero video).
 */
const RHYTHM = [
  {
    row: "",
    image: `relative z-0 aspect-[4/5] w-full shrink-0 overflow-hidden bg-paper-dark md:aspect-[4/5] md:w-[54%] md:max-w-none ${GALLERY_IMAGE_FRAME}`,
    caption:
      "relative z-10 flex w-full flex-1 items-center md:w-0 md:min-w-0 md:py-4",
    captionBox: "md:-ml-12 md:pl-2 lg:-ml-[4.5rem] lg:pl-4",
    captionBoxRev: "md:-mr-12 md:pr-2 lg:-mr-[4.5rem] lg:pr-4",
  },
  {
    row: "md:items-center",
    image: `relative z-0 aspect-[5/4] w-full shrink-0 overflow-hidden bg-paper-dark md:aspect-[16/10] md:w-[66%] md:max-w-none ${GALLERY_IMAGE_FRAME}`,
    caption:
      "relative z-10 flex w-full flex-1 items-center md:w-0 md:min-w-0 md:self-stretch md:py-2",
    captionBox: "md:-ml-10 md:pl-1 lg:-ml-14 lg:pl-3",
    captionBoxRev: "md:-mr-10 md:pr-1 lg:-mr-14 lg:pr-3",
  },
  {
    row: "",
    image: `relative z-0 aspect-[3/4] w-full shrink-0 overflow-hidden bg-paper-dark md:aspect-[3/5] md:w-[38%] md:max-w-none ${GALLERY_IMAGE_FRAME}`,
    caption:
      "relative z-10 flex w-full flex-1 items-center md:w-0 md:min-w-0 md:py-4",
    captionBox: "md:-ml-14 md:pl-2 lg:-ml-20 lg:pl-5",
    captionBoxRev: "md:-mr-14 md:pr-2 lg:-mr-20 lg:pr-5",
  },
] as const;

function galleryRowKey(media: GalleryMedia): string {
  return media.kind === "video" ? media.src : `${media.src}-${media.rotateDeg}`;
}

export function GallerySection() {
  const { locale } = useLocale();

  return (
    <section
      id="gallery"
      aria-labelledby="gallery-heading"
      className="scroll-mt-[calc(var(--header-h)+1px)] border-t border-border bg-ink"
    >
      <h2 id="gallery-heading" className="sr-only">
        {t(locale, "page.gallery.srHeading")}
      </h2>
      <div className="mx-auto w-full max-w-[min(100%,112rem)] px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <div className="mt-0 flex flex-col gap-14 md:gap-17 lg:gap-24">
          {ROWS.map((row, i) => {
            const imageLeft = i % 2 === 1;
            const beat = RHYTHM[i % RHYTHM.length] ?? RHYTHM[0];
            const overlap = imageLeft ? beat.captionBox : beat.captionBoxRev;
            return (
              <div
                key={galleryRowKey(row.media)}
                className={`relative flex flex-col gap-6 md:flex-row md:items-stretch md:gap-0 ${beat.row}`}
              >
                <div
                  className={`${beat.image} ${imageLeft ? "" : "md:order-2"}`}
                >
                  {row.media.kind === "video" ? (
                    <GalleryParallaxVideo
                      src={row.media.src}
                      ariaLabel={t(locale, row.altKey)}
                      coverScale={row.media.coverScale}
                      objectPosition={row.media.objectPosition}
                    />
                  ) : (
                    <GalleryParallaxRotatedImage
                      src={row.media.src}
                      alt={t(locale, row.altKey)}
                      rotateDeg={row.media.rotateDeg}
                    />
                  )}
                </div>
                <div
                  className={`${beat.caption} ${imageLeft ? "" : "md:order-1"} ${overlap}`}
                >
                  <div className="w-full rounded-2xl border border-border bg-paper-dark/55 p-8 shadow-[0_18px_48px_-12px_rgba(0,0,0,0.45)] backdrop-blur-md sm:rounded-3xl sm:p-10">
                    <p className="font-display text-xl font-medium leading-snug text-paper sm:text-2xl">
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
