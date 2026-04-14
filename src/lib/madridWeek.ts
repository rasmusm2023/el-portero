function toYmd(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

/**
 * Returns Monday (YYYY-MM-DD) for the current week in Europe/Madrid.
 * Implemented with Intl to avoid server timezone differences.
 */
export function getMadridWeekStartYmd(now = new Date()) {
  // Get Madrid local date parts
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
  const weekday = get("weekday"); // Mon, Tue...

  // Construct a date in local runtime timezone, but with Madrid's calendar date.
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

  // Monday = 1. If Sunday (0), go back 6 days.
  const diff = dow === 0 ? 6 : dow - 1;
  madridDate.setDate(madridDate.getDate() - diff);

  return toYmd(madridDate);
}

