/**
 * Human-readable message when catching unknown rejection values.
 * Avoids showing "[object Event]" when a DOM/React event is mistakenly thrown or coerced.
 */
export function unknownErrorMessage(
  err: unknown,
  fallback = "Something went wrong.",
): string {
  if (typeof err === "string") return err;
  if (err instanceof Error) {
    const m = err.message || fallback;
    /** Next/React sometimes wrap a thrown DOM Event as `new Error(String(event))`. */
    if (m === "[object Event]" || m === "[object ProgressEvent]") return fallback;
    return m;
  }
  if (err != null && typeof err === "object") {
    const msg = (err as { message?: unknown }).message;
    if (typeof msg === "string" && msg.length > 0) return msg;
    if (typeof Event !== "undefined" && err instanceof Event) return fallback;
    const tag = Object.prototype.toString.call(err);
    if (tag === "[object Event]") return fallback;
  }
  return fallback;
}
