import Link from "next/link";
import { Button } from "@/components/ui/button";
import type { Studio } from "@/lib/studiostype";
import FeaturedStudiosCarousel from "./FeaturedStudiosCarousel";

/**
 * Existing featured API: GET NEXT_PUBLIC_FEATURED_API_URL (/featured).
 * The endpoint returns the top-rated studios as a bare array.
 */
async function getFeaturedStudios(): Promise<Studio[]> {
  const featuredApi = process.env.NEXT_PUBLIC_FEATURED_API_URL;
  if (!featuredApi) {
    console.error("Featured studios api is not configured");
    return [];
  }

  try {
    const res = await fetch(featuredApi, { next: { revalidate: 60 } });
    if (!res.ok) {
      console.error(`Featured studios api failed: ${res.status}`);
      return [];
    }
    const data = await res.json();
    return Array.isArray(data) ? (data as Studio[]) : [];
  } catch (error) {
    console.error("Featured studios api error:", error);
    return [];
  }
}

export default async function FeaturedStudios() {
  const studios = await getFeaturedStudios();

  if (studios.length === 0) {
    return (
      <section
        id="featured"
        className="mx-auto my-20 max-w-3xl px-4 text-center"
      >
        <h2 className="text-3xl font-bold text-primary sm:text-4xl">
          Featured Studios
        </h2>
        <p className="mt-3 text-muted-foreground">
          No studios to show yet. Be the first to list a space and meet creators
          looking for one.
        </p>
        <Button className="mt-6" size="lg" render={<Link href="/add-studio" />}>
          Host Your Space
        </Button>
      </section>
    );
  }

  return <FeaturedStudiosCarousel studios={studios} />;
}
