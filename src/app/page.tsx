import { HomePage } from "@/views/HomePage";
import { getHeroMontageClips } from "@/lib/heroVideos";

export default function Page() {
  return <HomePage heroVideos={getHeroMontageClips()} />;
}
