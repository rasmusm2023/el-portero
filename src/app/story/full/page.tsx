import { STORY_CONTENT_PLACEHOLDERS } from "@/data/storyContentImages";
import { getStoryHeroSlideImages } from "@/lib/heroImages";
import { StoryPage } from "@/views/StoryPage";
import type { Metadata } from "next";

/** Full story (WIP). Public nav stays on `/story` (coming soon). Bookmark this URL while editing. */
export const metadata: Metadata = {
  title: "Our story",
  robots: { index: false, follow: false },
};

export default async function Page() {
  const heroImages = getStoryHeroSlideImages();
  return (
    <StoryPage heroImages={heroImages} contentImages={STORY_CONTENT_PLACEHOLDERS} />
  );
}
