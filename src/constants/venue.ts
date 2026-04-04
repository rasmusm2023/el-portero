/** Single source of truth for the restaurant address and map links. */
export const VENUE_ADDRESS =
  "C. Ulpiano, 28, 03182 Torrevieja, Alicante, Spain";

export function googleMapsSearchUrl(): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(VENUE_ADDRESS)}`;
}

/** Embeddable map (no API key) — interactive pan/zoom inside the iframe. */
export function googleMapsEmbedUrl(): string {
  return `https://www.google.com/maps?q=${encodeURIComponent(VENUE_ADDRESS)}&output=embed`;
}
