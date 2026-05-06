/**
 * Pre-launch: show the teaser on `/`, hide site chrome (header/footer), and redirect other routes to `/`.
 * Set `NEXT_PUBLIC_COMING_SOON=1` (or `true`) in the hosting environment at build time.
 */
export const SITE_COMING_SOON =
  process.env.NEXT_PUBLIC_COMING_SOON === "true" ||
  process.env.NEXT_PUBLIC_COMING_SOON === "1";
