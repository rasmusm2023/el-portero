import { MenuBackdropIcons } from "@/components/menu/MenuBackdropIcons";

/**
 * Adds the ambient food/drinks/cocktails watermark scatter behind every `/menu/*` route.
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
      <div className="relative z-10">{children}</div>
    </>
  );
}
