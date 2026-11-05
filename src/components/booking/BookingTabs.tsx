"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { BookingStatus } from "@/lib/types/booking";
import { cn } from "cn";

export type BookingTab = BookingStatus | "all";

const TABS: { value: BookingTab; label: string }[] = [
  { value: "all", label: "All Bookings" },
  { value: "pending", label: "Pending" },
  { value: "confirmed", label: "Confirmed" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
];

/** Status tabs with per-tab counts. Filtering itself happens in the explorer. */
export default function BookingTabs({
  value,
  counts,
  onChange,
}: {
  value: BookingTab;
  counts: Record<BookingTab, number>;
  onChange: (value: BookingTab) => void;
}) {
  return (
    <Tabs
      value={value}
      onValueChange={(next) => {
        if (next != null) onChange(next as BookingTab);
      }}
    >
      <TabsList className="w-full justify-start overflow-x-auto sm:w-fit">
        {TABS.map((tab) => (
          <TabsTrigger
            key={tab.value}
            value={tab.value}
            className="flex-none gap-2 px-3"
          >
            {tab.label}
            <span
              className={cn(
                "rounded-full px-1.5 py-0.5 text-[0.65rem] font-semibold",
                value === tab.value
                  ? "bg-primary/15 text-primary"
                  : "bg-background/70 text-muted-foreground"
              )}
            >
              {counts[tab.value]}
            </span>
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}
