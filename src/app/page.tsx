import { HomePage } from "@/views/HomePage";
import { getHeroSlideImages } from "@/lib/heroImages";

export default async function Page() {
  const heroImages = getHeroSlideImages();
  return <HomePage heroImages={heroImages} />;
}
