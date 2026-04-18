/**
 * ISO 8601 week number (1–53) for a calendar date `YYYY-MM-DD` (interpreted in local time).
 */
export function getIsoWeekNumberFromYmd(ymd: string): number {
  const [y, mo, d] = ymd.split("-").map(Number);
  if (!y || !mo || !d) return 1;
  const date = new Date(y, mo - 1, d);
  const tmp = new Date(date.getTime());
  tmp.setHours(0, 0, 0, 0);
  tmp.setDate(tmp.getDate() + 3 - ((tmp.getDay() + 6) % 7));
  return (
    1 + Math.round((tmp.getTime() - new Date(tmp.getFullYear(), 0, 4).getTime()) / 604800000)
  );
}
