"use client";

import { useEffect, useRef, useState } from "react";
import { BUNNY_IMG } from "@/lib/bunnyMedia";
import { useLocale } from "@/i18n/useLocale";
import { t, type MessageKey } from "@/i18n/strings";

type GalleryImageSlide = { src: string };

/** Subtle vertical parallax inside the crop; respects `prefers-reduced-motion`. */
function GalleryParallaxVideo({
  src,
  sources,
  ariaLabel,
  coverScale = 1.18,
  objectPosition = "50% 50%",
}: {
  src: string;
  sources?: { src: string; type?: string }[];
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
        aria-label={ariaLabel}
        muted
        playsInline
        loop
        autoPlay
        preload="metadata"
      >
        {(sources ?? [{ src }]).map((s) => (
          <source key={s.src} src={s.src} type={s.type} />
        ))}
      </video>
    </div>
  );
}

/**
 * Base zoom for “rotated image inside crop” gallery tiles.
 * Mobile needs to show more of the frame (less zoom) for the first image.
 */
const BASE_ROTATED_SCALE_DESKTOP = 1.01;
const BASE_ROTATED_SCALE_MOBILE = 1.0;

const GALLERY_IMAGE_FRAME =
  "shadow-[0_28px_64px_-18px_rgba(10,10,10,0.12)] ring-1 ring-ink/10";

type GalleryMedia =
  | {
      kind: "video";
      src: string;
      sources?: { src: string; type?: string }[];
      coverScale?: number;
      objectPosition?: string;
    }
  | { kind: "imageCycle"; slides: GalleryImageSlide[]; rotateDeg: number };

const galleryBarVideoMp4 =
  "https://el-portero.b-cdn.net/videos/8s_barman-making-cocktails-with-whiskey-liquor-alcohol-at-the-bar-at-night.mp4";
const galleryBarSources = [{ src: galleryBarVideoMp4, type: "video/mp4" as const }];

const ROWS: {
  media: GalleryMedia;
  captionKey: MessageKey;
  bodyKey: MessageKey;
  altKey: MessageKey;
}[] = [
  {
    media: {
      kind: "imageCycle",
      slides: [
        { src: "https://el-portero.b-cdn.net/images/oysters-shrimps.jpg" },
        { src: "https://el-portero.b-cdn.net/images/paella.jpg" },
        BUNNY_IMG.heroAccentDish,
        BUNNY_IMG.galleryTostada,
      ],
      rotateDeg: 0,
    },
    captionKey: "page.gallery.caption1",
    bodyKey: "page.gallery.body1",
    altKey: "page.gallery.imageAlt1",
  },
  {
    media: {
      kind: "imageCycle",
      slides: [
        BUNNY_IMG.sevenTonguedDish,
        BUNNY_IMG.galleryDish1,
        BUNNY_IMG.galleryDish2,
        BUNNY_IMG.galleryDish3,
      ],
      rotateDeg: 0,
    },
    captionKey: "page.gallery.caption2",
    bodyKey: "page.gallery.body2",
    altKey: "page.gallery.imageAlt2",
  },
  {
    media: {
      kind: "video",
      src: galleryBarVideoMp4,
      sources: galleryBarSources,
      coverScale: 1.02,
      objectPosition: "50% 50%",
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
    row: "md:items-center",
    image: `relative z-0 aspect-[5/4] w-full shrink-0 overflow-hidden bg-paper-dark md:aspect-[16/10] md:w-[66%] md:max-w-none ${GALLERY_IMAGE_FRAME}`,
    caption:
      "relative z-10 flex w-full flex-1 items-center md:w-0 md:min-w-0 md:py-4",
    captionBox: "md:-ml-10 md:pl-1 lg:-ml-14 lg:pl-3",
    captionBoxRev: "md:-mr-10 md:pr-1 lg:-mr-14 lg:pr-3",
  },
] as const;

function galleryRowKey(media: GalleryMedia): string {
  if (media.kind === "video") return media.src;
  return `${media.slides.map((s) => s.src).join("|")}-${media.rotateDeg}`;
}

function GalleryParallaxFadingImage({
  slides,
  alt,
  rotateDeg,
  durationMs = 3000,
  fadeMs = 900,
}: {
  slides: GalleryImageSlide[];
  alt: string;
  rotateDeg: number;
  durationMs?: number;
  fadeMs?: number;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const imgRefs = useRef<(HTMLImageElement | null)[]>([]);
  const parallaxCleanupImgsRef = useRef<(HTMLImageElement | null)[]>([]);
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (slides.length <= 1) return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mq.matches) return;
    const id = window.setInterval(() => {
      setActive((i) => (i + 1) % slides.length);
    }, durationMs);
    return () => window.clearInterval(id);
  }, [durationMs, slides.length]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const wrap = wrapRef.current;
    if (!wrap) return;

    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mq.matches) return;

    const mobileMq = window.matchMedia("(max-width: 639px)");
    const baseScale =
      rotateDeg === 0 && mobileMq.matches
        ? BASE_ROTATED_SCALE_MOBILE
        : BASE_ROTATED_SCALE_DESKTOP;

    let raf = 0;
    const strength = 0.3;

    const apply = (y: number) => {
      const imgs = imgRefs.current;
      parallaxCleanupImgsRef.current = imgs;
      for (const img of imgs) {
        if (!img) continue;
        img.style.transform = `translate3d(0,${y.toFixed(2)}px,0) rotate(${rotateDeg}deg) scale(${baseScale})`;
        img.style.transformOrigin = "center center";
      }
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
      for (const img of parallaxCleanupImgsRef.current) {
        if (!img) continue;
        img.style.removeProperty("transform");
        img.style.removeProperty("transform-origin");
      }
    };
  }, [rotateDeg, slides.length]);

  return (
    <div
      ref={wrapRef}
      className="absolute inset-0 flex items-center justify-center overflow-hidden bg-ink"
    >
      {slides.map((slide, i) => {
        const key = slide.src;
        const imgClass =
          "pointer-events-none absolute inset-0 h-full w-full max-h-none max-w-none shrink-0 object-cover";
        const imgStyle = {
          minHeight: rotateDeg === 0 ? ("100%" as const) : ("104%" as const),
          minWidth: rotateDeg === 0 ? ("100%" as const) : ("104%" as const),
          opacity: i === active ? 1 : 0,
          transition: `opacity ${fadeMs}ms ease-in-out`,
        } as const;
        const z = i === active ? "z-[2]" : "z-[1]";
        return (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={key}
            ref={(el) => {
              imgRefs.current[i] = el;
            }}
            src={slide.src}
            alt={alt}
            className={`${imgClass} ${z}`}
            style={imgStyle}
            loading={i === 0 ? "eager" : "lazy"}
            decoding="async"
            draggable={false}
          />
        );
      })}
    </div>
  );
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
                      sources={row.media.sources}
                      ariaLabel={t(locale, row.altKey)}
                      coverScale={row.media.coverScale}
                      objectPosition={row.media.objectPosition}
                    />
                  ) : (
                    <GalleryParallaxFadingImage
                      slides={row.media.slides}
                      alt={t(locale, row.altKey)}
                      rotateDeg={row.media.rotateDeg}
                    />
                  )}
                </div>
                <div
                  className={`${beat.caption} ${imageLeft ? "" : "md:order-1"} ${overlap}`}
                >
                  <div className="w-full rounded-2xl border border-border bg-paper-dark/55 p-8 shadow-[0_18px_48px_-12px_rgba(0,0,0,0.45)] backdrop-blur-md sm:rounded-3xl sm:p-11 md:p-12">
                    <p className="font-display text-2xl font-medium leading-snug text-paper sm:text-3xl lg:text-4xl lg:leading-[1.12]">
                      {t(locale, row.captionKey)}
                    </p>
                    <p className="mt-5 max-w-prose font-sans text-base leading-relaxed text-ink-muted sm:mt-6 sm:text-lg lg:text-xl">
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
