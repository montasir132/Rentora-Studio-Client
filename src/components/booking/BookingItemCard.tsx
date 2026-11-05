"use client";
import { useState } from "react";
import {
  CalendarDays,
  CircleCheck,
  Clock,
  Eye,
  Hash,
  Trash2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { Booking } from "@/lib/types/booking";
// import { getTokenFromClient } from "@/lib/getTokenFromClient";

const ISO_DATE = /^\d{4}-\d{2}-\d{2}/;

function formatDate(value?: string) {
  if (!value) return "N/A";
  // Keep only the date part — the API stores "2026-10-29" (possibly with time).
  const date = new Date(ISO_DATE.test(value) ? value.slice(0, 10) : value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export default function BookingItemCard({ booking }: { booking: Booking }) {
  const [cancelling] = useState(false);

  const status = booking.status ?? "Confirmed";
  const isConfirmed = status.toLowerCase() === "confirmed";
  // The booking document spreads the booked destination, so its own _id is

  const handleCancel = async () => {
    // const token = await getTokenFromClient();

    const bookingDeleteApi = process.env.NEXT_PUBLIC_BOOKING_DELETE_API_URL;
    if (!bookingDeleteApi) {
      console.error("Booking api is not configured");
      return;
    }
    const res = await fetch(`${bookingDeleteApi}/${booking._id}`, {
      headers: { 
        //   Authorization: `Bearer ${token}`,
        },
      method: "DELETE",
    });
    if (!res.ok) {
      console.error(`Failed to cancel booking: ${res.status}`);
    }
    // const data = await res.json();
    // console.log(data);
  };

  return (
    <Card className="overflow-hidden border border-[#EEEEEE] bg-white p-0 shadow-[0px_1px_2px_0px_#0000001A]">
      <CardContent className="flex flex-col gap-4 p-4 sm:flex-row sm:gap-5 sm:p-5">
        {/* Image */}
        <div className="relative aspect-16/10 w-full shrink-0 overflow-hidden rounded-lg bg-[#EDFCFF] sm:aspect-4/3 sm:w-56">
          {booking.imageUrl ? (
            // API may serve arbitrary hosts; next/image would reject unconfigured ones.
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={booking.imageUrl}
              alt={booking.destinationName ?? "Booking"}
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover"
            />
          ) : null}
        </div>

        {/* Content */}
        <div className="flex min-w-0 flex-1 flex-col">
          <Badge
            variant="outline"
            className={`w-fit gap-1.5 border-0 px-2.5 py-1 text-xs font-medium ${
              isConfirmed
                ? "bg-[#E8F9EE] text-[#1E9E35]"
                : "bg-[#FEF3C7] text-[#B45309]"
            }`}
          >
            {isConfirmed ? (
              <CircleCheck className="h-3.5 w-3.5" />
            ) : (
              <Clock className="h-3.5 w-3.5" />
            )}
            {isConfirmed ? "Confirmed" : status}
          </Badge>

          <h3 className="mt-2 truncate text-xl font-semibold text-[#0C0B0B] sm:text-2xl">
            {booking.destinationName}
          </h3>

          <div className="mt-2 space-y-1.5 text-sm text-[#6C696D]">
            <p className="flex items-center gap-2">
              <CalendarDays className="h-4 w-4 shrink-0" />
              Departure: {formatDate(booking.departureDate)}
            </p>
            <p className="flex items-center gap-2">
              <Hash className="h-4 w-4 shrink-0" />
              Booking ID: {booking._id.slice(0, 8)}
            </p>
          </div>

          {/* Price + actions */}
          <div className="mt-auto flex flex-wrap items-end justify-between gap-3 pt-4">
            <p className="text-2xl font-bold text-[#15A1BF]">
              ${booking.price || "0"}
            </p>

            <div className="flex items-center gap-3">
              <Button
                type="button"
                variant="outline"
                disabled={cancelling}
                onClick={handleCancel}
                className="h-9 gap-2 border-[#EF4444]/40 bg-white px-4 text-sm text-[#EF4444] hover:bg-[#EF4444]/5 hover:text-[#EF4444]"
              >
                <Trash2 className="h-4 w-4" />
                {cancelling ? "Cancelling..." : "Cancel"}
              </Button>
              <Button
                type="button"
                className="h-9 gap-2 bg-[#15A1BF] px-4 text-sm hover:bg-[#1190ab]"
              >
                <Eye className="h-4 w-4" />
                View
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}