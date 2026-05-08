import type { HeroMontageClip } from "@/lib/heroVideos";

const CU = "https://res.cloudinary.com/dovyrycsh/video/upload/q_auto/f_auto";

const EVENTS_CLIP_1_POSTER = "/assets/videos/events-sequence/clip-1/poster.webp";

function w(url: string): { src: string; type: "video/webm" } {
  return { src: url, type: "video/webm" };
}

const EVENTS_VIDEO_MONTAGE_CLIPS: readonly HeroMontageClip[] = [
  {
    sources: [w(`${CU}/v1778201218/a-stylish-dining-area-adorned-with-lush-plants-elegant-tables-and-warm-lighting_ksrmat.webm`)],
    posterSrc: EVENTS_CLIP_1_POSTER,
    playbackRate: 1.0,
  },
  {
    sources: [w(`${CU}/v1778201217/banquet-hall-interior-floristic-details-with-flowers-in-glass-vases-filled-with-water_w3xg0k.webm`)],
    playbackRate: 1.05,
  },
  {
    sources: [w(`${CU}/v1778201218/catering-buffet-food-in-luxury-venue-people-take-food-close-up_pspc1l.webm`)],
    playbackRate: 1.05,
  },
  {
    sources: [w(`${CU}/v1778201218/catering-event-a-buffet-table-with-chilled-champagne-and-a-lot-of-glasses_bgokty.webm`)],
    playbackRate: 1.05,
  },
  {
    sources: [w(`${CU}/v1778201217/close-up-view-of-served-table-with-plates-as-a-decoration-at-the-party-in-restaurant_vu6tch.webm`)],
    playbackRate: 1.05,
  },
  {
    sources: [w(`${CU}/v1778201216/party-decoration-in-palace_zka1zj.webm`)],
    playbackRate: 1.05,
  },
  {
    sources: [w(`${CU}/v1778201218/the-waiter-or-bartender-pours-champagne-from-a-bottle-into-glasses_fqm6ya.webm`)],
    playbackRate: 1.05,
  },
] as const;

export function getEventsMontageClips(): HeroMontageClip[] {
  return [...EVENTS_VIDEO_MONTAGE_CLIPS];
}
