/**
 * Curated hero montage — Bunny.net-hosted WebM + MP4 pairs.
 *
 * `playbackRate` stretches or compresses the visible slice; each clip still shows at most
 * ~{@link HERO_MONTAGE_CLIP_MS} of wall-clock time.
 */
import { BUNNY_IMG, bunnyVideoSources } from "@/lib/bunnyMedia";

export const HERO_MONTAGE_CLIP_MS = 3000;

export type HeroMontageClip = {
  /** WebM first; MP4 fallback for WebKit / iOS. */
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

/** Poster while first frame loads. */
const HERO_CLIP_1_POSTER = BUNNY_IMG.heroClip1Poster.src;

/**
 * 13 clips: old local clip-5 removed; former clip-14 plays in that slot (index 5).
 */
const HERO_VIDEO_MONTAGE_CLIPS: readonly HeroMontageClip[] = [
  {
    sources: bunnyVideoSources(
      "https://el-portero.b-cdn.net/videos/8s_two-guests-enjoying-restaurant-dinner-and-wine-with-cozy-lighting_yputhv.webm",
      "https://el-portero.b-cdn.net/videos/8s_two-guests-enjoying-restaurant-dinner-and-wine-with-cozy-lighting.mp4",
    ),
    posterSrc: HERO_CLIP_1_POSTER,
    playbackRate: 1.05,
  },
  {
    sources: bunnyVideoSources(
      "https://el-portero.b-cdn.net/videos/8s_professional-chef-preparing-meal-flambing-indoors-in-restaurant-kitchen_y0dujr.webm",
      "https://el-portero.b-cdn.net/videos/8s_professional-chef-preparing-meal-flambing-indoors-in-restaurant-kitchen.mp4",
    ),
    playbackRate: 1.05,
    objectPosition: "35% 55%",
    objectScale: 1.72,
    transformOrigin: "35% 55%",
  },
  {
    sources: bunnyVideoSources(
      "https://el-portero.b-cdn.net/videos/8s_skilled-bartender-expertly-mixing-cocktail-ingredients-at-bar-counter_p6rnow.webm",
      "https://el-portero.b-cdn.net/videos/8s_skilled-bartender-expertly-mixing-cocktail-ingredients-at-bar-counter.mp4",
    ),
    playbackRate: 1.1,
  },
  {
    sources: bunnyVideoSources(
      "https://el-portero.b-cdn.net/videos/8s_steak-cooking-in-pan-and-being-basted-with-butter-and-rosemary-stalk_cylbbu.webm",
      "https://el-portero.b-cdn.net/videos/8s_steak-cooking-in-pan-and-being-basted-with-butter-and-rosemary-stalk.mp4",
    ),
    playbackRate: 1.1,
  },
  // Former local clip-14 asset in place of removed clip-5.
  {
    sources: bunnyVideoSources(
      "https://el-portero.b-cdn.net/videos/8s_professional-chef-is-preparing-meal-2_ojq8ie.webm",
      "https://el-portero.b-cdn.net/videos/8s_professional-chef-is-preparing-meal-2.mp4",
    ),
    playbackRate: 1.02,
    objectPosition: "50% 70%",
  },
  {
    sources: bunnyVideoSources(
      "https://el-portero.b-cdn.net/videos/8s_aerial-view-of-torrevieja-spain-at-a-popular-tourist-promenade-in-torrevieja_t15yrg.webm",
      "https://el-portero.b-cdn.net/videos/8s_aerial-view-of-torrevieja-spain-at-a-popular-tourist-promenade-in-torrevieja.mp4",
    ),
    playbackRate: 0.95,
  },
  {
    sources: bunnyVideoSources(
      "https://el-portero.b-cdn.net/videos/8s_barman-making-cocktails-with-whiskey-liquor-alcohol-at-the-bar-at-night_sj5eq1.webm",
      "https://el-portero.b-cdn.net/videos/8s_barman-making-cocktails-with-whiskey-liquor-alcohol-at-the-bar-at-night.mp4",
    ),
    playbackRate: 1.12,
  },
  {
    sources: bunnyVideoSources(
      "https://el-portero.b-cdn.net/videos/8s_grilled-meat-and-vegetable-skewers-on-plate_gjxfi3.webm",
      "https://el-portero.b-cdn.net/videos/8s_grilled-meat-and-vegetable-skewers-on-plate.mp4",
    ),
    playbackRate: 1.05,
  },
  {
    sources: bunnyVideoSources(
      "https://el-portero.b-cdn.net/videos/8s_unrecognizable-chef-cutting-vegetables-indoors-in-restaurant-kitchen_lffelw.webm",
      "https://el-portero.b-cdn.net/videos/8s_unrecognizable-chef-cutting-vegetables-indoors-in-restaurant-kitchen.mp4",
    ),
    playbackRate: 1.1,
  },
  {
    sources: bunnyVideoSources(
      "https://el-portero.b-cdn.net/videos/8s_chefs-final-touches-on-plate-adding-garnish-on-meat_jwdl1m.webm",
      "https://el-portero.b-cdn.net/videos/8s_chefs-final-touches-on-plate-adding-garnish-on-meat.mp4",
    ),
    playbackRate: 1.02,
    objectPosition: "50% 62%",
  },
  {
    sources: bunnyVideoSources(
      "https://el-portero.b-cdn.net/videos/8s_male-hands-pouring-souce-and-seasoning-avocado-salad-in-restaurant-kitchen_utpzaq.webm",
      "https://el-portero.b-cdn.net/videos/8s_male-hands-pouring-souce-and-seasoning-avocado-salad-in-restaurant-kitchen.mp4",
    ),
    playbackRate: 1.06,
    objectPosition: "50% 62%",
  },
  {
    sources: bunnyVideoSources(
      "https://el-portero.b-cdn.net/videos/8s_pouring-souce-on-avocado-salad-with-grilled-chicken-meat-in-restaurant-kitchen_vtdnh4.webm",
      "https://el-portero.b-cdn.net/videos/8s_pouring-souce-on-avocado-salad-with-grilled-chicken-meat-in-restaurant-kitchen.mp4",
    ),
    playbackRate: 1.05,
    objectPosition: "50% 62%",
  },
  {
    sources: bunnyVideoSources(
      "https://el-portero.b-cdn.net/videos/8s_professional-chef-is-preparing-meal_h9kveu.webm",
      "https://el-portero.b-cdn.net/videos/8s_professional-chef-is-preparing-meal.mp4",
    ),
    playbackRate: 1.05,
    objectPosition: "50% 68%",
  },
] as const;

export function getHeroMontageClips(): HeroMontageClip[] {
  return [...HERO_VIDEO_MONTAGE_CLIPS];
}
