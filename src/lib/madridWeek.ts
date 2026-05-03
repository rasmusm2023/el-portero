function toYmd(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

/**
 * Returns the Saturday (YYYY-MM-DD) that anchors the current lunch week in Europe/Madrid.
 * Lunch is Mon–Fri; menus roll on Saturdays, so the saved `weekStartDate` / `effectiveWeekStartDate`
 * use that Saturday as the week key (not Monday).
 *
 * Implemented with Intl to avoid server timezone differences.
 */
export function getMadridLunchWeekSaturdayYmd(now = new Date()) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Madrid",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    weekday: "short",
  }).formatToParts(now);

  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? "";
  const year = Number(get("year"));
  const month = Number(get("month"));
  const day = Number(get("day"));
  const weekday = get("weekday");

  const madridDate = new Date(year, month - 1, day);

  const map: Record<string, number> = {
    Sun: 0,
    Mon: 1,
    Tue: 2,
    Wed: 3,
    Thu: 4,
    Fri: 5,
    Sat: 6,
  };
  const dow = map[weekday] ?? madridDate.getDay();

  // JS weekday Sun=0 … Sat=6. Step back to the most recent Saturday (Sat → 0 days).
  const diff = (dow + 1) % 7;
  madridDate.setDate(madridDate.getDate() - diff);

  return toYmd(madridDate);
}

/** @deprecated Use {@link getMadridLunchWeekSaturdayYmd} (lunch week is Saturday-anchored). */
export function getMadridWeekStartYmd(now = new Date()) {
  return getMadridLunchWeekSaturdayYmd(now);
}

