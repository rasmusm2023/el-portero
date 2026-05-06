import type { Metadata } from "next";
import { ComingSoonPage } from "@/views/ComingSoonPage";
import { getHeroSlideImages } from "@/lib/heroImages";

export const metadata: Metadata = {
  title: {
    absolute: "El Portero Restaurant & Bar · Opening soon",
  },
  robots: { index: false, follow: false },
};

export default async function Page() {
  const heroImages = getHeroSlideImages();
  return <ComingSoonPage heroImages={heroImages} />;
}
