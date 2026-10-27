/**
 * Staff-only admin UI on the light workspace. Not used on customer-facing pages.
 */

/** Publish / create — “go live” actions */
export const adminBtnGreen =
  "rounded-md border border-emerald-700 bg-emerald-600 px-4 py-3 text-xs font-semibold tracking-[0.18em] uppercase text-white shadow-sm transition-colors hover:bg-emerald-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700 disabled:cursor-not-allowed disabled:opacity-50";

/** AI / translate — sparkle gradient, distinct from save, publish, and warnings */
export const adminBtnAi =
  "cursor-pointer rounded-md border border-indigo-700 bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-600 px-4 py-2.5 text-sm font-semibold tracking-[0.16em] uppercase text-white shadow-sm transition-[filter,background-color] hover:from-indigo-500 hover:via-violet-500 hover:to-fuchsia-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-700 disabled:cursor-progress disabled:opacity-70";

/** Save — drafts and edits (non-destructive) */
export const adminBtnBlue =
  "rounded-md border border-sky-700 bg-sky-600 px-4 py-2.5 text-sm font-semibold tracking-[0.16em] uppercase text-white shadow-sm transition-colors hover:bg-sky-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-700 disabled:cursor-not-allowed disabled:opacity-50";

/** Delete — destructive actions */
export const adminBtnDanger =
  "rounded-md border border-red-700 bg-red-600 px-4 py-3 text-xs font-semibold tracking-[0.18em] uppercase text-white shadow-sm transition-colors hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-700 disabled:cursor-not-allowed disabled:opacity-50";

/** Unpublish / caution (non-delete but still “danger-ish”) */
export const adminBtnCaution =
  "rounded-md border border-amber-400 bg-amber-100 px-4 py-3 text-xs font-semibold tracking-[0.18em] uppercase text-amber-950 shadow-sm transition-colors hover:bg-amber-200 disabled:cursor-not-allowed disabled:opacity-50";

/** Sign out */
export const adminBtnSignOut =
  "cursor-pointer rounded-md border border-red-200 bg-red-50 px-4 py-2 text-xs font-semibold tracking-[0.18em] uppercase text-red-800 shadow-sm transition-colors hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50";

/** Hide from guests (reversible; not delete) */
export const adminBtnHide =
  "rounded-md border border-amber-300 bg-amber-50 px-3 py-2 text-xs font-semibold tracking-[0.16em] uppercase text-amber-900 shadow-sm transition-colors hover:bg-amber-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-400 disabled:cursor-not-allowed disabled:opacity-50";

/** Restore visibility on the public menu */
export const adminBtnShow =
  "rounded-md border border-emerald-300 bg-emerald-50 px-3 py-2 text-xs font-semibold tracking-[0.16em] uppercase text-emerald-900 shadow-sm transition-colors hover:bg-emerald-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-400 disabled:cursor-not-allowed disabled:opacity-50";

/** Dashboard / toolbar */
export const adminBtnNeutral =
  "rounded-md border border-zinc-300 bg-white px-4 py-2 text-xs font-semibold tracking-[0.18em] uppercase text-zinc-800 shadow-sm transition-colors hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-50";

export const adminCalloutSuccess =
  "rounded-md border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900";

export const adminCalloutInfo =
  "rounded-md border border-sky-200 bg-sky-50 px-4 py-3 text-sm text-sky-900";

export const adminErrorBox =
  "rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800";

export const adminTextMuted = "text-zinc-600";

export const adminTextOnLight = "text-zinc-700";

export const adminDivider = "border-zinc-200";

export const adminPanel = "rounded-xl border border-zinc-200 bg-white p-5 shadow-sm sm:p-6";

export const adminLabel = "block text-xs font-semibold text-zinc-800";

export const adminHint = "text-xs leading-relaxed text-zinc-500";

export const adminFieldInput =
  "w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 shadow-sm transition-[border-color,box-shadow] placeholder:text-zinc-400 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-200 disabled:cursor-not-allowed disabled:bg-zinc-100 disabled:text-zinc-500";

export const adminCheckbox =
  "size-4 rounded border-zinc-300 bg-white text-sky-600 focus:ring-sky-300";
