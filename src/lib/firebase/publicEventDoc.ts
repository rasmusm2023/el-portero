import type { HomeEvent } from "@/lib/publicEventTypes";

/** `YYYY-MM-DD` from string, Firestore Timestamp-like, or Admin JSON `{ seconds }`. */
export function normalizeSortDateFromFirestore(raw: unknown): string {
  if (raw == null || raw === "") return "";
  if (typeof raw === "string") {
    const m = /^\d{4}-\d{2}-\d{2}/.exec(raw.trim());
    if (m) return m[0];
    return raw.trim();
  }
  if (raw instanceof Date) {
    return Number.isNaN(raw.getTime()) ? "" : raw.toISOString().slice(0, 10);
  }
  if (typeof raw === "object" && raw !== null && "toDate" in raw) {
    const fn = (raw as { toDate?: () => Date }).toDate;
    if (typeof fn === "function") {
      try {
        const d = fn.call(raw);
        if (d instanceof Date && !Number.isNaN(d.getTime())) return d.toISOString().slice(0, 10);
      } catch {
        /* ignore */
      }
    }
  }
  if (typeof raw === "object" && raw !== null && "seconds" in raw) {
    const s = Number((raw as { seconds: unknown }).seconds);
    if (Number.isFinite(s)) return new Date(s * 1000).toISOString().slice(0, 10);
  }
  return "";
}

/** Map a Firestore `publicEvents` document (client or REST/JSON) to `HomeEvent`. */
export function homeEventFromFirestoreData(id: string, v: Record<string, unknown>): HomeEvent {
  const weekdayDate = (v.weekdayDate ?? { en: "", es: "", sv: "" }) as HomeEvent["weekdayDate"];
  const timeDetail = (v.timeDetail ?? { en: "", es: "", sv: "" }) as HomeEvent["timeDetail"];
  const title = (v.title ?? { en: "", es: "", sv: "" }) as HomeEvent["title"];
  const excerpt = (v.excerpt ?? { en: "", es: "", sv: "" }) as HomeEvent["excerpt"];
  const imageAlt = (v.imageAlt ?? { en: "", es: "", sv: "" }) as HomeEvent["imageAlt"];
  const sortDate = normalizeSortDateFromFirestore(v.sortDate) || String(v.sortDate ?? "").trim();

  const timeLine =
    String((timeDetail as { en?: unknown }).en ?? "").trim() ||
    String((timeDetail as { sv?: unknown }).sv ?? "").trim() ||
    String((timeDetail as { es?: unknown }).es ?? "").trim();
  const hasSpecificTimeRaw = v.hasSpecificTime;
  const hasSpecificTime =
    typeof hasSpecificTimeRaw === "boolean" ? hasSpecificTimeRaw : Boolean(timeLine);

  return {
    id,
    sortDate,
    published: v.published !== false,
    fullyBooked: Boolean(v.fullyBooked ?? false),
    hasSpecificTime,
    timeSlotStart: v.timeSlotStart != null ? String(v.timeSlotStart) : undefined,
    timeSlotEnd: v.timeSlotEnd != null ? String(v.timeSlotEnd) : undefined,
    eventPlace: v.eventPlace != null ? String(v.eventPlace) : undefined,
    weekdayDate,
    timeDetail,
    title,
    excerpt,
    imageSrc: String(v.imageSrc ?? ""),
    imageAlt,
  };
}
