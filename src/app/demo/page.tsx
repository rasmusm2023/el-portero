import type { Metadata } from "next";
import { DemoHomePage } from "@/views/DemoHomePage";
import { getHeroMontageClips } from "@/lib/heroVideos";

export const metadata: Metadata = {
  title: "Home layout demo",
  robots: { index: false, follow: false },
};

export default async function DemoHomePageRoute() {
  return <DemoHomePage heroVideos={getHeroMontageClips()} />;
}
