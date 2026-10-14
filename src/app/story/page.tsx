import { getStoryHeroSlideImages } from "@/lib/heroImages";
import { StoryComingSoonPage } from "@/views/StoryComingSoonPage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Our story",
  description:
    "The full story of el PORTERO in Torrevieja is still being written. Menus, events, and table bookings are already open while this page is finished.",
};

export default async function Page() {
  const heroImages = getStoryHeroSlideImages();
  return <StoryComingSoonPage heroImages={heroImages} />;
}
