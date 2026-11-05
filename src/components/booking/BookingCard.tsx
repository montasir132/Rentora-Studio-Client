"use client";

import type { LucideIcon } from "lucide-react";
import {
  CalendarDays,
  Clock,
  Hash,
  Hourglass,
  ImageOff,
  LayoutGrid,
  MapPin,
  Users,
  Wallet,
} from "lucide-react";

import BookingDetailsDialog from "@/components/booking/BookingDetailsDialog";
import BookingStatusBadge from "@/components/booking/BookingStatusBadge";
import CancelBookingDialog from "@/components/booking/CancelBookingDialog";
import { Card, CardContent } from "@/components/ui/card";
import {
  formatBookingDate,
  formatHours,
  formatMoney,
  normalizeStatus,
  type Booking,
  type BookingStudio,
} from "@/lib/types/booking";

function Fact({
  icon: Icon,
  label,
  value,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
}) {
  return (
    <div className="flex min-w-0 items-start gap-1.5">
      <Icon aria-hidden className="mt-0.5 size-4 shrink-0 text-primary" />
      <div className="min-w-0">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="truncate text-sm font-medium text-foreground">{value}</p>
      </div>
    </div>
  );
}

/**
 * One booking row: studio media (joined from the studios list), status,
 * reference, schedule, pricing and actions. Missing fields degrade to "N/A"
 * or a placeholder image — never to invented values.
 */
export default function BookingCard({
  booking,
  studio,
}: {
  booking: Booking;
  studio?: BookingStudio;
}) {
  const status = normalizeStatus(booking.status);
  const studioName = booking.studioName ?? studio?.title ?? "Studio booking";
  const time =
    booking.time ??
    (booking.startTime && booking.endTime
      ? `${booking.startTime} - ${booking.endTime}`
      : "N/A");
  const hourly =
    typeof booking.hourlyRate === "number"
      ? `${formatMoney(booking.hourlyRate)}/hr`
      : "N/A";
  const guests =
    typeof booking.guests === "number" ? String(booking.guests) : "N/A";

  return (
    <Card className="overflow-hidden">
      <CardContent className="flex flex-col gap-4 p-4 sm:flex-row sm:gap-5">
        {/* Studio cover — bookings don't embed media, so it's joined by studioId. */}
        <div className="relative aspect-16/10 w-full shrink-0 overflow-hidden rounded-lg bg-muted sm:aspect-4/3 sm:w-52">
          {studio?.image ? (
            // User-provided image URLs point at arbitrary hosts — plain img.
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={studio.image}
              alt={studioName}
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover"
            />
          ) : (
            <span className="absolute inset-0 grid place-items-center text-muted-foreground">
              <ImageOff aria-hidden className="size-8" />
            </span>
          )}
        </div>

        {/* Content */}
        <div className="flex min-w-0 flex-1 flex-col">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <BookingStatusBadge status={status} />
            <span className="flex min-w-0 items-center gap-1 font-mono text-xs text-muted-foreground">
              <Hash aria-hidden className="size-3.5 shrink-0" />
              <span className="truncate">{booking._id}</span>
            </span>
          </div>

          <h3 className="mt-2 truncate text-lg font-semibold text-foreground sm:text-xl">
            {studioName}
          </h3>

          {studio?.category || studio?.location ? (
            <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
              {studio?.category ? (
                <span className="flex items-center gap-1">
                  <LayoutGrid aria-hidden className="size-3.5" />
                  {studio.category}
                </span>
              ) : null}
              {studio?.location ? (
                <span className="flex items-center gap-1">
                  <MapPin aria-hidden className="size-3.5" />
                  {studio.location}
                </span>
              ) : null}
            </p>
          ) : null}

          {/* Booking information */}
          <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 sm:grid-cols-4">
            <Fact
              icon={CalendarDays}
              label="Date"
              value={formatBookingDate(booking.bookingDate)}
            />
            <Fact icon={Clock} label="Time" value={time} />
            <Fact
              icon={Hourglass}
              label="Duration"
              value={formatHours(booking.totalHours)}
            />
            <Fact icon={Users} label="Guests" value={guests} />
          </div>

          {/* Pricing information */}
          <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-1 border-t border-border pt-3 text-sm">
            <span className="text-muted-foreground">
              Hourly Rate{" "}
              <span className="font-medium text-foreground">{hourly}</span>
            </span>
            <span className="text-muted-foreground">
              Deposit{" "}
              <span className="font-medium text-foreground">
                {formatMoney(booking.securityDeposit)}
              </span>
            </span>
            <span className="ml-auto flex items-center gap-1.5">
              <Wallet aria-hidden className="size-4 text-primary" />
              <span className="text-muted-foreground">Total</span>
              <span className="text-lg font-bold text-primary">
                {formatMoney(booking.amount)}
              </span>
            </span>
          </div>

          {/* Actions — Cancel only exists for pending bookings. */}
          <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:justify-end">
            <BookingDetailsDialog booking={booking} studio={studio} />
            {status === "pending" ? <CancelBookingDialog booking={booking} /> : null}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
