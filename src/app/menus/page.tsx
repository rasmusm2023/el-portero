import type { Metadata } from "next";
import { MenusHubPage } from "@/views/MenusHubPage";

export const metadata: Metadata = {
  title: "Our menus",
  description:
    "Dinner and drinks menus at el PORTERO in Torrevieja. Grill plates, seasonal courses, wine, and cocktails — open a menu and book a table.",
};

export default function Page() {
  return <MenusHubPage />;
}
