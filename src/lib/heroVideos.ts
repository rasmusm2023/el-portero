/**
 * Curated hero montage — alternates zones (bar → kitchen → …) so shots never repeat back-to-back.
 * Paths are served from `public/videos`.
 *
 * `playbackRate` stretches or compresses the visible slice; each clip still shows at most
 * ~{@link HERO_MONTAGE_CLIP_MS} of wall-clock time.
 */
export const HERO_MONTAGE_CLIP_MS = 3000;

export type HeroMontageClip = {
  src: string;
  /** Defaults to `1`. Above 1 plays faster (snappier motion in the same wall time). */
  playbackRate?: number;
  /**
   * Max time this clip stays on screen before crossfading (ms). Defaults to
   * {@link HERO_MONTAGE_CLIP_MS}. Use shorter values for long stock previews.
   */
  visibleMs?: number;
  /**
   * CSS `object-position` for `object-cover` (e.g. `"50% 70%"`).
   * Use to bias framing toward food/hands when stock footage centers people.
   */
  objectPosition?: string;
  /**
   * Zoom past default `object-cover` (e.g. `1.22`) to crop faces / background;
   * pairs with `objectPosition` and `transformOrigin`.
   */
  objectScale?: number;
  /** CSS `transform-origin` for {@link objectScale} — match the focal point. */
  transformOrigin?: string;
};

const HERO_VIDEO_MONTAGE_CLIPS: readonly HeroMontageClip[] = [
  { src: "/videos/skilled-bartender-expertly-mixing-cocktail-ingredients-at-bar-counter-SBV-333451099-preview.mp4", playbackRate: 1.25 },
  {
    src: "/videos/chef-frying-ribs-with-flambe-technique-professional-cheif-cooking-pork-meat-in-SBV-346803382-preview.mp4",
    playbackRate: 1.25,
    /** Pan / ribs / flame — tight on hands and pan. */
    objectPosition: "50% 68%",
    objectScale: 1.26,
    transformOrigin: "50% 68%",
  },
  {
    src: "/videos/barman-making-cocktails-with-whiskey-liquor-alcohol-at-the-bar-at-night-with-r-SBV-352400945-preview.mp4",
    playbackRate: 1.2,
    /** Tight cut; montage timer must not fire before crossfade ends (see HeroVideoMontage FADE_MS). */
    visibleMs: 2400,
  },
  {
    /** Replaced tilt-down clip: original file decoded erratically in Firefox (`NS_ERROR_DOM_MEDIA_METADATA_ERR`). */
    src: "/videos/unrecognizable-chef-cutting-vegetables-indoors-in-restaurant-kitchen-SBV-346819734-preview.mp4",
    playbackRate: 1.15,
    objectPosition: "50% 72%",
    objectScale: 1.22,
    transformOrigin: "50% 72%",
  },
  { src: "/videos/multiethnic-friends-enjoy-brunch-in-sunny-cafe-women-savor-healthy-meals-laugh-SBV-349017419-preview.mp4", playbackRate: 1.15 },
  { src: "/videos/aerial-view-of-torrevieja-spain-at-a-popular-tourist-promenade-in-torrevieja-a-SBV-352850732-preview.mp4", playbackRate: 0.95 },
] as const;

export function getHeroMontageClips(): HeroMontageClip[] {
  return [...HERO_VIDEO_MONTAGE_CLIPS];
}
