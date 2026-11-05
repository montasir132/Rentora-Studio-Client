import type { LucideIcon } from "lucide-react";
import { CheckCheck, CircleCheck, Clock, LayoutGrid } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { normalizeStatus, type Booking, type BookingStatus } from "@/lib/types/booking";
import { cn } from "cn";

type Stat = {
  label: string;
  value: number;
  icon: LucideIcon;
  chip: string;
};

/**
 * Real booking statistics computed from the already-fetched list — no extra
 * API request and no fabricated numbers. Brand token chips only, so both
 * light and dark themes stay on-palette.
 */
export default function BookingStats({
  bookings,
  className,
}: {
  bookings: Booking[];
  className?: string;
}) {
  const count = (status: BookingStatus) =>
    bookings.filter((booking) => normalizeStatus(booking.status) === status)
      .length;

  const stats: Stat[] = [
    {
      label: "Total Bookings",
      value: bookings.length,
      icon: LayoutGrid,
      chip: "bg-primary/10",
    },
    {
      label: "Pending Bookings",
      value: count("pending"),
      icon: Clock,
      chip: "bg-secondary/15",
    },
    {
      label: "Confirmed Bookings",
      value: count("confirmed"),
      icon: CircleCheck,
      chip: "bg-accent/25",
    },
    {
      label: "Completed Bookings",
      value: count("completed"),
      icon: CheckCheck,
      chip: "bg-muted",
    },
  ];

  return (
    <div className={cn("grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4", className)}>
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card key={stat.label}>
            <CardContent className="flex items-center gap-3">
              <span
                aria-hidden
                className={cn(
                  "grid size-10 shrink-0 place-items-center rounded-lg text-primary",
                  stat.chip
                )}
              >
                <Icon className="size-5" />
              </span>
              <div className="min-w-0">
                <p className="text-2xl font-bold leading-none text-foreground">
                  {stat.value}
                </p>
                <p className="mt-1.5 truncate text-xs text-muted-foreground sm:text-sm">
                  {stat.label}
                </p>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
