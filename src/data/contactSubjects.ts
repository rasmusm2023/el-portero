/**
 * Stable `name="subject"` values for the contact form (submitted with the message).
 * Labels live in `i18n/strings` under `page.contact.subject.*`.
 */
export const CONTACT_SUBJECT_SLUGS = [
  "general",
  "reservation",
  "privateEvent",
  "feedbackVisit",
  "dietaryAllergies",
  "largeGroup",
  "giftCard",
  "pressMedia",
  "partnership",
  "careers",
  "lostProperty",
  "accessibility",
  "wineCellar",
  "hoursLocation",
  "billing",
  "privateDining",
  "specialOccasion",
  "other",
] as const;

export type ContactSubjectSlug = (typeof CONTACT_SUBJECT_SLUGS)[number];
