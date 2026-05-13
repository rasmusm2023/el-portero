/**
 * Shared typography for `/menu` hub + `/menu/*` subpages. The tab nav doubles as the
 * page title row, so there is no separate document hero title underneath.
 */

/**
 * Dinner / Drinks tab buttons. Callers MUST set `data-active={active}` on the element —
 * the `data-[active=true]:` variant carries higher specificity than the base utilities,
 * which makes the active overrides reliable regardless of Tailwind's class-ordering.
 * Both states are intentionally large; `font-size` is animated.
 */
export const MENU_TAB_NAV_CLASS = [
  "inline-flex items-center border-0 bg-transparent p-0 font-hero-title uppercase leading-[1.05] tracking-[0.14em]",
  "shadow-none ring-0 outline-none transition-[font-size,color,font-weight] duration-300 ease-out",
  "focus-visible:rounded-sm focus-visible:ring-2 focus-visible:ring-gold/35 focus-visible:ring-offset-2 focus-visible:ring-offset-ink",
  // Idle (substantial baseline so the row still reads as the page title row).
  "text-[clamp(1.75rem,4.5vw,3rem)] font-medium text-paper/40 hover:text-paper/70",
  // Active (≈ 1.25× idle — bolder weight does most of the lifting).
  "data-[active=true]:text-[clamp(2.125rem,5.25vw,3.75rem)] data-[active=true]:font-bold data-[active=true]:text-paper data-[active=true]:hover:text-paper",
].join(" ");
