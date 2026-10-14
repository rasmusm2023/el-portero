/** Public Instagram profile for the restaurant. */
export const INSTAGRAM_PROFILE_URL =
  "https://www.instagram.com/elporterorestaurant/";

/** Shown in UI next to the Instagram icon and in the feed section. */
export const INSTAGRAM_HANDLE = "@elporterorestaurant";

/** Second Instagram profile, for the club. */
export const INSTAGRAM_CLUB_PROFILE_URL =
  "https://www.instagram.com/elporteroclub/";

export const INSTAGRAM_CLUB_HANDLE = "@elporteroclub";

export const TIKTOK_PROFILE_URL = "https://www.tiktok.com/@elporteroclub";

export const TIKTOK_HANDLE = "@elporteroclub";

export const FACEBOOK_PROFILE_URL =
  "https://www.facebook.com/profile.php?id=61590066365975";

/** General inbox shown on the contact page. */
export const CONTACT_EMAIL = "info@el-portero.com";

/** Public phone number shown on the contact page and footer. */
export const CONTACT_PHONE = "+34 613 508 757";

/** Pre-filled subject for `mailto:` from the website contact page. */
export const CONTACT_MAILTO_SUBJECT = "Contact from website";

export function contactMailtoHref(): string {
  const q = new URLSearchParams({ subject: CONTACT_MAILTO_SUBJECT });
  return `mailto:${CONTACT_EMAIL}?${q.toString()}`;
}

export function contactTelHref(): string {
  return `tel:${CONTACT_PHONE.replace(/\s/g, "")}`;
}
