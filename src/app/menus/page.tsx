import type { Metadata } from "next";
import { MenusHubPage } from "@/views/MenusHubPage";

export const metadata: Metadata = {
  title: "Our menus",
  description:
    "Dinner and drinks at el PORTERO, Torrevieja — full lists will be published here when they go live.",
};

export default function Page() {
  return <MenusHubPage />;
}
