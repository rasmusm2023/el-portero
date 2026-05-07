/**
 * Staff-only admin UI: high-contrast actions (greens, caution ambers, neutral grays).
 * Not used on customer-facing pages.
 */

/** Publish / create — “go live” actions */
export const adminBtnGreen =
  "rounded-none border border-emerald-300/35 bg-emerald-600 px-4 py-4 text-xs font-semibold tracking-[0.2em] uppercase text-white shadow-sm transition-colors hover:bg-emerald-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-300 disabled:cursor-not-allowed disabled:opacity-50";

/** Save — drafts and edits (non-destructive) */
export const adminBtnBlue =
  "rounded-none border border-sky-300/30 bg-sky-600 px-4 py-3 text-sm font-semibold tracking-[0.18em] uppercase text-white shadow-sm transition-colors hover:bg-sky-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-300 disabled:cursor-not-allowed disabled:opacity-50";

/** Delete — destructive actions */
export const adminBtnDanger =
  "rounded-none border border-red-300/25 bg-red-600 px-4 py-4 text-xs font-semibold tracking-[0.2em] uppercase text-white shadow-sm transition-colors hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-300 disabled:cursor-not-allowed disabled:opacity-50";

/** Unpublish / caution (non-delete but still “danger-ish”) */
export const adminBtnCaution =
  "rounded-none border border-amber-300/25 bg-amber-600 px-4 py-4 text-xs font-semibold tracking-[0.2em] uppercase text-amber-950 shadow-sm transition-colors hover:bg-amber-500 disabled:cursor-not-allowed disabled:opacity-50";

/** Sign out — destructive-ish but softer than delete */
export const adminBtnSignOut =
  "rounded-none border border-red-300/18 bg-red-950/25 px-4 py-2 text-xs font-semibold tracking-[0.22em] uppercase text-red-100 shadow-sm transition-colors hover:bg-red-950/35 disabled:cursor-not-allowed disabled:opacity-50";

/** Dashboard / toolbar */
export const adminBtnNeutral =
  "rounded-none border border-paper/18 bg-paper/8 px-4 py-2 text-xs font-semibold tracking-[0.22em] uppercase text-paper/90 shadow-sm transition-colors hover:bg-paper/12 disabled:cursor-not-allowed disabled:opacity-50";

export const adminCalloutSuccess =
  "rounded-none border border-emerald-300/25 bg-emerald-950/25 px-4 py-3 text-sm text-emerald-100";

export const adminCalloutInfo =
  "rounded-none border border-sky-300/20 bg-sky-950/20 px-4 py-3 text-sm text-sky-100";
