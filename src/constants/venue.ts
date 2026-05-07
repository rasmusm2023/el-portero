/** Single source of truth for the restaurant address and map links. */
export const VENUE_ADDRESS =
  "C. Ulpiano, 28, 03182 Torrevieja, Alicante, Spain";

export function googleMapsSearchUrl(): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(VENUE_ADDRESS)}`;
}

/**
 * Embeddable map (no API key) — interactive pan/zoom inside the iframe.
 * `z` is zoom 1–21; lower values show a wider area (default embed is often ~16).
 */
export function googleMapsEmbedUrl(): string {
  const q = encodeURIComponent(VENUE_ADDRESS);
  return `https://www.google.com/maps?q=${q}&z=15&output=embed`;
}
