import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Look inside",
  description:
    "Look inside el PORTERO in Torrevieja: the dining room, the grill, and the bar, a short walk from the Mediterranean.",
};

export default function GalleryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
