import { getHeroSlideImages } from "@/lib/heroImages";
import { StoryPage } from "@/views/StoryPage";

export default async function Page() {
  const heroImages = getHeroSlideImages();
  return <StoryPage heroImages={heroImages} />;
}
