import { getMadridLunchWeekSaturdayYmd } from "@/lib/madridWeek";

function parseYmdToUtcNoon(ymd: string) {
  const [y, m, d] = ymd.split("-").map((x) => Number(x));
  if (!y || !m || !d) return null;
  return new Date(Date.UTC(y, m - 1, d, 12, 0, 0));
}

/** Add calendar days to a YYYY-MM-DD string (UTC noon anchor). */
export function addDaysToYmd(ymd: string, days: number) {
  const dt = parseYmdToUtcNoon(ymd);
  if (!dt) return getMadridLunchWeekSaturdayYmd();
  dt.setUTCDate(dt.getUTCDate() + days);
  const y = dt.getUTCFullYear();
  const mo = String(dt.getUTCMonth() + 1).padStart(2, "0");
  const da = String(dt.getUTCDate()).padStart(2, "0");
  return `${y}-${mo}-${da}`;
}

/** Next lunch-anchor Saturday on/after `fromYmd` (YYYY-MM-DD), Europe/Madrid. */
export function nextMadridSaturdayOnOrAfterYmd(fromYmd: string) {
  const thisSaturday = getMadridLunchWeekSaturdayYmd();
  const candidate = parseYmdToUtcNoon(fromYmd);
  if (!candidate) return thisSaturday;

  const fromSaturday = getMadridLunchWeekSaturdayYmd(candidate);
  if (fromSaturday >= thisSaturday) return fromSaturday;
  return addDaysToYmd(fromSaturday, 7);
}

/** Human-readable weekday + date for a menu YYYY-MM-DD (stable UTC calendar day). */
export function formatYmdLongEnglish(ymd: string) {
  const [y, mo, d] = ymd.split("-").map((x) => Number(x));
  if (!y || !mo || !d) return ymd;
  const dt = new Date(Date.UTC(y, mo - 1, d, 12, 0, 0));
  return dt.toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}
