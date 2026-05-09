/* eslint-disable @next/next/no-img-element */
"use client";

import { PageHeroSection } from "@/components/PageHeroSection";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { useLocale } from "@/i18n/useLocale";
import { t } from "@/i18n/strings";

const titleClass =
  "font-hero-title text-[clamp(2.25rem,6vw,4.25rem)] font-normal leading-[1.05] tracking-[0.14em] text-paper uppercase";

const leadClass =
  "mx-auto mt-8 max-w-2xl font-display text-[1.35rem] leading-[1.75] text-paper/85 sm:mt-10 sm:text-[1.55rem]";

const bodyClass =
  "font-sans text-[1.05rem] leading-relaxed text-ink-muted sm:text-lg lg:text-xl";

const kickerClass =
  "font-sans text-[11px] font-semibold tracking-[0.28em] text-paper/80 uppercase sm:text-xs";

const GALLERY_IMAGE_FRAME =
  "shadow-[0_28px_64px_-18px_rgba(10,10,10,0.12)] ring-1 ring-ink/10";

const BLOCK_RHYTHM = [
  {
    row: "",
    image: `relative z-0 aspect-[4/5] w-full shrink-0 overflow-hidden bg-paper-dark md:aspect-[4/5] md:w-[42%] md:max-w-none ${GALLERY_IMAGE_FRAME}`,
    caption:
      "relative z-10 flex w-full flex-1 items-center md:w-0 md:min-w-0 md:py-4",
    overlap: "md:-ml-8 md:pl-2 lg:-ml-12 lg:pl-4",
    overlapRev: "md:-mr-8 md:pr-2 lg:-mr-12 lg:pr-4",
  },
  {
    row: "md:items-center",
    image: `relative z-0 aspect-[5/4] w-full shrink-0 overflow-hidden bg-paper-dark md:aspect-[16/10] md:w-[48%] md:max-w-none ${GALLERY_IMAGE_FRAME}`,
    caption:
      "relative z-10 flex w-full flex-1 items-center md:w-0 md:min-w-0 md:self-stretch md:py-2",
    overlap: "md:-ml-7 md:pl-1 lg:-ml-11 lg:pl-3",
    overlapRev: "md:-mr-7 md:pr-1 lg:-mr-11 lg:pr-3",
  },
] as const;

type StoryBlock = {
  id: string;
  kicker?: string;
  title: string;
  body: string[];
  image: { alt: string } & (
    | { kind: "single"; src: string; objectPosition?: string }
    | {
        kind: "cycle";
        slides: string[];
        intervalMs: number;
        fadeMs: number;
        objectPosition?: string;
      }
  );
  imageAspectClassName?: string;
  footer?: React.ReactNode;
};

function FadingImageCycle({
  slides,
  alt,
  intervalMs,
  fadeMs,
  sizes,
  objectPosition,
}: {
  slides: string[];
  alt: string;
  intervalMs: number;
  fadeMs: number;
  sizes: string;
  objectPosition?: string;
}) {
  const [active, setActive] = useState(0);

  const reduceMotion = useMemo(() => {
    if (typeof window === "undefined") return true;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  useEffect(() => {
    if (reduceMotion) return;
    if (slides.length <= 1) return;
    const id = window.setInterval(() => {
      setActive((i) => (i + 1) % slides.length);
    }, intervalMs);
    return () => window.clearInterval(id);
  }, [fadeMs, intervalMs, reduceMotion, slides.length]);

  if (slides.length <= 1) {
    const src = slides[0] ?? "";
    return src ? (
      <Image src={src} alt={alt} fill className="object-cover" sizes={sizes} />
    ) : null;
  }

  return (
    <div className="absolute inset-0">
      {slides.map((src, i) => (
        <Image
          key={src}
          src={src}
          alt={alt}
          fill
          className="object-cover"
          sizes={sizes}
          style={{
            opacity: i === active ? 1 : 0,
            transition: reduceMotion ? "none" : `opacity ${fadeMs}ms ease-in-out`,
            objectPosition,
          }}
          priority={i === 0}
        />
      ))}
    </div>
  );
}

function StoryBlockRow({ block, index }: { block: StoryBlock; index: number }) {
  const imageLeft = index % 2 === 1;
  const beat = BLOCK_RHYTHM[index % BLOCK_RHYTHM.length] ?? BLOCK_RHYTHM[0];
  const overlap = imageLeft ? beat.overlap : beat.overlapRev;
  const sizes = "(max-width: 768px) 100vw, 60vw";
  const imageClassName = [
    beat.image,
    block.imageAspectClassName ?? "",
    imageLeft ? "" : "md:order-2",
  ]
    .filter(Boolean)
    .join(" ");
  const captionClassName = [
    beat.caption,
    imageLeft ? "" : "md:order-1",
    overlap,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <section
      id={block.id}
      aria-label={block.title}
      className={`relative flex flex-col gap-6 md:flex-row md:items-stretch md:gap-0 ${beat.row}`}
    >
      <div className={imageClassName}>
        {block.image.kind === "cycle" ? (
          <FadingImageCycle
            slides={block.image.slides}
            alt={block.image.alt}
            intervalMs={block.image.intervalMs}
            fadeMs={block.image.fadeMs}
            sizes={sizes}
            objectPosition={block.image.objectPosition}
          />
        ) : (
          <Image
            src={block.image.src}
            alt={block.image.alt}
            fill
            className="object-cover"
            sizes={sizes}
            style={{ objectPosition: block.image.objectPosition }}
          />
        )}
      </div>

      <div className={captionClassName}>
        <div className="w-full rounded-2xl border border-border bg-paper-dark/55 p-9 shadow-[0_18px_48px_-12px_rgba(0,0,0,0.45)] backdrop-blur-md sm:rounded-3xl sm:p-12 md:p-14 lg:p-16">
          {block.kicker ? (
            <p className={kickerClass}>{block.kicker}</p>
          ) : null}
          <p className="mt-2 font-display text-2xl font-medium leading-snug text-paper sm:text-3xl lg:text-4xl lg:leading-[1.12]">
            {block.title}
          </p>
          <div className="mt-5 space-y-4 sm:mt-6 sm:space-y-5">
            {block.body.map((p, i) => (
              <p key={`${block.id}-${i}`} className={bodyClass}>
                {p}
              </p>
            ))}
          </div>
          {block.footer ?? null}
        </div>
      </div>
    </section>
  );
}

export function StoryDraftPage() {
  const { locale } = useLocale();
  const cdn = "https://el-portero.b-cdn.net/images";
  const STORY_BLOCKS: StoryBlock[] = useMemo(
    () => [
      {
        id: "dream",
        kicker: t(locale, "page.storyDraft.dreamKicker"),
        title: t(locale, "page.storyDraft.dreamTitle"),
        body: [t(locale, "page.storyDraft.dreamP1"), t(locale, "page.storyDraft.dreamP2")],
        image: {
          kind: "single",
          src: `${cdn}/3.jpg`,
          alt: t(locale, "page.storyDraft.altDream"),
        },
      },
      {
        id: "two-dreams",
        kicker: t(locale, "page.storyDraft.twoDreamsKicker"),
        title: t(locale, "page.storyDraft.twoDreamsTitle"),
        body: [
          t(locale, "page.storyDraft.twoDreamsP1"),
          t(locale, "page.storyDraft.twoDreamsP2"),
        ],
        image: {
          kind: "single",
          src: `${cdn}/1.jpg`,
          objectPosition: "50% 18%",
          alt: t(locale, "page.storyDraft.altTwoDreams"),
        },
        imageAspectClassName: "md:aspect-[16/10]",
      },
      {
        id: "place",
        kicker: t(locale, "page.storyDraft.placeKicker"),
        title: t(locale, "page.storyDraft.placeTitle"),
        body: [t(locale, "page.storyDraft.placeP1"), t(locale, "page.storyDraft.placeP2")],
        image: {
          kind: "single",
          src: `${cdn}/outside-patio.jpg`,
          objectPosition: "22% 50%",
          alt: t(locale, "page.storyDraft.altPlace"),
        },
      },
      {
        id: "name",
        kicker: t(locale, "page.storyDraft.nameKicker"),
        title: t(locale, "page.storyDraft.nameTitle"),
        body: [
          t(locale, "page.storyDraft.nameP1"),
          t(locale, "page.storyDraft.nameP2"),
          t(locale, "page.storyDraft.nameP3"),
        ],
        image: {
          kind: "single",
          src: `${cdn}/bar.jpg`,
          alt: t(locale, "page.storyDraft.altName"),
        },
      },
      {
        id: "welcome",
        title: t(locale, "page.storyDraft.welcomeTitle"),
        body: [t(locale, "page.storyDraft.welcomeP1"), t(locale, "page.storyDraft.welcomeP2")],
        image: {
          kind: "single",
          src: `${cdn}/torrevieja-beach.walk.jpg`,
          alt: t(locale, "page.storyDraft.altWelcome"),
        },
        imageAspectClassName: "aspect-[21/9] md:aspect-[16/10]",
        footer: (
          <div className="mt-8 flex flex-col gap-5 sm:mt-10 sm:flex-row sm:items-end sm:justify-between sm:gap-8">
            <div>
              <p className={bodyClass}>{t(locale, "page.storyDraft.signatureLead")}</p>
              <p className="mt-1 font-signature text-3xl text-paper sm:text-4xl">
                Magnus Hedman
              </p>
            </div>
            <div className="flex shrink-0 justify-start sm:justify-end">
              <div className="relative size-48 overflow-hidden rounded-full bg-paper-dark ring-1 ring-ink/10 shadow-[0_18px_40px_-18px_rgba(0,0,0,0.55)] sm:size-56">
                <Image
                  src={`${cdn}/6.jpg`}
                  alt={t(locale, "page.storyDraft.altPortrait")}
                  fill
                  className="object-cover"
                  sizes="224px"
                />
              </div>
            </div>
          </div>
        ),
      },
    ],
    [cdn, locale],
  );

  return (
    <>
      <PageHeroSection heroImages={[`${cdn}/outside-patio.jpg`]}>
        <div className="mx-auto flex w-full max-w-5xl flex-col items-center">
          <p className={`mb-5 inline-flex items-center gap-2 ${kickerClass}`}>
            <span className="inline-flex h-6 items-center rounded-full border border-paper/15 bg-paper/5 px-3">
              {t(locale, "page.storyDraft.badge")}
            </span>
          </p>
          <h1 className={titleClass}>{t(locale, "page.storyDraft.title")}</h1>
          <p className={leadClass}>{t(locale, "page.storyDraft.lead")}</p>
        </div>
      </PageHeroSection>

      <section className="w-full border-t border-border bg-ink">
        <div className="mx-auto w-full max-w-[min(100%,140rem)] px-4 py-16 sm:px-6 sm:py-20 lg:px-10 lg:py-24 xl:px-14">
          <div className="flex flex-col gap-14 md:gap-17 lg:gap-24">
            {STORY_BLOCKS.map((block, i) => (
              <StoryBlockRow key={block.id} block={block} index={i} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

