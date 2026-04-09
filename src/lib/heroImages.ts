import { readdirSync } from "fs";
import { join } from "path";

const IMAGE_EXT = /\.(jpe?g|png|webp|gif)$/i;

/** Paths under `/images/` for files in `public/images` (sorted, for hero slideshow). */
export function getHeroSlideImages(): string[] {
  const dir = join(process.cwd(), "public", "images");
  try {
    const files = readdirSync(dir)
      .filter((f) => f !== ".gitkeep" && IMAGE_EXT.test(f))
      .sort((a, b) => a.localeCompare(b, undefined, { sensitivity: "base" }));
    return files.map((f) => `/images/${encodeURIComponent(f)}`);
  } catch {
    return [];
  }
}
