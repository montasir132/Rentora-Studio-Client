import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:py-10">
      <Skeleton className="h-9 w-72" />
      <Skeleton className="mt-3 h-5 w-full max-w-md" />
      <div className="mt-6 flex flex-wrap gap-4">
        <Skeleton className="h-24 w-full max-w-[240px] rounded-xl" />
      </div>
      <div className="mt-6 overflow-hidden rounded-xl border border-border bg-card">
        {Array.from({ length: 5 }).map((_, index) => (
          <div
            key={index}
            className="flex items-center gap-3 border-b border-border px-4 py-3 last:border-b-0"
          >
            <Skeleton className="size-10 rounded-md" />
            <Skeleton className="h-4 flex-1" />
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-24" />
          </div>
        ))}
      </div>
    </div>
  );
}
