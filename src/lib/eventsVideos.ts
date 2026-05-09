import type { HeroMontageClip } from "@/lib/heroVideos";
import { bunnyVideoSources } from "@/lib/bunnyMedia";

export function getEventsMontageClips(): HeroMontageClip[] {
  return [
    {
      sources: bunnyVideoSources(
        "https://el-portero.b-cdn.net/videos/el-portero-events-hero-sequence.webm",
        "https://el-portero.b-cdn.net/videos/el-portero-events-hero-sequence.mp4",
      ),
      playbackRate: 1,
    },
  ];
}
