/**
 * Curated hero montage — alternates zones (bar → kitchen → …) so shots never repeat back-to-back.
 * Paths are served from `public/assets/videos`.
 *
 * `playbackRate` stretches or compresses the visible slice; each clip still shows at most
 * ~{@link HERO_MONTAGE_CLIP_MS} of wall-clock time.
 */
export const HERO_MONTAGE_CLIP_MS = 3000;

export type HeroMontageClip = {
  /** Prefer WebM first, then MP4 fallback. */
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

function clipSrc(
  clip: number,
  filename: "video.webm" | "video.mp4" | "poster.webp",
): string {
  return `/assets/videos/hero-sequence/clip-${clip}/${filename}`;
}

function heroClip(
  clip: number,
  opts: Omit<HeroMontageClip, "sources"> & {
    includePoster?: boolean;
  } = {},
): HeroMontageClip {
  const { includePoster, ...rest } = opts;
  return {
    sources: [
      { src: clipSrc(clip, "video.webm"), type: "video/webm" },
      { src: clipSrc(clip, "video.mp4"), type: "video/mp4" },
    ],
    posterSrc: includePoster ? clipSrc(clip, "poster.webp") : undefined,
    ...rest,
  };
}

const HERO_VIDEO_MONTAGE_CLIPS: readonly HeroMontageClip[] = [
  // Folder indices now match PLAYBACK order (clip-1..clip-14).
  // People (dinner table) → cooking (fire/pan) → bartender → food → cooking → scenery → drinks → food → cooking …
  heroClip(1, { playbackRate: 1.05, includePoster: true }),
  // Old clip-20: zoom into pan/fire/hands to avoid face.
  heroClip(2, {
    playbackRate: 1.05,
    objectPosition: "35% 55%",
    objectScale: 1.72,
    transformOrigin: "35% 55%",
  }),
  // Old clip-21: bartender at bar.
  heroClip(3, { playbackRate: 1.1 }),
  // Old clip-2: steak close-up.
  heroClip(4, { playbackRate: 1.1 }),
  // Old clip-11: pan close-up.
  heroClip(5, { playbackRate: 1.08 }),
  // Old clip-4: scenery.
  heroClip(6, { playbackRate: 0.95 }),
  // Old clip-5: drinks pouring.
  heroClip(7, { playbackRate: 1.12 }),
  // Old clip-15: skewers.
  heroClip(8, { playbackRate: 1.05 }),
  // Old clip-22: chopping.
  heroClip(9, { playbackRate: 1.1 }),
  // Old clip-3: plating (chef blurred in background).
  heroClip(10, { playbackRate: 1.02, objectPosition: "50% 62%" }),
  // Old clip-16: salad drizzle.
  heroClip(11, { playbackRate: 1.06, objectPosition: "50% 62%" }),
  // Old clip-17: chicken close-up.
  heroClip(12, { playbackRate: 1.05, objectPosition: "50% 62%" }),
  // Old clip-18: plating on slate.
  heroClip(13, { playbackRate: 1.05, objectPosition: "50% 68%" }),
  // Old clip-19: plating on slate (alt angle).
  heroClip(14, { playbackRate: 1.02, objectPosition: "50% 70%" }),
] as const;

export function getHeroMontageClips(): HeroMontageClip[] {
  return [...HERO_VIDEO_MONTAGE_CLIPS];
}
