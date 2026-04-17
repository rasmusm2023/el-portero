import { getEventsHeroSlideImages } from "@/lib/heroImages";
import { EventsPage } from "@/views/EventsPage";

export default async function Page() {
  const heroImages = getEventsHeroSlideImages();
  return <EventsPage heroImages={heroImages} />;
}
