import { Dancing_Script } from "next/font/google";
import type { Metadata } from "next";
import { StoryDraftPage } from "@/views/StoryDraftPage";

/** Signature line on this draft only. */
const fontSignature = Dancing_Script({
  subsets: ["latin"],
  variable: "--font-signature",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Vår story (draft)",
  robots: { index: false, follow: false },
};

export default function Page() {
  return (
    <div className={`${fontSignature.variable} flex min-h-0 flex-1 flex-col`}>
      <StoryDraftPage />
    </div>
  );
}

