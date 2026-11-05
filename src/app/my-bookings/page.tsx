import type { Metadata } from "next";
import Link from "next/link";
import { Compass } from "lucide-react";

import BookingExplorer from "@/components/booking/BookingExplorer";
import BookingStats from "@/components/booking/BookingStats";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { auth } from "@/lib/auth";
import { studioCategories } from "@/lib/nav";
import { requireSessionUser } from "@/lib/session";
import { fetchStudios } from "@/lib/studios-api";
import type { Booking, BookingStudio } from "@/lib/types/booking";
import { getTokenFromServer } from "@/lib/getTokenFromServer";

// Always render on request: bookings are per-user and come live from the API.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "My Bookings — Rentora Studio",
  description:
    "Track your studio reservations, manage booking requests, and keep your creative sessions organized.",
};


async function getBookings(
  email: string,
): Promise<{ bookings: Booking[]; failed: boolean }> {
  const bookingsApi = process.env.NEXT_PUBLIC_BOOKING_EDIT_API_URL;
  if (!bookingsApi) {
    console.error("Bookings api is not configured");
    return { bookings: [], failed: true };
  }

  const token = await getTokenFromServer();

  try {
    const res = await fetch(`${bookingsApi}/${encodeURIComponent(email)}`, {
      cache: "no-store",
      headers: {
        authorization: `Bearer ${token}`,
      },
    });
    if (!res.ok) {
      console.error(`Bookings api failed: ${res.status}`);
      return { bookings: [], failed: true };
    }
    const data = await res.json();
    return {
      bookings: Array.isArray(data) ? (data as Booking[]) : [],
      failed: false,
    };
  } catch (error) {
    console.error("Bookings api error:", error);
    return { bookings: [], failed: true };
  }
}

/**
 * Private bookings dashboard. The session is verified server-side by the
 * existing route guard, and the backend filters the list by the signed-in
 * renter's email — other users' bookings are never rendered here.
 */
export default async function MyBookingsPage() {
  const user = await requireSessionUser("/my-bookings");


  const [{ bookings, failed }, { studios }] = await Promise.all([
    getBookings(user.email),
    fetchStudios(),
  ]);

  // Booking documents don't embed studio media — join it from the studios
  // list (degrades gracefully to placeholders when a studio is missing).
  // Only studios actually referenced by a booking are passed to the client.
  const studioIds = new Set(
    bookings.map((booking) => booking.studioId).filter(Boolean)
  );
  const studioById: Record<string, BookingStudio> = {};
  for (const studio of studios) {
    if (!studioIds.has(studio._id)) continue;
    studioById[studio._id] = {
      title: studio.title,
      image: studio.image,
      location: studio.location,
      category:
        studioCategories.find((category) => category.slug === studio.category)
          ?.label ?? studio.category,
    };
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:py-10">
      {/* Breadcrumb: Home > Dashboard > My Bookings */}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink render={<Link href="/" />}>Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink render={<Link href="/dashboard" />}>
              Dashboard
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbPage>My Bookings</BreadcrumbPage>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Page header */}
      <header className="mt-4 flex flex-wrap items-end justify-between gap-4 border-b border-border pb-6">
        <div className="max-w-2xl">
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            My Bookings
          </h1>
          <p className="mt-3 text-base leading-relaxed text-muted-foreground">
            Track your studio reservations, manage booking requests, and keep
            your creative sessions organized.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          {!failed ? (
            <p className="text-sm text-muted-foreground">
              <span className="text-lg font-bold text-foreground">
                {bookings.length}
              </span>{" "}
              {bookings.length === 1 ? "booking" : "bookings"}
            </p>
          ) : null}
          <Button render={<Link href="/studios" />} className="gap-2">
            <Compass aria-hidden className="size-4" />
            Explore Studios
          </Button>
        </div>
      </header>

      {/* Statistics from real data (hidden entirely if the fetch failed) */}
      {failed ? null : <BookingStats bookings={bookings} className="mt-6" />}

      {/* Tabs, search/sort, cards, empty & error states */}
      <BookingExplorer
        bookings={bookings}
        studioById={studioById}
        failed={failed}
        className="mt-6"
      />
    </div>
  );
}
