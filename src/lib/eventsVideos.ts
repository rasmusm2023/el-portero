import type { HeroMontageClip } from "@/lib/heroVideos";
import { cloudinaryAdaptiveVideoSources } from "@/lib/cloudinaryAdaptiveVideoSources";
import { CLOUDINARY_IMG } from "@/lib/cloudinaryStillImages";

const EVENTS_CLIP_1_POSTER = CLOUDINARY_IMG.eventsClip1Poster.webp;

const EVENTS_VIDEO_MONTAGE_CLIPS: readonly HeroMontageClip[] = [
  {
    sources: cloudinaryAdaptiveVideoSources(
      "v1778201218/a-stylish-dining-area-adorned-with-lush-plants-elegant-tables-and-warm-lighting_ksrmat",
    ),
    posterSrc: EVENTS_CLIP_1_POSTER,
    playbackRate: 1.0,
  },
  {
    sources: cloudinaryAdaptiveVideoSources(
      "v1778201217/banquet-hall-interior-floristic-details-with-flowers-in-glass-vases-filled-with-water_w3xg0k",
    ),
    playbackRate: 1.05,
  },
  {
    sources: cloudinaryAdaptiveVideoSources(
      "v1778201218/catering-buffet-food-in-luxury-venue-people-take-food-close-up_pspc1l",
    ),
    playbackRate: 1.05,
  },
  {
    sources: cloudinaryAdaptiveVideoSources(
      "v1778201218/catering-event-a-buffet-table-with-chilled-champagne-and-a-lot-of-glasses_bgokty",
    ),
    playbackRate: 1.05,
  },
  {
    sources: cloudinaryAdaptiveVideoSources(
      "v1778201217/close-up-view-of-served-table-with-plates-as-a-decoration-at-the-party-in-restaurant_vu6tch",
    ),
    playbackRate: 1.05,
  },
  {
    sources: cloudinaryAdaptiveVideoSources(
      "v1778201216/party-decoration-in-palace_zka1zj",
    ),
    playbackRate: 1.05,
  },
  {
    sources: cloudinaryAdaptiveVideoSources(
      "v1778201218/the-waiter-or-bartender-pours-champagne-from-a-bottle-into-glasses_fqm6ya",
    ),
    playbackRate: 1.05,
  },
] as const;

export function getEventsMontageClips(): HeroMontageClip[] {
  return [...EVENTS_VIDEO_MONTAGE_CLIPS];
}
