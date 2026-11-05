import { redirect } from "next/navigation";

// The bookings experience now lives at /my-bookings (the dashboard's
// canonical bookings route). Keep /booking working for any existing link.
export const dynamic = "force-dynamic";

export default function BookingPage() {
  redirect("/my-bookings");
}
