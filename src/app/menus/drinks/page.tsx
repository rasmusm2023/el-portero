import type { Metadata } from "next";
import { DrinksMenuPage } from "@/views/DrinksMenuPage";

export const metadata: Metadata = {
  title: "Drinks menu",
  description:
    "Drinks at el PORTERO in Torrevieja: wine by the glass and bottle, apéritifs, and cocktails to go with dinner.",
};

export default function Page() {
  return <DrinksMenuPage />;
}
