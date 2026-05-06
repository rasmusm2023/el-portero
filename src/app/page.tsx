import type { Metadata } from "next";
import { SITE_COMING_SOON } from "@/config/siteMode";
import { ComingSoonPage } from "@/views/ComingSoonPage";
import { HomePage } from "@/views/HomePage";
import { getHeroSlideImages } from "@/lib/heroImages";
import { getHeroMontageClips } from "@/lib/heroVideos";

export async function generateMetadata(): Promise<Metadata> {
  if (SITE_COMING_SOON) {
    return {
      title: "Coming soon",
      robots: { index: false, follow: false },
    };
  }
  return {};
}

export default async function Page() {
  if (SITE_COMING_SOON) {
    const heroImages = getHeroSlideImages();
    return <ComingSoonPage heroImages={heroImages} />;
  }
  return <HomePage heroVideos={getHeroMontageClips()} />;
}
