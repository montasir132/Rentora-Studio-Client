import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { Ban, CalendarX, CheckCheck, CircleCheck, Clock, Search } from "lucide-react";

import { EmptyState } from "@/components/dashboard/empty-state";
import type { BookingStatus } from "@/lib/types/booking";
import { cn } from "cn";

type StatusKey = BookingStatus | "all";

type StateCopy = {
  title: string;
  description: string;
  icon: LucideIcon;
  action?: { href?: string; label: string };
};

/** Exact required copy for every booking empty state. */
const EMPTY_COPY: Record<StatusKey, StateCopy> = {
  all: {
    title: "No Bookings Yet",
    description:
      "You haven't booked any creative spaces yet. Explore studios and find the perfect place for your next project.",
    icon: CalendarX,
    action: { href: "/studios", label: "Explore Studios" },
  },
  pending: {
    title: "No Pending Bookings",
    description: "You don't have any booking requests waiting for confirmation.",
    icon: Clock,
  },
  confirmed: {
    title: "No Confirmed Bookings",
    description: "Your confirmed reservations will appear here.",
    icon: CircleCheck,
  },
  completed: {
    title: "No Completed Bookings",
    description: "Your completed studio sessions will appear here.",
    icon: CheckCheck,
  },
  cancelled: {
    title: "No Cancelled Bookings",
    description: "You don't have any cancelled reservations.",
    icon: Ban,
  },
};

function StateShell({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("rounded-xl border border-border bg-card", className)}>
      {children}
    </div>
  );
}

/** Per-tab (or global) empty state with the exact required copy. */
export default function BookingEmptyState({
  status,
  className,
}: {
  status: StatusKey;
  className?: string;
}) {
  const copy = EMPTY_COPY[status];
  return (
    <StateShell className={className}>
      <EmptyState
        icon={copy.icon}
        title={copy.title}
        description={copy.description}
        {...(copy.action ? { action: copy.action } : {})}
      />
    </StateShell>
  );
}

/** Shown only when a search query hides every otherwise-valid booking. */
export function BookingSearchEmpty({
  onClear,
  className,
}: {
  onClear: () => void;
  className?: string;
}) {
  return (
    <StateShell className={className}>
      <EmptyState
        icon={Search}
        title="No Matching Bookings"
        description="No bookings match your search. Try a different studio name or booking ID."
        action={{ label: "Clear Search", onAction: onClear }}
      />
    </StateShell>
  );
}
