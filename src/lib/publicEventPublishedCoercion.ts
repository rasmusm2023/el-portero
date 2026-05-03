/** Firestore `where("published", "==", true)` only matches boolean `true`. */
export function publishedFieldNeedsRepair(p: unknown): boolean {
  return p !== true && p !== false;
}

/**
 * Normalize legacy / hand-edited `published` values to a strict boolean for queries + rules.
 * Missing field is treated as public (older docs predated drafts).
 */
export function coercePublishedToBoolean(p: unknown): boolean {
  if (p === false) return false;
  if (p === true) return true;
  if (p === undefined || p === null) return true;
  if (typeof p === "string") {
    const s = p.trim();
    if (/^(false|0|no)$/i.test(s)) return false;
    if (/^(true|1|yes)$/i.test(s)) return true;
    return false;
  }
  if (typeof p === "number") {
    if (p === 0 || Number.isNaN(p)) return false;
    if (p === 1) return true;
    return false;
  }
  return false;
}
