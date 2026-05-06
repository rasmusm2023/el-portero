/**
 * Pre-launch: teaser on `/`, no header/footer, other routes redirect to `/`.
 *
 * Production: set `NEXT_PUBLIC_COMING_SOON=1` on Netlify (rebuild deploy).
 *
 * Local dev: the lock is never applied when the Host is localhost / loopback /
 * *.local — so `next dev` always shows the full site even if the same `.env`
 * mirrors production for Firebase etc.
 */

export const SITE_COMING_SOON_ENV_ENABLED =
  process.env.NEXT_PUBLIC_COMING_SOON === "true" ||
  process.env.NEXT_PUBLIC_COMING_SOON === "1";

/**
 * Parses the hostname from Request `Host` / `X-Forwarded-Host`
 * (`localhost:3000`, `[::1]:3000`).
 */
export function hostnameFromForwardHeaders(
  forwardedHostHeader: string | null,
  hostHeader: string | null,
): string {
  const joined = forwardedHostHeader ?? hostHeader ?? "";
  const first = joined.split(",")[0]?.trim() ?? "";
  if (!first) return "";

  if (first.startsWith("[")) {
    const end = first.indexOf("]");
    if (end > 1) return first.slice(1, end).toLowerCase();
  }

  const colon = first.indexOf(":");
  if (colon > 0) return first.slice(0, colon).toLowerCase();
  return first.toLowerCase();
}

export function isLocalDevHostname(hostname: string): boolean {
  if (!hostname) return false;
  return (
    hostname === "localhost" ||
    hostname === "127.0.0.1" ||
    hostname === "::1" ||
    hostname.endsWith(".local")
  );
}

/** True when the public site should show the teaser and route lock (production). */
export function effectiveComingSoonForHost(
  forwardedHostHeader: string | null | undefined,
  hostHeader: string | null | undefined,
): boolean {
  if (!SITE_COMING_SOON_ENV_ENABLED) return false;
  const host = hostnameFromForwardHeaders(
    forwardedHostHeader ?? null,
    hostHeader ?? null,
  );
  if (!host) return true;
  return !isLocalDevHostname(host);
}
