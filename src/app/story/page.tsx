import { STORY_CONTENT_PLACEHOLDERS } from "@/data/storyContentImages";
import { getStoryHeroSlideImages } from "@/lib/heroImages";
import { StoryPage } from "@/views/StoryPage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Our history",
};

export default async function Page() {
  const heroImages = getStoryHeroSlideImages();
  return (
    <StoryPage heroImages={heroImages} contentImages={STORY_CONTENT_PLACEHOLDERS} />
  );
}
