/** True for the dev server. Preview and production hosts are not local. */
export function isLocalDevHost(hostname: string): boolean {
  return hostname === "localhost" || hostname === "127.0.0.1" || hostname === "[::1]";
}

/**
 * Live site: normal published events only.
 * Localhost: those, plus events published from the dev admin (`localOnly`).
 * `localOnly` events are stored with `published: false`, so the current live site
 * never receives them in its published query.
 */
export function showEventOnSite(
  event: { published?: boolean; localOnly?: boolean },
  localDev: boolean,
): boolean {
  if (event.localOnly === true) return localDev;
  return event.published !== false;
}
