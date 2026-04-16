/**
 * Staff-only admin UI: high-contrast actions (greens, caution ambers, neutral grays).
 * Not used on customer-facing pages.
 */

/** Save draft, publish to site, upload — “safe forward” actions */
export const adminBtnGreen =
  "rounded-none border border-emerald-900/40 bg-emerald-600 px-4 py-4 text-xs font-semibold tracking-[0.2em] uppercase text-white shadow-sm transition-colors hover:bg-emerald-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-300 disabled:cursor-not-allowed disabled:opacity-50";

/** Removes public visibility — clearly not a “go” action */
export const adminBtnCaution =
  "rounded-none border border-amber-900/35 bg-amber-600 px-4 py-4 text-xs font-semibold tracking-[0.2em] uppercase text-amber-950 shadow-sm transition-colors hover:bg-amber-500 disabled:cursor-not-allowed disabled:opacity-50";

/** Sign in / neutral primary */
export const adminBtnBlue =
  "rounded-none border border-sky-900/40 bg-sky-600 px-4 py-3 text-sm font-semibold tracking-[0.18em] uppercase text-white shadow-sm transition-colors hover:bg-sky-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-300 disabled:cursor-not-allowed disabled:opacity-50";

/** Dashboard / toolbar */
export const adminBtnNeutral =
  "rounded-none border border-slate-400 bg-slate-100 px-4 py-2 text-xs font-semibold tracking-[0.22em] uppercase text-slate-800 shadow-sm transition-colors hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-50";

export const adminCalloutSuccess =
  "rounded-none border border-emerald-700/35 bg-emerald-50 px-4 py-3 text-sm text-emerald-950";

export const adminCalloutInfo =
  "rounded-none border border-sky-700/30 bg-sky-50 px-4 py-3 text-sm text-sky-950";
