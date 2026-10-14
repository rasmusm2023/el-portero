import { getEventsHeroSlideImages } from "@/lib/heroImages";
import { EventsPage } from "@/views/EventsPage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Events",
  description:
    "Evenings at el PORTERO in Torrevieja — themed dinners, big-screen nights, and guest chefs. Planning a wedding or a private party? Ask for a quote.",
};

export default async function Page() {
  const heroImages = getEventsHeroSlideImages();
  return <EventsPage heroImages={heroImages} />;
}
