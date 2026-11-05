/* eslint-disable @next/next/no-img-element -- studio images are arbitrary user-provided URLs. */
import Link from "next/link";
import { Building2, ImageOff, Pencil } from "lucide-react";

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
import { EmptyState } from "@/components/dashboard/empty-state";
import type { RecentListing } from "@/lib/dashboard";
import { studioCategories } from "@/lib/nav";

function categoryLabel(slug: string): string {
  return studioCategories.find((category) => category.slug === slug)?.label ?? slug;
}

function ListingImage({ src, alt }: { src: string | null; alt: string }) {
  if (!src) {
    return (
      <span
        aria-hidden="true"
        className="grid size-10 shrink-0 place-items-center rounded-md bg-muted text-muted-foreground"
      >
        <ImageOff className="size-4" />
      </span>
    );
  }
  return (
    // User-provided URLs can point at any host, so a plain img is used here.
    <img
      src={src}
      alt={alt}
      loading="lazy"
      className="size-10 shrink-0 rounded-md border border-border object-cover"
    />
  );
}

/** Bare listings table (used by the dashboard section and My Studio Listings). */
export function ListingsTable({ listings }: { listings: RecentListing[] }) {
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Studio</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Hourly Rate</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {listings.map((listing) => (
            <TableRow key={listing.id}>
              <TableCell>
                <span className="flex items-center gap-3">
                  <ListingImage src={listing.image} alt={listing.name} />
                  <span className="font-medium text-foreground">{listing.name}</span>
                </span>
              </TableCell>
              <TableCell className="text-muted-foreground">
                {categoryLabel(listing.category)}
              </TableCell>
              <TableCell className="text-muted-foreground">
                ${listing.hourlyRate.toFixed(2)}/hr
              </TableCell>
              <TableCell>
                <Badge
                  variant={listing.status === "active" ? "default" : "secondary"}
                  className="capitalize"
                >
                  {listing.status}
                </Badge>
              </TableCell>
              <TableCell>
                <span className="flex items-center justify-end gap-1">
                  <Button
                    variant="ghost"
                    size="xs"
                    render={
                      <Link href={`/add-studio?edit=${encodeURIComponent(listing.id)}`} />
                    }
                  >
                    <Pencil aria-hidden className="size-3.5" />
                    Edit
                  </Button>
                  <Button variant="ghost" size="xs" render={<Link href="/studios" />}>
                    View Details
                  </Button>
                </span>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

type RecentListingsProps = {
  listings: RecentListing[];
};

/** Dashboard card: the host's latest listings with an Add New Studio CTA. */
export function RecentListings({ listings }: RecentListingsProps) {
  return (
    <section
      aria-labelledby="recent-listings-heading"
      className="overflow-hidden rounded-xl border border-border bg-card"
    >
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border px-4 py-3 sm:px-5">
        <div>
          <h2 id="recent-listings-heading" className="text-base font-semibold text-foreground">
            Recent Studio Listings
          </h2>
          <p className="text-xs text-muted-foreground">
            Your most recently added spaces
          </p>
        </div>
        <Button size="sm" render={<Link href="/add-studio" />}>
          Add New Studio
        </Button>
      </div>

      {listings.length === 0 ? (
        <EmptyState
          icon={Building2}
          title="No studios listed yet"
          description="Add your first studio and it will appear here for creators to discover."
          action={{ href: "/add-studio", label: "Add New Studio" }}
        />
      ) : (
        <ListingsTable listings={listings} />
      )}
    </section>
  );
}
