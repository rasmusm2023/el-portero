/** Public Instagram profile — update when the account is live. */
export const INSTAGRAM_PROFILE_URL = "https://www.instagram.com/elportero/";

/** Shown in UI (stylistic); URL uses the real handle without hyphen. */
export const INSTAGRAM_HANDLE = "@EL-PORTERO";

/**
 * Restaurant booking line: digits only, country code included, no leading +.
 * Used for `tel:` and WhatsApp (`wa.me`). Keep in sync with {@link BOOKING_PHONE_DISPLAY}.
 */
export const BOOKING_PHONE_DIGITS = "34600111222";

/** Shown next to call / WhatsApp actions (e.g. Torrevieja landline or mobile). */
export const BOOKING_PHONE_DISPLAY = "+34 600 111 222";

export function bookingTelHref(): string {
  return `tel:+${BOOKING_PHONE_DIGITS}`;
}

export function bookingWhatsAppHref(): string {
  return `https://wa.me/${BOOKING_PHONE_DIGITS}`;
}
