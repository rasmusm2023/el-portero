import type { Metadata } from "next";
import { MenusHubPage } from "@/views/MenusHubPage";

export const metadata: Metadata = {
  title: "Menus",
  description:
    "Lunch, à la carte, brunch, and drinks at El Portero — Torrevieja.",
};

export default function Page() {
  return <MenusHubPage />;
}
