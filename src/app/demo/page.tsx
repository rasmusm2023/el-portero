import type { Metadata } from "next";
import { DemoHomePage } from "@/views/DemoHomePage";
import { getHeroSlideImages } from "@/lib/heroImages";

export const metadata: Metadata = {
  title: "Home layout demo",
  robots: { index: false, follow: false },
};

export default async function DemoHomePageRoute() {
  const heroImages = getHeroSlideImages();
  return <DemoHomePage heroImages={heroImages} />;
}
