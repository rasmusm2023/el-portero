import type { HeroMontageClip } from "@/lib/heroVideos";

function clipSrc(
  clip: number,
  filename: "video.webm" | "video.mp4" | "poster.webp",
): string {
  return `/assets/videos/events-sequence/clip-${clip}/${filename}`;
}

function eventsClip(
  clip: number,
  opts: Omit<HeroMontageClip, "sources"> & { includePoster?: boolean } = {},
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

const EVENTS_VIDEO_MONTAGE_CLIPS: readonly HeroMontageClip[] = [
  eventsClip(1, { playbackRate: 1.0, includePoster: true }),
  eventsClip(2, { playbackRate: 1.05 }),
  eventsClip(3, { playbackRate: 1.05 }),
  eventsClip(4, { playbackRate: 1.05 }),
  eventsClip(5, { playbackRate: 1.05 }),
  eventsClip(6, { playbackRate: 1.05 }),
  eventsClip(7, { playbackRate: 1.05 }),
] as const;

export function getEventsMontageClips(): HeroMontageClip[] {
  return [...EVENTS_VIDEO_MONTAGE_CLIPS];
}

