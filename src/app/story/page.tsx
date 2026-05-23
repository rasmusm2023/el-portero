import { getStoryHeroSlideImages } from "@/lib/heroImages";
import { StoryComingSoonPage } from "@/views/StoryComingSoonPage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Our story",
  description:
    "el PORTERO — our full story page is coming soon. Menus, reservations, and events are live.",
};

export default async function Page() {
  const heroImages = getStoryHeroSlideImages();
  return <StoryComingSoonPage heroImages={heroImages} />;
}
