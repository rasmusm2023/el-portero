/** Public Instagram profile. */
export const INSTAGRAM_PROFILE_URL =
  "https://www.instagram.com/elporterorestaurant/";

/** Shown in UI next to the Instagram icon and in the feed section. */
export const INSTAGRAM_HANDLE = "@elporterorestaurant";

/** General inbox shown on the contact page. */
export const CONTACT_EMAIL = "info@el-portero.com";

/** Pre-filled subject for `mailto:` from the website contact page. */
export const CONTACT_MAILTO_SUBJECT = "Contact from website";

export function contactMailtoHref(): string {
  const q = new URLSearchParams({ subject: CONTACT_MAILTO_SUBJECT });
  return `mailto:${CONTACT_EMAIL}?${q.toString()}`;
}
