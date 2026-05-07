import { readdirSync } from "fs";
import { join } from "path";
import { EVENTS_HERO_FALLBACK_URLS } from "@/data/eventsHeroFallback";
import { STORY_HERO_FALLBACK_URLS } from "@/data/storyHeroFallback";

const IMAGE_EXT = /\.(jpe?g|png|webp|gif)$/i;

/** List image files under `public/<segments>/` and return web paths (e.g. `/images/a.jpg`). */
function readImageDir(...segments: string[]): string[] {
  const dir = join(process.cwd(), "public", ...segments);
  const urlPrefix = `/${segments.join("/")}`;
  try {
    const files = readdirSync(dir)
      .filter((f) => f !== ".gitkeep" && IMAGE_EXT.test(f))
      .sort((a, b) => a.localeCompare(b, undefined, { sensitivity: "base" }));
    return files.map((f) => `${urlPrefix}/${encodeURIComponent(f)}`);
  } catch {
    return [];
  }
}

/** Single launch hero — `public/images/home-hero-img.jpg`. */
const LAUNCH_HERO_IMAGE = "/images/home-hero-img.jpg";

/** Home (and demo) hero slideshow: one image for launch. */
export function getHeroSlideImages(): string[] {
  return [LAUNCH_HERO_IMAGE];
}

/**
 * Event page hero: `public/images/events/` when present, otherwise curated fallbacks
 * (festivities / larger bookings — see `eventsHeroFallback.ts`).
 */
export function getEventsHeroSlideImages(): string[] {
  const local = readImageDir("images", "events");
  return local.length > 0 ? local : EVENTS_HERO_FALLBACK_URLS;
}

/** Story page hero: `public/images/story/` when present, otherwise curated fallbacks. */
export function getStoryHeroSlideImages(): string[] {
  const local = readImageDir("assets", "images", "story", "hero");
  return local.length > 0 ? local : STORY_HERO_FALLBACK_URLS;
}
