import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <section className="mx-auto grid max-w-7xl gap-8 px-4 py-10 lg:grid-cols-3">
      <div className="space-y-4 lg:col-span-2">
        <Skeleton className="h-96 w-full rounded-xl" />
        <Skeleton className="h-8 w-2/3" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
      </div>
      <Skeleton className="h-72 w-full rounded-xl" />
    </section>
  );
}