import type { HeroMontageClip } from "@/lib/heroVideos";
import { BUNNY_IMG, bunnyVideoSources } from "@/lib/bunnyMedia";

const EVENTS_CLIP_1_POSTER = BUNNY_IMG.eventsClip1Poster.src;

const EVENTS_VIDEO_MONTAGE_CLIPS: readonly HeroMontageClip[] = [
  {
    sources: bunnyVideoSources(
      "https://el-portero.b-cdn.net/videos/8s_a-stylish-dining-area-adorned-with-lush-plants-elegant-tables-and-warm-lighting_ksrmat.webm",
      "https://el-portero.b-cdn.net/videos/8s_a-stylish-dining-area-adorned-with-lush-plants-elegant-tables-and-warm-lighting.mp4",
    ),
    posterSrc: EVENTS_CLIP_1_POSTER,
    playbackRate: 1.0,
  },
  {
    sources: bunnyVideoSources(
      "https://el-portero.b-cdn.net/videos/8s_banquet-hall-interior-floristic-details-with-flowers-in-glass-vases-filled-with-water_w3xg0k.webm",
      "https://el-portero.b-cdn.net/videos/8s_banquet-hall-interior-floristic-details-with-flowers-in-glass-vases-filled-with-water.mp4",
    ),
    playbackRate: 1.05,
  },
  {
    sources: bunnyVideoSources(
      "https://el-portero.b-cdn.net/videos/8s_catering-buffet-food-in-luxury-venue-people-take-food-close-up_pspc1l.webm",
      "https://el-portero.b-cdn.net/videos/8s_catering-buffet-food-in-luxury-venue-people-take-food-close-up.mp4",
    ),
    playbackRate: 1.05,
  },
  {
    sources: bunnyVideoSources(
      "https://el-portero.b-cdn.net/videos/8s_catering-event-a-buffet-table-with-chilled-champagne-and-a-lot-of-glasses_bgokty.webm",
      "https://el-portero.b-cdn.net/videos/8s_catering-event-a-buffet-table-with-chilled-champagne-and-a-lot-of-glasses.mp4",
    ),
    playbackRate: 1.05,
  },
  {
    sources: bunnyVideoSources(
      "https://el-portero.b-cdn.net/videos/8s_close-up-view-of-served-table-with-plates-as-a-decoration-at-the-party-in-restaurant_vu6tch.webm",
      "https://el-portero.b-cdn.net/videos/8s_close-up-view-of-served-table-with-plates-as-a-decoration-at-the-party-in-restaurant.mp4",
    ),
    playbackRate: 1.05,
  },
  {
    sources: bunnyVideoSources(
      "https://el-portero.b-cdn.net/videos/8s_party-decoration-in-palace_zka1zj.webm",
      "https://el-portero.b-cdn.net/videos/8s_party-decoration-in-palace.mp4",
    ),
    playbackRate: 1.05,
  },
  {
    sources: bunnyVideoSources(
      "https://el-portero.b-cdn.net/videos/8s_the-waiter-or-bartender-pours-champagne-from-a-bottle-into-glasses_fqm6ya.webm",
      "https://el-portero.b-cdn.net/videos/8s_the-waiter-or-bartender-pours-champagne-from-a-bottle-into-glasses.mp4",
    ),
    playbackRate: 1.05,
  },
] as const;

export function getEventsMontageClips(): HeroMontageClip[] {
  return [...EVENTS_VIDEO_MONTAGE_CLIPS];
}
