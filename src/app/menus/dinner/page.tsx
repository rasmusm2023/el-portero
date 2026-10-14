import type { Metadata } from "next";
import { DinnerMenuPage } from "@/views/DinnerMenuPage";

export const metadata: Metadata = {
  title: "Dinner menu",
  description:
    "Tonight’s dinner menu at el PORTERO, Torrevieja. Order by course or follow the kitchen — plates built around the market and the grill.",
};

export default function Page() {
  return <DinnerMenuPage />;
}
