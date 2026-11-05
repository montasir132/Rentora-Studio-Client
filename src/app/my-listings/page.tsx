import type { Metadata } from "next";
import Link from "next/link";
import {
  Building2,
  CirclePlus,
  Eye,
  LayoutGrid,
  MapPin,
  Star,
} from "lucide-react";

import DeleteStudiosDialog from "@/components/studios/DeleteStudiosDialog";
import { EditStudiosDialog } from "@/components/studios/EditStudiosDialog";
import { EmptyState } from "@/components/dashboard/empty-state";
import StudiosCard from "@/components/studios/StudiosCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { studioCategories } from "@/lib/nav";
import { fetchStudios } from "@/lib/studios-api";
import { requireSessionUser } from "@/lib/session";
import type { Studio } from "@/lib/studiostype";

export const metadata: Metadata = {
  title: "My Studio Listings — Rentora Studio",
  description:
    "Manage your creative spaces, update your listings, and keep your studio information up to date.",
};

function categoryLabel(slug: string): string {
  return studioCategories.find((category) => category.slug === slug)?.label ?? slug;
}

function ListingThumb({ studio }: { studio: Studio }) {
  if (!studio.image) {
    return (
      <span
        aria-hidden="true"
        className="grid size-10 shrink-0 place-items-center rounded-md bg-muted text-muted-foreground"
      >
        <LayoutGrid className="size-4" />
      </span>
    );
  }
  return (
    // User-provided image URLs point at arbitrary hosts — plain img.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={studio.image}
      alt={studio.title}
      loading="lazy"
      className="size-10 shrink-0 rounded-md border border-border object-cover"
    />
  );
}

function RatingCell({ rating }: { rating: number | undefined }) {
  if (typeof rating !== "number") {
    return <span className="text-sm text-muted-foreground">—</span>;
  }
  return (
    <span className="flex items-center gap-1 text-sm font-medium text-foreground">
      <Star aria-hidden className="size-3.5 fill-primary text-primary" />
      {rating.toFixed(1)}
    </span>
  );
}

const STATUS_BADGE: Record<
  NonNullable<Studio["status"]>,
  "default" | "secondary" | "outline"
> = {
  active: "default",
  inactive: "secondary",
  pending: "outline",
};

/**
 * Manage-your-own-listings view. The session is verified server-side and the
 * ownership filter (ownerEmail — the field the studios API uses) also runs on
 * the server, so only the signed-in owner's studios are ever rendered.
 */
export default async function MyListingsPage() {
  const user = await requireSessionUser("/my-listings");

  const { studios, failed } = await fetchStudios();
  const listings = studios.filter((studio) => studio.ownerEmail === user.email);

  const showStatus = listings.some((studio) => studio.status);

  return (
    <main className="w-full">
      <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:py-10">
        {/* Header */}
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="max-w-2xl">
            <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              My Studio Listings
            </h1>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground sm:text-base">
              Manage your creative spaces, update your listings, and keep your
              studio information up to date.
            </p>
          </div>
          <Button render={<Link href="/add-studio" />} className="gap-2">
            <CirclePlus aria-hidden className="size-4" />
            Add New Studio
          </Button>
        </div>

        {failed ? (
          <div
            role="alert"
            className="mt-6 rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm font-medium text-destructive"
          >
            We couldn&apos;t reach the studios API right now. Please try again
            in a moment.
          </div>
        ) : null}

        {/* Overview — only statistics the API can actually provide */}
        <section aria-label="Listing statistics" className="mt-6 flex flex-wrap gap-4">
          <div className="w-full max-w-[240px] rounded-xl border border-border bg-card p-4 sm:p-5">
            <div className="flex items-start justify-between gap-3">
              <p className="text-sm text-muted-foreground">Total Studios</p>
              <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
                <Building2 aria-hidden className="size-4.5" />
              </span>
            </div>
            <p className="mt-2 text-2xl font-bold text-foreground">
              {listings.length}
            </p>
          </div>
          {/* Active / Inactive cards are intentionally omitted: the studios API
              does not return a `status` field yet — no invented statistics. */}
        </section>

        {/* Content */}
        <div className="mt-6">
          {listings.length === 0 ? (
            <div className="rounded-xl border border-border bg-card">
              <EmptyState
                icon={Building2}
                title="You haven't listed any studios yet."
                description="Start sharing your creative space with creators and grow your presence on Rentora Studio."
                action={{ href: "/add-studio", label: "Add Your First Studio" }}
              />
            </div>
          ) : (
            <>
              {/* Desktop table */}
              <div className="hidden overflow-hidden rounded-xl border border-border bg-card md:block">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Studio</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead>Hourly Rate</TableHead>
                        <TableHead>Rating</TableHead>
                        {showStatus ? <TableHead>Status</TableHead> : null}
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {listings.map((studio) => (
                        <TableRow key={studio._id}>
                          <TableCell>
                            <span className="flex items-center gap-3">
                              <ListingThumb studio={studio} />
                              <span
                                className="max-w-52 truncate font-medium text-foreground"
                                title={studio.title}
                              >
                                {studio.title}
                              </span>
                            </span>
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {categoryLabel(studio.category)}
                          </TableCell>
                          <TableCell>
                            <span
                              className="block max-w-44 truncate text-muted-foreground"
                              title={studio.location}
                            >
                              {studio.location}
                            </span>
                          </TableCell>
                          <TableCell className="font-semibold text-primary">
                            ${studio.hourlyRate}
                            <span className="text-xs font-medium text-muted-foreground">
                              /hr
                            </span>
                          </TableCell>
                          <TableCell>
                            <RatingCell rating={studio.rating} />
                          </TableCell>
                          {showStatus ? (
                            <TableCell>
                              {studio.status ? (
                                <Badge
                                  variant={STATUS_BADGE[studio.status]}
                                  className="capitalize"
                                >
                                  {studio.status}
                                </Badge>
                              ) : (
                                <span className="text-sm text-muted-foreground">—</span>
                              )}
                            </TableCell>
                          ) : null}
                          <TableCell>
                            <span className="flex items-center justify-end gap-1.5">
                              <Button
                                variant="ghost"
                                size="xs"
                                className="gap-1.5"
                                render={
                                  <Link
                                    href={`/studios/${encodeURIComponent(studio._id)}`}
                                  />
                                }
                              >
                                <Eye aria-hidden className="size-3.5" />
                                View
                              </Button>
                              <EditStudiosDialog id={studio._id} />
                              <DeleteStudiosDialog id={studio._id} />
                            </span>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>

              {/* Mobile cards */}
              <div className="flex flex-col gap-4 md:hidden">
                {listings.map((studio) => (
                  <StudiosCard
                    key={studio._id}
                    studio={studio}
                    actions={
                      <>
                        <EditStudiosDialog id={studio._id} />
                        <DeleteStudiosDialog id={studio._id} />
                      </>
                    }
                  />
                ))}
              </div>
            </>
          )}
        </div>

        {listings.length > 0 && !failed ? (
          <p className="mt-6 flex items-center gap-1.5 text-xs text-muted-foreground">
            <MapPin aria-hidden className="size-3.5" />
            Only studios owned by {user.email} are shown here.
          </p>
        ) : null}
      </div>
    </main>
  );
}
