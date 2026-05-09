import type { Metadata } from "next";
import { StoryDraftPage } from "@/views/StoryDraftPage";

export const metadata: Metadata = {
  title: "Vår story (draft)",
  robots: { index: false, follow: false },
};

export default function Page() {
  return <StoryDraftPage />;
}

