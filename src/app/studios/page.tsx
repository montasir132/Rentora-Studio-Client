import type { Metadata } from "next";
import Link from "next/link";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import StudiosBrowser from "@/components/studios/StudiosBrowser";
import { fetchStudios } from "@/lib/studios-api";

export const metadata: Metadata = {
  title: "Explore Studios — Rentora Studio",
  description:
    "Find your perfect creative space — discover inspiring studios for photography, filmmaking, podcasting, music production and creative workshops.",
};

// Always render on request: studios come live from the API.
export const dynamic = "force-dynamic";

type SearchParams = Promise<{ category?: string | string[] }>;

export default async function StudiosPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  // Category preselection from /studios?category=... links (nav + footer).
  const category =
    typeof params.category === "string" && params.category ? params.category : undefined;

  const { studios, failed } = await fetchStudios();

  return (
    <main className="w-full">
      <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:py-12">
        {/* Breadcrumb */}
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink render={<Link href="/" />}>
                Home
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbPage>Explore Studios</BreadcrumbPage>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Editorial page header */}
        <header className="mt-4 flex flex-wrap items-end justify-between gap-4 border-b border-border pb-6">
          <div className="max-w-2xl">
            <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Find Your Perfect Creative Space
            </h1>
            <p className="mt-3 text-base leading-relaxed text-muted-foreground">
              Discover inspiring studios for photography, filmmaking,
              podcasting, music production, and creative workshops.
            </p>
          </div>
          <p className="text-sm text-muted-foreground">
            {failed ? (
              "Availability temporarily unavailable"
            ) : (
              <>
                <span className="text-lg font-bold text-foreground">
                  {studios.length}
                </span>{" "}
                {studios.length === 1 ? "studio" : "studios"} available
              </>
            )}
          </p>
        </header>

        {/* Filters + grid */}
        <StudiosBrowser
          key={category ?? "all"}
          studios={studios}
          initialCategory={category}
          failed={failed}
        />
      </div>
    </main>
  );
}
