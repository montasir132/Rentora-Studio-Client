import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { redirect } from "next/navigation";

import { Button } from "@/components/ui/button";
import { StudioForm, type StudioValues } from "@/components/studios/StudioForm";
import { fetchStudios } from "@/lib/studios-api";
import { requireSessionUser } from "@/lib/session";

export const metadata: Metadata = {
  title: "Edit Your Studio — Rentora Studio",
  description: "Update your studio details and keep your listing accurate.",
};

type EditParams = { id: string };

/**
 * Dedicated update route required by the assignment. The session is verified
 * server-side AND the studio must be owned by the signed-in user (ownerEmail
 * from the studios API) before the prefilled form is shown — ownership is
 * never left to the client.
 */
export default async function EditStudioPage({
  params,
}: {
  params: Promise<EditParams>;
}) {
  const { id } = await params;
  const user = await requireSessionUser(`/studios/edit/${id}`);

  const { studios, failed } = await fetchStudios();
  const studio = studios.find((item) => item._id === id);

  // Missing studio, or someone else's listing → never expose or edit it.
  if (!studio || studio.ownerEmail !== user.email) redirect("/my-listings");

  const initial: StudioValues = {
    title: studio.title,
    category: studio.category,
    hourlyRate: String(studio.hourlyRate ?? ""),
    securityDeposit: String(studio.securityDeposit ?? ""),
    capacity: String(studio.capacity ?? ""),
    location: studio.location,
    image: studio.image,
    amenities: studio.amenities ?? [],
    description: studio.description ?? "",
    rating: studio.rating !== undefined ? String(studio.rating) : "",
  };

  return (
    <main className="w-full">
      <div className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6 lg:py-10">
        {/* Header */}
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="max-w-xl">
            <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Edit Your Studio
            </h1>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground sm:text-base">
              Update your studio details and keep your listing accurate.
            </p>
          </div>
          <Button variant="ghost" className="gap-2" render={<Link href="/my-listings" />}>
            <ArrowLeft aria-hidden className="size-4" />
            Back to My Listings
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

        <div className="mt-6">
          <StudioForm mode="edit" studioId={id} initial={initial} />
        </div>
      </div>
    </main>
  );
}
