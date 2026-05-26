/** Half-hour slots for admin dropdowns (24h, `HH:mm`). */
export const OPENING_HOURS_TIME_OPTIONS: string[] = (() => {
  const out: string[] = [];
  for (let h = 0; h <= 23; h++) {
    out.push(`${String(h).padStart(2, "0")}:00`, `${String(h).padStart(2, "0")}:30`);
  }
  return out;
})();
