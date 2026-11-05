import BookingCardSkeleton from "@/components/booking/BookingCardSkeleton";
import { Skeleton } from "@/components/ui/skeleton";

/** Route-level skeleton: header, statistics, tabs, search and booking cards. */
export default function Loading() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:py-10">
      {/* Breadcrumb */}
      <Skeleton className="h-4 w-48" />

      {/* Header */}
      <div className="mt-4 flex flex-wrap items-end justify-between gap-4 border-b border-border pb-6">
        <div className="max-w-2xl">
          <Skeleton className="h-9 w-56" />
          <Skeleton className="mt-3 h-5 w-full max-w-lg" />
          <Skeleton className="mt-2 h-5 w-3/4" />
        </div>
        <div className="flex items-center gap-4">
          <Skeleton className="h-5 w-24" />
          <Skeleton className="h-8 w-36 rounded-lg" />
        </div>
      </div>

      {/* Statistics skeletons */}
      <div className="mt-6 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Skeleton key={index} className="h-20 rounded-xl" />
        ))}
      </div>

      {/* Tabs + search/sort skeletons */}
      <Skeleton className="mt-6 h-8 w-full max-w-md rounded-lg" />
      <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:justify-between">
        <Skeleton className="h-8 w-full sm:max-w-xs" />
        <Skeleton className="h-7 w-44" />
      </div>

      {/* Booking card skeletons */}
      <div className="mt-4 flex flex-col gap-4">
        <BookingCardSkeleton />
        <BookingCardSkeleton />
        <BookingCardSkeleton />
      </div>
    </div>
  );
}
