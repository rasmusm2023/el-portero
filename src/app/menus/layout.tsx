import { Courier_Prime, Figtree } from "next/font/google";
import { MenuBackdropIcons } from "@/components/menu/MenuBackdropIcons";

/** Menu pages only — typewriter titles and geometric prices. */
const fontMenuType = Courier_Prime({
  subsets: ["latin"],
  weight: ["400", "700"],
  style: ["normal"],
  variable: "--font-courier",
  display: "swap",
});

const fontMenuPrice = Figtree({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-figtree",
  display: "swap",
});

/**
 * Adds the ambient food/drinks/cocktails watermark scatter behind every `/menus/*` route.
 * Backdrop is `fixed` so it stays parked in the viewport while menus scroll past; the
 * `relative z-10` wrapper around `{children}` creates a stacking context above it so the
 * menu content always paints over the icons regardless of route-level positioning.
 */
export default function MenuRouteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <MenuBackdropIcons />
      <div className={`relative z-10 ${fontMenuType.variable} ${fontMenuPrice.variable}`}>
        {children}
      </div>
    </>
  );
}
