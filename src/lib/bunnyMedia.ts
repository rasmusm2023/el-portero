export type BunnyStill = {
  src: string;
};

export const BUNNY_IMG = {
  heroAccentDish: { src: "https://el-portero.b-cdn.net/images/el-portero-dish-4.jpg" },
  galleryTostada: { src: "https://el-portero.b-cdn.net/images/el-portero-tostada.jpg" },
  /** Former `public/images/food.png` — gallery row 2 anchor. */
  sevenTonguedDish: { src: "https://el-portero.b-cdn.net/images/seven-tongued-dish.jpg" },
  galleryDish1: { src: "https://el-portero.b-cdn.net/images/el-portero-dish-1.jpg" },
  galleryDish2: { src: "https://el-portero.b-cdn.net/images/el-portero-dish-2.jpg" },
  galleryDish3: { src: "https://el-portero.b-cdn.net/images/el-portero-dish-3.jpg" },
  heroClip1Poster: { src: "https://el-portero.b-cdn.net/images/home-poster.jpg" },
  eventsClip1Poster: { src: "https://el-portero.b-cdn.net/images/event-poster.jpg" },
} as const satisfies Record<string, BunnyStill>;

export function bunnyVideoSources(
  webm: string,
  mp4: string,
): { src: string; type: "video/webm" | "video/mp4" }[] {
  return [
    { src: webm, type: "video/webm" },
    { src: mp4, type: "video/mp4" },
  ];
}

