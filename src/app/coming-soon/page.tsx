import type { Metadata } from "next";
import { ComingSoonPage } from "@/views/ComingSoonPage";
import { getHeroMontageClips } from "@/lib/heroVideos";

export const metadata: Metadata = {
  title: "Coming soon",
  robots: { index: false, follow: false },
};

export default async function Page() {
  return <ComingSoonPage heroVideos={getHeroMontageClips()} />;
}

