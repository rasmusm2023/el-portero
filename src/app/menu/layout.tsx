import { areMenusPublished } from "@/config/menusLaunch";
import { MenusPreLaunchPanel } from "@/components/MenusPreLaunchPanel";

/** Opening date is evaluated per request (not frozen at build time). */
export const dynamic = "force-dynamic";

/**
 * Before opening day in Madrid, every `/menu/*` route shows the countdown teaser only.
 * On and after that date, this layout renders `children` unchanged — the full
 * menu hub (`MenusHubPage` at `/menu`) and nested routes (`/menu/weekly`, etc.).
 */
export default function MenuRouteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (!areMenusPublished()) {
    return <MenusPreLaunchPanel />;
  }
  return <>{children}</>;
}
