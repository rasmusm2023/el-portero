import type { Metadata } from "next";
import { ReservePage } from "@/views/ReservePage";

export const metadata: Metadata = {
  title: "Reserve (legacy)",
  description:
    "Legacy reservation page kept for documentation. Current reservations use the Bokabord widget.",
};

export default function Page() {
  return <ReservePage />;
}

