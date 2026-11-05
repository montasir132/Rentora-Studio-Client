import Link from "next/link";
import { ArrowUpRight, ImageOff, MapPin, Star } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { studioCategories } from "@/lib/nav";
import type { Studio } from "@/lib/studiostype";

type StudiosCardProps = {
  studio: Studio;
  id?: string;
  actions?: React.ReactNode;
  hideViewDetails?: boolean;
};

export default function StudiosCard({
  studio,
  id,
  actions,
  hideViewDetails,
}: StudiosCardProps) {
  const studioId = id ?? studio._id;
  const category = studioCategories.find((item) => item.slug === studio.category);
  const CategoryIcon = category?.icon;
  const rating = typeof studio.rating === "number" ? studio.rating : null;

  return (
    <Card className="group flex h-full flex-col overflow-hidden rounded-xl border border-border bg-card p-0 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md">
      {/* Cover image */}
      <div className="relative aspect-16/10 w-full overflow-hidden bg-muted">
        {studio.image ? (
          // Studio images point at arbitrary hosts (e.g. Google), which
          // next/image would reject without remotePatterns — plain img here.
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={studio.image}
            alt={studio.title}
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 ease-out group-hover:scale-105"
          />
        ) : (
          <span
            aria-hidden="true"
            className="absolute inset-0 grid place-items-center text-muted-foreground"
          >
            <ImageOff className="size-8" />
          </span>
        )}

        {/* Category badge */}
        <span className="absolute top-3 left-3">
          <Badge className="gap-1.5 rounded-full bg-background/90 text-foreground backdrop-blur-sm">
            {CategoryIcon ? <CategoryIcon aria-hidden className="size-3.5" /> : null}
            {category?.label ?? studio.category}
          </Badge>
        </span>

        {/* Real rating only — never a hardcoded value */}
        {rating !== null ? (
          <span className="absolute top-3 right-3 flex items-center gap-1 rounded-full bg-background/90 px-2.5 py-1 text-xs font-semibold text-foreground backdrop-blur-sm">
            <Star aria-hidden className="size-3.5 fill-primary text-primary" />
            {rating.toFixed(1)}
          </span>
        ) : null}
      </div>

      <CardContent className="flex flex-1 flex-col p-4 sm:p-5">
        {/* Location */}
        <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <MapPin aria-hidden className="size-4 shrink-0" />
          <span className="truncate" title={studio.location}>
            {studio.location}
          </span>
        </p>

        {/* Title + hourly rate */}
        <div className="mt-1.5 flex items-baseline justify-between gap-3">
          <h3 className="truncate text-lg font-semibold text-foreground" title={studio.title}>
            {studio.title}
          </h3>
          <p className="shrink-0 text-lg font-bold text-primary">
            ${studio.hourlyRate}
            <span className="text-xs font-medium text-muted-foreground">/hr</span>
          </p>
        </div>

        {/* Capacity */}
        <p className="mt-1 text-xs text-muted-foreground">
          Up to {studio.capacity} {studio.capacity === 1 ? "guest" : "guests"}
        </p>

        {/* Actions */}
        <div className="mt-auto flex flex-wrap items-center justify-between gap-2 pt-4">
          {hideViewDetails ? (
            <span />
          ) : (
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5"
              render={<Link href={`/studios/${encodeURIComponent(studioId)}`} />}
            >
              View Details
              <ArrowUpRight aria-hidden className="size-3.5" />
            </Button>
          )}
          {actions ? <span className="flex items-center gap-1">{actions}</span> : null}
        </div>
      </CardContent>
    </Card>
  );
}
