import type { Metadata } from "next";
import { ReservePage } from "@/views/ReservePage";

export const metadata: Metadata = {
  title: "Reservations",
  description:
    "Reserve a table at El Portero — seasonal cooking, warm service, and dinner-club evenings in Torrevieja.",
};

export default function Page() {
  return <ReservePage />;
}
