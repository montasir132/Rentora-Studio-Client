import { Skeleton } from "@/components/ui/skeleton";
import StudioGridSkeleton from "@/components/studios/StudioGridSkeleton";

export default function Loading() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-10">
      <Skeleton className="mb-6 h-10 w-64" />
      <div className="mb-8 flex gap-3">
        <Skeleton className="h-10 flex-1" />
        <Skeleton className="h-10 w-40" />
      </div>
      <StudioGridSkeleton count={9} />
    </section>
  );
}