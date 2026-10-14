import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Opening hours",
  description:
    "Opening hours for el PORTERO in Torrevieja. Check when the dinner club is open before you book a table.",
};

export default function HoursLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
