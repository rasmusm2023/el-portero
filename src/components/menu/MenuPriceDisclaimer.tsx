type MenuPriceDisclaimerProps = {
  /** Extra classes — parent can override alignment / spacing as needed. */
  className?: string;
};

/**
 * Small column-label style currency note. Designed to sit just above the price column
 * (right-aligned by default) so guests read it as a header for the numbers below,
 * rather than as a separate paragraph competing with the menu title.
 */
export function MenuPriceDisclaimer({ className }: MenuPriceDisclaimerProps) {
  return (
    <p
      className={[
        "text-right text-[0.625rem] font-normal uppercase leading-none tracking-[0.18em] text-paper/40 sm:text-[0.6875rem]",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      Prices in €
    </p>
  );
}
