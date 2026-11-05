import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

/** Mirrors the real booking card: image, status row, studio info, facts, actions. */
export default function BookingCardSkeleton() {
  return (
    <Card className="overflow-hidden">
      <CardContent className="flex flex-col gap-4 p-4 sm:flex-row sm:gap-5">
        {/* Studio image skeleton */}
        <Skeleton className="aspect-16/10 w-full rounded-lg sm:aspect-4/3 sm:w-52" />

        {/* Booking information skeleton */}
        <div className="flex flex-1 flex-col gap-3">
          <div className="flex items-center justify-between gap-2">
            <Skeleton className="h-5 w-24 rounded-full" />
            <Skeleton className="h-4 w-40" />
          </div>
          <Skeleton className="h-5 w-2/3" />
          <Skeleton className="h-4 w-1/2" />
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <Skeleton key={index} className="h-10" />
            ))}
          </div>
          <div className="mt-auto flex flex-wrap items-center justify-between gap-3">
            <Skeleton className="h-5 w-44" />
            <div className="flex gap-2">
              <Skeleton className="h-8 w-28 rounded-lg" />
              <Skeleton className="h-8 w-32 rounded-lg" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
