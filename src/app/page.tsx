import type { Metadata } from "next";
import { HomePage } from "@/views/HomePage";
import { getHeroMontageClips } from "@/lib/heroVideos";

export const metadata: Metadata = {
  description:
    "Book a table at el PORTERO, a dinner club in Torrevieja. See the menus, what’s on, and the room — Peruvian, Spanish and Swedish cooking by the Mediterranean.",
};

export default function Page() {
  return <HomePage heroVideos={getHeroMontageClips()} />;
}
