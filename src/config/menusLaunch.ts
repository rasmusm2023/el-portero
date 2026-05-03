/** Madrid calendar date when full menus will be revealed on the site (opening morning). */
export const MENUS_LAUNCH_DATE_YMD = "2026-05-14";

const MADRID_TZ = "Europe/Madrid";

/**
 * Instant when the countdown hits zero: start of opening day in Madrid (CEST).
 * Kept in sync with {@link MENUS_LAUNCH_DATE_YMD}.
 */
export function getMenusRevealTargetMs(): number {
  return Date.parse(`${MENUS_LAUNCH_DATE_YMD}T00:00:00+02:00`);
}

/**
 * `true` from opening day onward (Madrid local date). Before then, `/menu` shows
 * the pre-launch teaser only; on/after this date, the usual menu hub and subroutes render.
 */
export function areMenusPublished(at = new Date()): boolean {
  const ymd = new Intl.DateTimeFormat("en-CA", {
    timeZone: MADRID_TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(at);
  return ymd >= MENUS_LAUNCH_DATE_YMD;
}
