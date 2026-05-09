/**
 * Curated hero montage — Cloudinary WebM plus uploaded H.264 MP4 for WebKit / iOS (see `cloudinaryAdaptiveVideoSources`).
 *
 * `playbackRate` stretches or compresses the visible slice; each clip still shows at most
 * ~{@link HERO_MONTAGE_CLIP_MS} of wall-clock time.
 */
import { cloudinaryAdaptiveVideoSources } from "@/lib/cloudinaryAdaptiveVideoSources";
import { CLOUDINARY_IMG } from "@/lib/cloudinaryStillImages";

export const HERO_MONTAGE_CLIP_MS = 3000;

export type HeroMontageClip = {
  /** WebM first; second source is uploaded MP4 (see `CLOUDINARY_MOBILE_MP4_UPLOAD_VERSION`). */
  sources: { src: string; type: "video/webm" | "video/mp4" }[];
  /** Optional poster image shown before first frame is ready. */
  posterSrc?: string;
  /** Defaults to `1`. Above 1 plays faster (snappier motion in the same wall time). */
  playbackRate?: number;
  /**
   * Max time this clip stays on screen before crossfading (ms). Defaults to
   * {@link HERO_MONTAGE_CLIP_MS}. Use shorter values for long stock previews.
   */
  visibleMs?: number;
  /**
   * CSS `object-position` for `object-cover` (e.g. `"50% 70%"`).
   */
  objectPosition?: string;
  /**
   * Zoom past default `object-cover` (e.g. `1.22`) to crop faces / background;
   * pairs with `objectPosition` and `transformOrigin`.
   */
  objectScale?: number;
  /** CSS `transform-origin` for {@link objectScale}. */
  transformOrigin?: string;
};

/** Local poster while first Cloudinary frame loads. */
const HERO_CLIP_1_POSTER = CLOUDINARY_IMG.heroClip1Poster.webp;

/**
 * 13 clips: old local clip-5 removed; former clip-14 plays in that slot (index 5).
 */
const HERO_VIDEO_MONTAGE_CLIPS: readonly HeroMontageClip[] = [
  {
    sources: cloudinaryAdaptiveVideoSources(
      "v1778200314/two-guests-enjoying-restaurant-dinner-and-wine-with-cozy-lighting_yputhv",
    ),
    posterSrc: HERO_CLIP_1_POSTER,
    playbackRate: 1.05,
  },
  {
    sources: cloudinaryAdaptiveVideoSources(
      "v1778200254/professional-chef-preparing-meal-flambing-indoors-in-restaurant-kitchen_y0dujr",
    ),
    playbackRate: 1.05,
    objectPosition: "35% 55%",
    objectScale: 1.72,
    transformOrigin: "35% 55%",
  },
  {
    sources: cloudinaryAdaptiveVideoSources(
      "v1778200262/skilled-bartender-expertly-mixing-cocktail-ingredients-at-bar-counter_p6rnow",
    ),
    playbackRate: 1.1,
  },
  {
    sources: cloudinaryAdaptiveVideoSources(
      "v1778200347/steak-cooking-in-pan-and-being-basted-with-butter-and-rosemary-stalk_cylbbu",
    ),
    playbackRate: 1.1,
  },
  // Former local clip-14 asset in place of removed clip-5.
  {
    sources: cloudinaryAdaptiveVideoSources(
      "v1778200259/professional-chef-is-preparing-meal-2_ojq8ie",
    ),
    playbackRate: 1.02,
    objectPosition: "50% 70%",
  },
  {
    sources: cloudinaryAdaptiveVideoSources(
      "v1778200327/aerial-view-of-torrevieja-spain-at-a-popular-tourist-promenade-in-torrevieja_t15yrg",
    ),
    playbackRate: 0.95,
  },
  {
    sources: cloudinaryAdaptiveVideoSources(
      "v1778200263/barman-making-cocktails-with-whiskey-liquor-alcohol-at-the-bar-at-night_sj5eq1",
    ),
    playbackRate: 1.12,
  },
  {
    sources: cloudinaryAdaptiveVideoSources(
      "v1778200266/grilled-meat-and-vegetable-skewers-on-plate_gjxfi3",
    ),
    playbackRate: 1.05,
  },
  {
    sources: cloudinaryAdaptiveVideoSources(
      "v1778200256/unrecognizable-chef-cutting-vegetables-indoors-in-restaurant-kitchen_lffelw",
    ),
    playbackRate: 1.1,
  },
  {
    sources: cloudinaryAdaptiveVideoSources(
      "v1778200319/chefs-final-touches-on-plate-adding-garnish-on-meat_jwdl1m",
    ),
    playbackRate: 1.02,
    objectPosition: "50% 62%",
  },
  {
    sources: cloudinaryAdaptiveVideoSources(
      "v1778200260/male-hands-pouring-souce-and-seasoning-avocado-salad-in-restaurant-kitchen_utpzaq",
    ),
    playbackRate: 1.06,
    objectPosition: "50% 62%",
  },
  {
    sources: cloudinaryAdaptiveVideoSources(
      "v1778200263/pouring-souce-on-avocado-salad-with-grilled-chicken-meat-in-restaurant-kitchen_vtdnh4",
    ),
    playbackRate: 1.05,
    objectPosition: "50% 62%",
  },
  {
    sources: cloudinaryAdaptiveVideoSources(
      "v1778200260/professional-chef-is-preparing-meal_h9kveu",
    ),
    playbackRate: 1.05,
    objectPosition: "50% 68%",
  },
] as const;

export function getHeroMontageClips(): HeroMontageClip[] {
  return [...HERO_VIDEO_MONTAGE_CLIPS];
}
