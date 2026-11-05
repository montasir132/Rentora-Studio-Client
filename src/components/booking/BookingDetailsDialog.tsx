"use client";

import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import {
  CalendarDays,
  Clock,
  Eye,
  LayoutGrid,
  Users,
  Wallet,
} from "lucide-react";

import BookingStatusBadge from "@/components/booking/BookingStatusBadge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  formatBookingDate,
  formatHours,
  formatMoney,
  normalizeStatus,
  type Booking,
  type BookingStudio,
} from "@/lib/types/booking";

function Row({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="text-right text-sm font-medium text-foreground">
        {value}
      </span>
    </div>
  );
}

function Section({
  title,
  icon: Icon,
  children,
}: {
  title: string;
  icon: LucideIcon;
  children: ReactNode;
}) {
  return (
    <section className="rounded-xl border border-border bg-muted/40 p-4">
      <h4 className="flex items-center gap-1.5 text-sm font-semibold text-foreground">
        <Icon aria-hidden className="size-4 text-primary" />
        {title}
      </h4>
      <div className="mt-2 flex flex-col gap-2">{children}</div>
    </section>
  );
}

/**
 * Complete booking breakdown — studio information, schedule, guest count,
 * pricing status — built from the real API document (missing fields degrade
 * to "N/A", never to invented values).
 */
export default function BookingDetailsDialog({
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

  return (
    <Dialog>
      <DialogTrigger render={<Button variant="outline" className="gap-2" />}>
        <Eye aria-hidden className="size-4" />
        View Details
      </DialogTrigger>

      <DialogContent className="max-h-[85vh] overflow-y-auto border-border bg-card sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Booking Details</DialogTitle>
          <DialogDescription>{studioName}</DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4 px-5 py-2">
          {studio?.image ? (
            // Studio image URLs may point at arbitrary hosts — plain img.
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={studio.image}
              alt={studioName}
              loading="lazy"
              className="h-32 w-full rounded-xl border border-border object-cover"
            />
          ) : null}

          <Section title="Studio Information" icon={LayoutGrid}>
            <Row label="Studio Name" value={studioName} />
            <Row label="Category" value={studio?.category ?? "N/A"} />
            <Row label="Location" value={studio?.location ?? "N/A"} />
          </Section>

          <Section title="Booking Schedule" icon={CalendarDays}>
            <Row
              label="Booking ID"
              value={
                <span className="font-mono text-xs break-all">
                  {booking._id}
                </span>
              }
            />
            <Row
              label="Booking Date"
              value={formatBookingDate(booking.bookingDate)}
            />
            <Row label="Time" value={time} />
            <Row label="Start Time" value={booking.startTime ?? "N/A"} />
            <Row label="End Time" value={booking.endTime ?? "N/A"} />
            <Row label="Total Duration" value={formatHours(booking.totalHours)} />
            <Row
              label="Booked On"
              value={formatBookingDate(booking.createdAt)}
            />
          </Section>

          <Section title="Guests" icon={Users}>
            <Row
              label="Number of Guests"
              value={
                typeof booking.guests === "number"
                  ? String(booking.guests)
                  : "N/A"
              }
            />
          </Section>

          <Section title="Pricing Breakdown" icon={Wallet}>
            <Row label="Hourly Rate" value={hourly} />
            <Row label="Security Deposit" value={formatMoney(booking.securityDeposit)} />
            <div className="flex items-center justify-between gap-4 border-t border-border pt-2">
              <span className="text-sm font-semibold text-foreground">
                Total Booking Amount
              </span>
              <span className="text-base font-bold text-primary">
                {formatMoney(booking.amount)}
              </span>
            </div>
          </Section>

          <Section title="Booking Status" icon={Clock}>
            <div className="flex items-center justify-between gap-4">
              <span className="text-sm text-muted-foreground">
                Current Status
              </span>
              <BookingStatusBadge status={status} />
            </div>
          </Section>
        </div>

        <DialogFooter className="border-t border-border px-5 py-4">
          <DialogClose render={<Button type="button" variant="outline" />}>
            Close
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
