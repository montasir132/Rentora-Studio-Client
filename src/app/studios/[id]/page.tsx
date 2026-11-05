import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowLeft,
  Car,
  Clapperboard,
  Frame,
  Layers,
  Lightbulb,
  MapPin,
  MessageSquare,
  Mic,
  Search,
  SlidersHorizontal,
  Snowflake,
  Sparkles,
  Star,
  Sun,
  Users,
  VolumeX,
  Wallet,
  Wifi,
  type LucideIcon,
} from "lucide-react";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import BookingDialog from "@/components/studios/BookingDialog";
import { EmptyState } from "@/components/dashboard/empty-state";
import StudioGallery from "@/components/studios/StudioGallery";
import { fetchStudiosList } from "@/lib/studios-api";
import { studioCategories } from "@/lib/nav";
import type { Studio, StudioReview } from "@/lib/studiostype";

export const dynamic = "force-dynamic";

type StudioParams = { id: string };

export async function generateMetadata({
  params,
}: {
  params: Promise<StudioParams>;
}): Promise<Metadata> {
  const { id } = await params;
  const studio = await getStudio(id);
  return {
    title: studio ? `${studio.title} — Rentora Studio` : "Studio Details — Rentora Studio",
    description: studio
      ? `${studio.title} — book this ${studio.category.replace(/-/g, " ")} from $${studio.hourlyRate}/hr on Rentora Studio.`
      : "Studio details on Rentora Studio.",
  };
}

/**
 * Existing single-studio API call (NEXT_PUBLIC_STUDIO_DETAILS_API_URL/:id),
 * preserved for when it is configured. While that env var is unset the page
 * falls back to finding the studio inside the existing list API — the same
 * real data, no invented endpoints.
 */
async function getStudio(id: string): Promise<Studio | null> {
  const detailsApi = process.env.NEXT_PUBLIC_STUDIO_DETAILS_API_URL;
  if (detailsApi) {
    try {
      const res = await fetch(`${detailsApi}/${id}`, { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        if (data && typeof data === "object") return data as Studio;
      } else {
        console.error(`Studio details api failed: ${res.status}`);
      }
    } catch (error) {
      console.error("Studio details api error:", error);
    }
  }

  const studios = await fetchStudiosList();
  return studios.find((studio) => studio._id === id) ?? null;
}

/** Lucide icon per amenity — only amenities present in the data are shown. */
const AMENITY_ICONS: Record<string, LucideIcon> = {
  "Wi-Fi": Wifi,
  "Air conditioning": Snowflake,
  "Natural light": Sun,
  "Cyc wall": Frame,
  "Green screen": Clapperboard,
  Soundproofing: VolumeX,
  "Lighting kit": Lightbulb,
  Backdrops: Layers,
  Microphones: Mic,
  "Mixing console": SlidersHorizontal,
  "Makeup room": Sparkles,
  Parking: Car,
};

function isHttpUrl(value: string): boolean {
  return /^https?:\/\//i.test(value.trim());
}

function formatReviewDate(value: string | undefined): string {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

function initials(name: string): string {
  return (
    name
      .split(" ")
      .map((part) => part[0])
      .filter(Boolean)
      .slice(0, 2)
      .join("")
      .toUpperCase() || "U"
  );
}

function ReviewCard({ review }: { review: StudioReview }) {
  const name = review.name ?? "Anonymous creator";
  const date = formatReviewDate(review.date);
  return (
    <li className="rounded-xl border border-border bg-card p-4">
      <div className="flex items-center gap-3">
        <Avatar size="sm">
          {review.avatar ? <AvatarImage src={review.avatar} alt={name} /> : null}
          <AvatarFallback>{initials(name)}</AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-foreground">{name}</p>
          {date ? (
            <p className="text-xs text-muted-foreground">{date}</p>
          ) : null}
        </div>
        {typeof review.rating === "number" ? (
          <span className="flex items-center gap-1 text-sm font-semibold text-foreground">
            <Star aria-hidden className="size-3.5 fill-primary text-primary" />
            {review.rating.toFixed(1)}
          </span>
        ) : null}
      </div>
      {review.comment ? (
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          {review.comment}
        </p>
      ) : null}
    </li>
  );
}

export default async function StudioDetailsPage({
  params,
}: {
  params: Promise<StudioParams>;
}) {
  const { id } = await params;
  const studio = await getStudio(id);
  if (!studio) {
    return (
      <main className="w-full">
        <div className="mx-auto w-full max-w-3xl px-4 py-16 text-center sm:px-6">
          <span className="mx-auto grid size-12 place-items-center rounded-full bg-primary/10 text-primary">
            <Search aria-hidden className="size-6" />
          </span>
          <h1 className="mt-4 text-2xl font-bold text-foreground">
            Studio not found
          </h1>
          <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
            This studio may have been removed, or the link isn&apos;t quite
            right. Explore our collection to find another creative space.
          </p>
          <Link
            href="/studios"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
          >
            <ArrowLeft aria-hidden className="size-4" />
            Back to Explore Studios
          </Link>
        </div>
      </main>
    );
  }

  const category = studioCategories.find((item) => item.slug === studio.category);
  const CategoryIcon = category?.icon;
  const rating = typeof studio.rating === "number" ? studio.rating : null;
  const reviews = studio.reviews ?? [];
  const images = [studio.image, ...(studio.gallery ?? [])];
  const amenities = studio.amenities ?? [];

  return (
    <main className="w-full">
      <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:py-8">
        {/* Breadcrumb: Home → Explore Studios → Studio Details */}
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink render={<Link href="/" />}>Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink render={<Link href="/studios" />}>
                Explore Studios
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbPage>Studio Details</BreadcrumbPage>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="mt-5 grid grid-cols-1 gap-8 lg:grid-cols-[1fr_340px] lg:gap-10">
          {/* ---------------------------- Main column ---------------------------- */}
          <div className="min-w-0">
            <StudioGallery images={images} alt={studio.title} />

            {/* Title block */}
            <div className="mt-6">
              <div className="flex flex-wrap items-center gap-2">
                <Badge className="gap-1.5 bg-primary/10 text-primary" variant="outline">
                  {CategoryIcon ? <CategoryIcon aria-hidden className="size-3.5" /> : null}
                  {category?.label ?? studio.category}
                </Badge>
                {rating !== null ? (
                  <span className="flex items-center gap-1 text-sm font-semibold text-foreground">
                    <Star aria-hidden className="size-4 fill-primary text-primary" />
                    {rating.toFixed(1)}
                    {reviews.length > 0 ? (
                      <span className="font-normal text-muted-foreground">
                        ({reviews.length} {reviews.length === 1 ? "review" : "reviews"})
                      </span>
                    ) : null}
                  </span>
                ) : null}
              </div>

              <h1 className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                {studio.title}
              </h1>

              <p className="mt-3 flex items-start gap-2 text-sm text-muted-foreground">
                <MapPin aria-hidden className="mt-0.5 size-4 shrink-0" />
                {isHttpUrl(studio.location) ? (
                  <a
                    href={studio.location}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-primary underline underline-offset-4 transition-colors hover:text-primary/80"
                  >
                    View location on the map
                  </a>
                ) : (
                  <span>{studio.location}</span>
                )}
              </p>
            </div>

            {/* About */}
            <section aria-labelledby="about-studio" className="mt-8">
              <h2
                id="about-studio"
                className="text-xl font-semibold text-foreground"
              >
                About This Studio
              </h2>
              {studio.description?.trim() ? (
                <p className="mt-3 max-w-2xl text-sm leading-relaxed whitespace-pre-line text-muted-foreground sm:text-base">
                  {studio.description}
                </p>
              ) : (
                <p className="mt-3 text-sm text-muted-foreground">
                  The host hasn&apos;t added a description for this studio yet.
                </p>
              )}
            </section>

            {/* Amenities */}
            <section aria-labelledby="studio-amenities" className="mt-8">
              <h2
                id="studio-amenities"
                className="text-xl font-semibold text-foreground"
              >
                Studio Amenities
              </h2>
              {amenities.length > 0 ? (
                <ul className="mt-4 flex flex-wrap gap-2">
                  {amenities.map((item) => {
                    const Icon = AMENITY_ICONS[item] ?? Search;
                    return (
                      <li
                        key={item}
                        className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-sm font-medium text-foreground"
                      >
                        <Icon aria-hidden className="size-4 text-primary" />
                        {item}
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <p className="mt-3 text-sm text-muted-foreground">
                  No amenities listed for this studio yet.
                </p>
              )}
            </section>

            {/* Reviews */}
            <section aria-labelledby="creator-reviews" className="mt-8">
              <h2
                id="creator-reviews"
                className="text-xl font-semibold text-foreground"
              >
                What Creators Say
              </h2>
              {reviews.length > 0 ? (
                <ul className="mt-4 flex flex-col gap-3">
                  {reviews.map((review, index) => (
                    <ReviewCard key={index} review={review} />
                  ))}
                </ul>
              ) : (
                <div className="mt-4 rounded-xl border border-border bg-card">
                  <EmptyState
                    icon={MessageSquare}
                    title="No reviews yet"
                    description="Be the first creator to share what you think about this studio after your session."
                  />
                </div>
              )}
            </section>
          </div>

          <aside className="flex h-fit flex-col gap-4 lg:sticky lg:top-24">
            {/* Pricing & capacity + booking */}
            <section
              aria-labelledby="pricing-heading"
              className="rounded-xl border border-border bg-card p-5 shadow-sm"
            >
              <h2 id="pricing-heading" className="text-sm font-medium text-muted-foreground">
                Pricing &amp; Capacity
              </h2>
              <p className="mt-1 text-4xl font-bold text-primary">
                ${studio.hourlyRate}
                <span className="text-base font-medium text-muted-foreground">/hr</span>
              </p>

              <dl className="mt-4 flex flex-col divide-y divide-border rounded-lg border border-border text-sm">
                <div className="flex items-center justify-between gap-3 px-4 py-3">
                  <dt className="flex items-center gap-2 text-muted-foreground">
                    <Wallet aria-hidden className="size-4 text-primary" />
                    Security Deposit
                  </dt>
                  <dd className="font-semibold text-foreground">
                    ${studio.securityDeposit.toFixed(2)}
                  </dd>
                </div>
                <div className="flex items-center justify-between gap-3 px-4 py-3">
                  <dt className="flex items-center gap-2 text-muted-foreground">
                    <Users aria-hidden className="size-4 text-primary" />
                    Maximum Capacity
                  </dt>
                  <dd className="font-semibold text-foreground">
                    {studio.capacity} {studio.capacity === 1 ? "guest" : "guests"}
                  </dd>
                </div>
              </dl>

              <div className="mt-4">
                <BookingDialog
                  studioId={studio._id}
                  studioTitle={studio.title}
                  hourlyRate={studio.hourlyRate}
                  securityDeposit={studio.securityDeposit}
                  capacity={studio.capacity}
                />
              </div>
            </section>

            {/* Host */}
            <section
              aria-labelledby="studio-host"
              className="rounded-xl border border-border bg-card p-5 shadow-sm"
            >
              <h2 id="studio-host" className="text-sm font-medium text-muted-foreground">
                Hosted By
              </h2>
              <div className="mt-3 flex items-center gap-3">
                <Avatar size="lg">
                  {studio.ownerImage ? (
                    <AvatarImage src={studio.ownerImage} alt={studio.ownerName} />
                  ) : null}
                  <AvatarFallback>{initials(studio.ownerName)}</AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-foreground">
                    {studio.ownerName}
                  </p>
                  <p className="text-xs text-muted-foreground">Studio Host</p>
                </div>
              </div>
              <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
                Bookings and messages are handled through Rentora Studio. The
                host&apos;s personal contact details are never shown publicly.
              </p>
            </section>
          </aside>
        </div>
      </div>
    </main>
  );
}
