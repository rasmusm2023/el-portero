import type { Metadata } from "next";
import { headers } from "next/headers";
import { effectiveComingSoonForHost } from "@/config/siteMode";
import { ComingSoonPage } from "@/views/ComingSoonPage";
import { HomePage } from "@/views/HomePage";
import { getHeroSlideImages } from "@/lib/heroImages";
import { getHeroMontageClips } from "@/lib/heroVideos";

async function requestIsComingSoonLocked(): Promise<boolean> {
  const hdrs = await headers();
  return effectiveComingSoonForHost(
    hdrs.get("x-forwarded-host"),
    hdrs.get("host"),
  );
}

export async function generateMetadata(): Promise<Metadata> {
  if (await requestIsComingSoonLocked()) {
    return {
      title: {
        absolute: "El Portero Restaurant & Bar · Opening soon",
      },
      robots: { index: false, follow: false },
    };
  }
  return {};
}

export default async function Page() {
  if (await requestIsComingSoonLocked()) {
    const heroImages = getHeroSlideImages();
    return <ComingSoonPage heroImages={heroImages} />;
  }
  return <HomePage heroVideos={getHeroMontageClips()} />;
}
