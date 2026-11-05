import Link from "next/link";
import { CalendarDays } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { EmptyState } from "@/components/dashboard/empty-state";
import type { BookingStatus, RecentBooking } from "@/lib/dashboard";
import { cn } from "cn";

const statusBadge: Record<
  BookingStatus,
  { variant: "default" | "secondary" | "destructive" | "outline"; className?: string }
> = {
  pending: { variant: "secondary" },
  confirmed: { variant: "outline", className: "border-primary/40 text-primary" },
  completed: { variant: "default" },
  cancelled: { variant: "destructive" },
};

export function BookingStatusBadge({ status }: { status: BookingStatus }) {
  const { variant, className } = statusBadge[status];
  return (
    <Badge variant={variant} className={cn(className, "capitalize")}>
      {status}
    </Badge>
  );
}

function formatBookingDate(iso: string | null): string {
  if (!iso) return "—";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

/** Bare bookings table (used by the dashboard section and the bookings pages). */
export function BookingsTable({ bookings }: { bookings: RecentBooking[] }) {
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Studio</TableHead>
            <TableHead>Booking Date</TableHead>
            <TableHead>Time</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {bookings.map((booking) => (
            <TableRow key={booking.id}>
              <TableCell className="font-medium text-foreground">
                {booking.studioName}
              </TableCell>
              <TableCell className="text-muted-foreground">
                {formatBookingDate(booking.bookingDate)}
              </TableCell>
              <TableCell className="text-muted-foreground">{booking.time}</TableCell>
              <TableCell className="text-muted-foreground">
                ${booking.amount.toFixed(2)}
              </TableCell>
              <TableCell>
                <BookingStatusBadge status={booking.status} />
              </TableCell>
              <TableCell className="text-right">
                <Button
                  variant="ghost"
                  size="xs"
                  render={<Link href="/my-bookings" />}
                >
                  Details
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

type RecentBookingsProps = {
  bookings: RecentBooking[];
};

/** Dashboard card: latest bookings with an empty state when there are none. */
export function RecentBookings({ bookings }: RecentBookingsProps) {
  return (
    <section
      aria-labelledby="recent-bookings-heading"
      className="overflow-hidden rounded-xl border border-border bg-card"
    >
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border px-4 py-3 sm:px-5">
        <div>
          <h2 id="recent-bookings-heading" className="text-base font-semibold text-foreground">
            Recent Bookings
          </h2>
          <p className="text-xs text-muted-foreground">
            Your latest studio reservations
          </p>
        </div>
        {bookings.length > 0 ? (
          <Button variant="ghost" size="sm" render={<Link href="/my-bookings" />}>
            View all
          </Button>
        ) : null}
      </div>

      {bookings.length === 0 ? (
        <EmptyState
          icon={CalendarDays}
          title="No bookings yet"
          description="When you book a studio, your reservations will show up here."
          action={{ href: "/studios", label: "Explore Studios" }}
        />
      ) : (
        <BookingsTable bookings={bookings} />
      )}
    </section>
  );
}
