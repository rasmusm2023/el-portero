import type { Metadata } from "next";
import { MenusHubPage } from "@/views/MenusHubPage";

export const metadata: Metadata = {
  title: "Our menus",
  description:
    "Browse lunch, à la carte, weekend brunch, and the drinks list at El Portero, Torrevieja.",
};

export default function Page() {
  return <MenusHubPage />;
}
