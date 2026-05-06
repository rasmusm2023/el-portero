"use client";

import Image from "next/image";
import Link from "next/link";
import { PageHeroSection } from "@/components/PageHeroSection";
import { PageShell } from "@/components/layout/PageShell";
import type { StoryContentImages } from "@/data/storyContentImages";
import { useLocale } from "@/i18n/useLocale";
import { t } from "@/i18n/strings";

type StoryPageProps = {
  heroImages: string[];
  contentImages: StoryContentImages;
};

const h2 = "font-display text-2xl font-medium tracking-tight text-paper sm:text-3xl";

const body = "text-ink-muted leading-relaxed sm:text-lg";

function StoryImageFrame({
  src,
  alt,
  aspectClassName,
  sizes,
  priority,
}: {
  src: string;
  alt: string;
  aspectClassName: string;
  sizes: string;
  priority?: boolean;
}) {
  return (
    <div
      className={`relative w-full overflow-hidden rounded-2xl bg-paper-dark/25 ring-1 ring-ink/10 shadow-[0_20px_50px_-24px_rgba(0,0,0,0.18)] ${aspectClassName}`}
    >
      <Image
        src={src}
        alt={alt}
        fill
        className="object-cover"
        sizes={sizes}
        priority={priority}
      />
    </div>
  );
}

export function StoryPage({ heroImages, contentImages }: StoryPageProps) {
  const { locale } = useLocale();

  return (
    <>
      <PageHeroSection heroImages={heroImages}>
        <h1 className="font-hero-title text-[clamp(2.25rem,6vw,4.25rem)] font-normal leading-[1.05] tracking-[0.14em] text-paper uppercase">
          {t(locale, "page.story.title")}
        </h1>
        <p className="mx-auto mt-8 max-w-2xl font-sans text-base leading-[1.75] text-paper/85 sm:mt-10 sm:text-lg">
          {t(locale, "page.story.intro")}
        </p>
      </PageHeroSection>

      <PageShell showDocumentHeader={false}>
        <div className="mx-auto max-w-5xl space-y-16 sm:space-y-20 lg:space-y-24">
          {/* Magnus: image left on desktop — opens the personal story */}
          <section
            aria-labelledby="story-magnus-heading"
            className="grid gap-10 border-b border-border/70 pb-16 sm:gap-12 sm:pb-20 lg:grid-cols-2 lg:items-center lg:gap-14"
          >
            <div>
              <StoryImageFrame
                src={contentImages.magnus}
                alt={t(locale, "page.story.photoAltMagnus")}
                aspectClassName="aspect-[4/3] lg:aspect-[5/6] min-h-[220px]"
                sizes="(max-width: 1024px) 100vw, 45vw"
                priority
              />
            </div>
            <div>
              <h2 id="story-magnus-heading" className={h2}>
                {t(locale, "page.story.sectionMagnusTitle")}
              </h2>
              <p className={`mt-5 ${body}`}>{t(locale, "page.story.sectionMagnusP1")}</p>
              <p className={`mt-4 ${body}`}>{t(locale, "page.story.sectionMagnusP2")}</p>
            </div>
          </section>

          {/* Origin: text first on mobile; image on the right on large screens */}
          <section
            aria-labelledby="story-origin-heading"
            className="grid gap-10 border-b border-border/70 pb-16 sm:gap-12 sm:pb-20 lg:grid-cols-2 lg:items-center lg:gap-14"
          >
            <div className="order-2 lg:order-1">
              <h2 id="story-origin-heading" className={h2}>
                {t(locale, "page.story.sectionOriginTitle")}
              </h2>
              <p className={`mt-5 ${body}`}>{t(locale, "page.story.sectionOriginP1")}</p>
              <p className={`mt-4 ${body}`}>{t(locale, "page.story.sectionOriginP2")}</p>
            </div>
            <div className="order-1 lg:order-2">
              <StoryImageFrame
                src={contentImages.origin}
                alt={t(locale, "page.story.photoAltOrigin")}
                aspectClassName="aspect-[4/3] lg:aspect-[5/6] min-h-[220px]"
                sizes="(max-width: 1024px) 100vw, 45vw"
              />
            </div>
          </section>

          {/* Philosophy: copy + three-image mosaic */}
          <section
            aria-labelledby="story-philosophy-heading"
            className="border-b border-border/70 pb-16 sm:pb-20"
          >
            <h2 id="story-philosophy-heading" className={h2}>
              {t(locale, "page.story.sectionPhilosophyTitle")}
            </h2>
            <p className={`mt-5 max-w-3xl ${body}`}>
              {t(locale, "page.story.sectionPhilosophyBody")}
            </p>

            <div className="mt-10 grid gap-3 sm:grid-cols-3 sm:gap-4">
              <div className="relative aspect-[4/5] overflow-hidden rounded-xl bg-paper-dark/25 ring-1 ring-ink/10 sm:aspect-[3/4]">
                <Image
                  src={contentImages.tileA}
                  alt={t(locale, "page.story.photoAltTileA")}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, 33vw"
                />
              </div>
              <div className="relative aspect-[4/5] overflow-hidden rounded-xl bg-paper-dark/25 ring-1 ring-ink/10 sm:aspect-[3/4]">
                <Image
                  src={contentImages.tileB}
                  alt={t(locale, "page.story.photoAltTileB")}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, 33vw"
                />
              </div>
              <div className="relative aspect-[4/5] overflow-hidden rounded-xl bg-paper-dark/25 ring-1 ring-ink/10 sm:aspect-[3/4]">
                <Image
                  src={contentImages.tileC}
                  alt={t(locale, "page.story.photoAltTileC")}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, 33vw"
                />
              </div>
            </div>
          </section>

          {/* Coast: wide scene, then copy + CTAs */}
          <section aria-labelledby="story-coast-heading" className="pb-4">
            <StoryImageFrame
              src={contentImages.coast}
              alt={t(locale, "page.story.photoAltCoast")}
              aspectClassName="aspect-[21/9] min-h-[160px] sm:min-h-[200px]"
              sizes="(max-width: 1024px) 100vw, 64rem"
            />
            <h2 id="story-coast-heading" className={`${h2} mt-10 sm:mt-12`}>
              {t(locale, "page.story.sectionCoastTitle")}
            </h2>
            <p className={`mt-5 max-w-3xl ${body}`}>
              {t(locale, "page.story.sectionCoastBody")}
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                href="/reserve"
                className="inline-flex min-h-12 items-center justify-center rounded-none border-0 bg-ink px-10 py-3.5 font-sans text-xs font-bold tracking-[0.22em] text-paper uppercase transition-[background-color,box-shadow,transform] hover:-translate-y-0.5 hover:bg-ink/90 hover:shadow-[0_14px_36px_-14px_rgba(0,0,0,0.35)] sm:min-h-13 sm:px-12 sm:text-sm sm:tracking-[0.24em]"
                aria-label={t(locale, "page.story.ctaReserveAria")}
              >
                {t(locale, "page.story.ctaReserve")}
              </Link>
              <Link
                href="/contact"
                className="inline-flex min-h-12 items-center justify-center rounded-none border border-paper/25 bg-transparent px-8 py-3.5 font-sans text-xs font-semibold tracking-[0.18em] text-paper uppercase transition-colors hover:border-gold/45 hover:bg-paper/5 sm:px-10 sm:text-sm"
              >
                {t(locale, "page.contact.title")}
              </Link>
            </div>
          </section>
        </div>
      </PageShell>
    </>
  );
}
