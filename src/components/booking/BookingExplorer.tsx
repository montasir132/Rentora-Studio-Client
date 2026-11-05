"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, TriangleAlert } from "lucide-react";

import BookingCard from "@/components/booking/BookingCard";
import BookingEmptyState, {
  BookingSearchEmpty,
} from "@/components/booking/BookingEmptyState";
import BookingTabs, { type BookingTab } from "@/components/booking/BookingTabs";
import { EmptyState } from "@/components/dashboard/empty-state";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  bookingTimestamp,
  normalizeStatus,
  type Booking,
  type BookingStudio,
} from "@/lib/types/booking";
import { cn } from "cn";

type SortValue = "newest" | "oldest";

/**
 * Client-side booking browser: status tabs, studio-name/booking-ID search
 * and newest/oldest sorting — pure views over the real API data. `filter`
 * always returns a new array, so the original booking list is never mutated
 * or duplicated. The API has no pagination, so none is faked here.
 */
export default function BookingExplorer({
  bookings,
  studioById,
  failed,
  className,
}: {
  bookings: Booking[];
  studioById: Record<string, BookingStudio>;
  failed: boolean;
  className?: string;
}) {
  const router = useRouter();
  const [tab, setTab] = useState<BookingTab>("all");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<SortValue>("newest");

  const counts = useMemo(() => {
    const next: Record<BookingTab, number> = {
      all: bookings.length,
      pending: 0,
      confirmed: 0,
      completed: 0,
      cancelled: 0,
    };
    for (const booking of bookings) {
      next[normalizeStatus(booking.status)] += 1;
    }
    return next;
  }, [bookings]);

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase();
    const filtered = bookings.filter((booking) => {
      if (tab !== "all" && normalizeStatus(booking.status) !== tab) return false;
      if (!needle) return true;
      return (
        (booking.studioName ?? "").toLowerCase().includes(needle) ||
        booking._id.toLowerCase().includes(needle)
      );
    });
    // `filter` already produced a new array — sorting never mutates the source.
    return filtered.sort((a, b) => {
      const diff = bookingTimestamp(b).localeCompare(bookingTimestamp(a));
      return sort === "newest" ? diff : -diff;
    });
  }, [bookings, tab, query, sort]);

  // Fetch failed: friendly error + Retry (no fake data, no mount toasts).
  if (failed) {
    return (
      <div className={cn("rounded-xl border border-border bg-card", className)}>
        <EmptyState
          icon={TriangleAlert}
          title="Unable to load your bookings."
          description="We couldn't reach the bookings service. Please check your connection and try again."
          action={{ label: "Retry", onAction: () => router.refresh() }}
        />
      </div>
    );
  }

  // No bookings at all — the global empty state with its Explore Studios CTA.
  if (bookings.length === 0) {
    return <BookingEmptyState status="all" className={className} />;
  }

  return (
    <div className={cn("flex flex-col gap-4", className)}>
      <BookingTabs value={tab} counts={counts} onChange={setTab} />

      {/* Search + sort (client-side over real data) */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Search
            aria-hidden
            className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
          />
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search by studio name or booking ID"
            aria-label="Search bookings"
            className="pl-9"
          />
        </div>

        <Select
          value={sort}
          onValueChange={(value) => {
            if (value === "newest" || value === "oldest") setSort(value);
          }}
        >
          <SelectTrigger size="sm" className="w-44" aria-label="Sort bookings">
            <SelectValue placeholder="Sort by">
              {(value: string | null) =>
                value === "oldest" ? "Oldest Booking" : "Newest Booking"
              }
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest Booking</SelectItem>
            <SelectItem value="oldest">Oldest Booking</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {visible.length === 0 ? (
        query.trim() ? (
          <BookingSearchEmpty onClear={() => setQuery("")} />
        ) : (
          <BookingEmptyState status={tab} />
        )
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {visible.map((booking) => (
            <BookingCard
              key={booking._id}
              booking={booking}
              studio={
                booking.studioId ? studioById[booking.studioId] : undefined
              }
            />
          ))}
        </div>
      )}
    </div>
  );
}
