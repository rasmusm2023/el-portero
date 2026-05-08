/**
 * Dual delivery for Cloudinary-hosted montage clips:
 *
 * 1. **WebM** (`q_auto/f_auto/<webmPublicId>.webm`) — preferred on desktop Chrome/Firefox (Gecko/Blink).
 * 2. **Uploaded H.264 MP4** — same clip title as WebM `public_id` basename, stored under
 *    {@link CLOUDINARY_MOBILE_MP4_UPLOAD_VERSION} (see Media Library “mp4” batch). Browsers that
 *    cannot play WebM in `<video>` (all WebKit on iOS, including Firefox/Chrome there) use this
 *    `<source>` instead.
 *
 * `<source>` order is WebM then MP4; the engine picks the first supported format.
 */
export const CLOUDINARY_MP4_BASE =
  "https://res.cloudinary.com/dovyrycsh/video/upload/q_auto/f_auto";

/** Version folder for manually uploaded MP4 masters (same basename as companion WebM id). */
export const CLOUDINARY_MOBILE_MP4_UPLOAD_VERSION = "v1778230640";

function normalizeStem(raw: string): string {
  return raw
    .trim()
    .replace(/^\/+/, "")
    .replace(/\.(webm|mp4)$/i, "");
}

/** Public id segment after the last `/` (e.g. `…/foo_bar_baz` → `foo_bar_baz`). */
function stemBasename(stem: string): string {
  const s = normalizeStem(stem);
  const i = s.lastIndexOf("/");
  return i === -1 ? s : s.slice(i + 1);
}

/**
 * @param webmStem — full WebM public id without extension, e.g.
 *   `v1778200314/two-guests-enjoying-restaurant-dinner-and-wine-with-cozy-lighting_yputhv`
 */
export function cloudinaryAdaptiveVideoSources(
  webmStem: string,
): { src: string; type: "video/webm" | "video/mp4" }[] {
  const w = normalizeStem(webmStem);
  const mp4Relative = `${CLOUDINARY_MOBILE_MP4_UPLOAD_VERSION}/${stemBasename(w)}`;
  return [
    { src: `${CLOUDINARY_MP4_BASE}/${w}.webm`, type: "video/webm" },
    { src: `${CLOUDINARY_MP4_BASE}/${mp4Relative}.mp4`, type: "video/mp4" },
  ];
}
