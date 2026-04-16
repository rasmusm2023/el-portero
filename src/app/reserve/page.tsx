import type { Metadata } from "next";
import { ReservePage } from "@/views/ReservePage";

export const metadata: Metadata = {
  title: "Reservations",
  description:
    "Book a table at El Portero, Torrevieja — Mediterranean dining and warm hospitality.",
};

export default function Page() {
  return <ReservePage />;
}
