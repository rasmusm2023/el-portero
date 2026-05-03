import { getEventsHeroSlideImages } from "@/lib/heroImages";
import { EventsPage } from "@/views/EventsPage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Events",
};

export default async function Page() {
  const heroImages = getEventsHeroSlideImages();
  return <EventsPage heroImages={heroImages} />;
}
