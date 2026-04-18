/**
 * Minimum time (ms) the contact form must be open before submit counts as human-like.
 * In development, 0 so local testing isn’t blocked.
 */
export const CONTACT_FORM_MIN_SUBMIT_MS =
  typeof process !== "undefined" && process.env.NODE_ENV === "production"
    ? 2000
    : 0;
