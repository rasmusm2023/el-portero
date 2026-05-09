/**
 * Curated hero montage — Bunny.net-hosted WebM + MP4 pairs.
 *
 * `playbackRate` stretches or compresses the visible slice; each clip still shows at most
 * ~{@link HERO_MONTAGE_CLIP_MS} of wall-clock time.
 */
import { bunnyVideoSources } from "@/lib/bunnyMedia";

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

export function getHeroMontageClips(): HeroMontageClip[] {
  return [
    {
      sources: bunnyVideoSources(
        "https://el-portero.b-cdn.net/videos/el-portero-home-hero-sequence.webm",
        "https://el-portero.b-cdn.net/videos/el-portero-home-hero-sequence.mp4",
      ),
      playbackRate: 1,
    },
  ];
}
