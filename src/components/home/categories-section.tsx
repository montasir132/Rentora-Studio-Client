import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { studioCategories } from "@/lib/nav";

/**
 * "Browse by Studio Categories" — each card links to /studios with the
 * category pre-selected via the `?category=<slug>` query param.
 */
export function CategoriesSection() {
  return (
    <section id="" aria-labelledby="categories-heading" className="relative">
      {/* Decorative glow, mirrors the hero's gradient language */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 opacity-60"
        style={{
          background:
            "radial-gradient(45% 55% at 50% 0%, color-mix(in srgb, var(--primary) 8%, transparent), transparent)",
        }}
      />

      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 md:py-20">
        <div className="max-w-2xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-semibold uppercase tracking-widest text-primary">
            Explore the spaces
          </span>
          <h2
            id="categories-heading"
            className="mt-4 text-balance text-3xl font-extrabold tracking-tight sm:text-4xl"
          >
            Browse by Studio Categories
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
            From daylight photo lofts to sound-treated stages — pick your craft
            and land straight on listings that fit it.
          </p>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {studioCategories.map((category) => {
            const Icon = category.icon;
            return (
              <Link
                key={category.slug}
                href={category.href}
                className="group flex flex-col rounded-2xl border border-border bg-card p-5 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-primary/40 hover:shadow-xl focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none sm:p-6"
              >
                <span className="grid size-12 place-items-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <Icon aria-hidden className="size-6" />
                </span>
                <h3 className="mt-4 text-base font-semibold tracking-tight sm:text-lg">
                  {category.label}
                </h3>
                <p className="mt-1.5 flex-1 text-sm leading-relaxed text-muted-foreground">
                  {category.description}
                </p>
                <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-primary">
                  Explore studios
                  <ArrowRight
                    aria-hidden
                    className="size-4 transition-transform duration-200 group-hover:translate-x-1"
                  />
                </span>
              </Link>
            );
          })}

          {/* Fills the grid so the last row never leaves a gap */}
          <Link
            href="/studios"
            className="group flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-border bg-muted/50 p-6 text-center transition-colors hover:border-primary/50 hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
          >
            <span className="grid size-12 place-items-center rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/25 transition-transform duration-200 group-hover:scale-105">
              <ArrowRight aria-hidden className="size-5" />
            </span>
            <span className="font-semibold">Browse all studios</span>
            <span className="text-sm text-muted-foreground">
              Every space, across all categories
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}
