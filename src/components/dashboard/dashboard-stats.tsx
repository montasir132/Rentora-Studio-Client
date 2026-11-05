import {
  BadgeCheck,
  Building2,
  CalendarCheck,
  CalendarDays,
  CircleCheck,
  Clock,
  Hourglass,
  Inbox,
  type LucideIcon,
} from "lucide-react";

import type { HostStats, RenterStats } from "@/lib/dashboard";

type StatCardProps = {
  label: string;
  value: number;
  icon: LucideIcon;
};

function StatCard({ label, value, icon: Icon }: StatCardProps) {
  return (
    <div className="rounded-xl border border-border bg-card p-4 sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm text-muted-foreground">{label}</p>
        <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
          <Icon aria-hidden className="size-4.5" />
        </span>
      </div>
      <p className="mt-2 text-2xl font-bold text-foreground">{value}</p>
    </div>
  );
}

type DashboardStatsProps = {
  renter: RenterStats;
  /** Null for non-host accounts — host cards are not shown to them. */
  host: HostStats | null;
};

/** Real counts from GET /api/dashboard/summary — zeros are shown honestly. */
export function DashboardStats({ renter, host }: DashboardStatsProps) {
  return (
    <div className="flex flex-col gap-6">
      <section aria-labelledby="renter-stats-heading" className="flex flex-col gap-3">
        <h2
          id="renter-stats-heading"
          className="text-base font-semibold text-foreground"
        >
          Renter Statistics
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard label="Total Bookings" value={renter.totalBookings} icon={CalendarDays} />
          <StatCard label="Upcoming Bookings" value={renter.upcomingBookings} icon={Clock} />
          <StatCard label="Pending Bookings" value={renter.pendingBookings} icon={Hourglass} />
          <StatCard label="Completed Bookings" value={renter.completedBookings} icon={CircleCheck} />
        </div>
      </section>

      {host ? (
        <section aria-labelledby="host-stats-heading" className="flex flex-col gap-3">
          <h2
            id="host-stats-heading"
            className="text-base font-semibold text-foreground"
          >
            Host Statistics
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard label="Total Studio Listings" value={host.totalListings} icon={Building2} />
            <StatCard label="Active Studios" value={host.activeStudios} icon={BadgeCheck} />
            <StatCard
              label="Pending Booking Requests"
              value={host.pendingBookingRequests}
              icon={Inbox}
            />
            <StatCard label="Confirmed Bookings" value={host.confirmedBookings} icon={CalendarCheck} />
          </div>
        </section>
      ) : null}
    </div>
  );
}
