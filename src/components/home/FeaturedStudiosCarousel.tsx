"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import StudioCard from "@/components/studios/StudiosCard";
import { cn } from "@/lib/utils";
import type { Studio } from "@/lib/studiostype";

export default function FeaturedStudiosCarousel({ studios }: { studios: Studio[] }) {
  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);
  const [count, setCount] = React.useState(studios.length);
  const [canScrollPrev, setCanScrollPrev] = React.useState(false);
  const [canScrollNext, setCanScrollNext] = React.useState(false);

  React.useEffect(() => {
    if (!api) return;

    const onSelect = (emblaApi: CarouselApi) => {
      if (!emblaApi) return;
      setCurrent(emblaApi.selectedScrollSnap());
      setCanScrollPrev(emblaApi.canScrollPrev());
      setCanScrollNext(emblaApi.canScrollNext());
    };

    // Embla's API is an external system; sync our state to it on mount.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCount(api.scrollSnapList().length);
    onSelect(api);
    api.on("select", onSelect);
    api.on("reInit", onSelect);
    return () => {
      api.off("select", onSelect);
      api.off("reInit", onSelect);
    };
  }, [api]);

  const segmentWidth = count > 0 ? 100 / count : 100;

  const arrowClass = (enabled: boolean) =>
    cn(
      "flex h-10 w-10 items-center justify-center rounded-full border border-border text-foreground transition-colors",
      enabled
        ? "hover:border-primary hover:bg-primary hover:text-primary-foreground"
        : "cursor-default opacity-50"
    );

  return (
    <section id="featured" className="my-20 w-full scroll-mt-24 bg-background px-4 py-12 sm:px-6 sm:py-16">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-5 sm:mb-10 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-primary sm:text-4xl">
              Featured Studios
            </h2>
            <p className="mt-3 text-base text-muted-foreground">
              Top-rated creative spaces, handpicked for your next shoot, session or show
            </p>
          </div>
          <Link
            href="/studios"
            className="group flex w-fit items-center gap-2 rounded-full border border-primary px-5 py-2.5 text-sm font-semibold uppercase tracking-wide text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
          >
            All Studios
            <ArrowRight aria-hidden className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>

        {/* Slides */}
        <Carousel setApi={setApi} opts={{ align: "start", loop: false }}>
          <CarouselContent>
            {studios.map((studio) => (
              <CarouselItem
                key={studio._id}
                className="basis-[85%] sm:basis-1/2 lg:basis-1/3"
              >
                <StudioCard studio={studio} />
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>

        {/* Footer: counter + progress bar + arrows */}
        <div className="mt-8 flex items-center gap-4 sm:gap-6">
          <p className="shrink-0 text-sm font-medium tabular-nums text-foreground">
            {current + 1}
            <span className="text-muted-foreground">/{count}</span>
          </p>

          <div
            className="relative h-0.5 flex-1 overflow-hidden rounded-full bg-border"
            role="progressbar"
            aria-label="Carousel progress"
            aria-valuemin={1}
            aria-valuemax={count}
            aria-valuenow={current + 1}
          >
            <div
              className="absolute inset-y-0 left-0 rounded-full bg-primary transition-all duration-300"
              style={{
                width: `${segmentWidth}%`,
                transform: `translateX(${current * 100}%)`,
              }}
            />
          </div>

          <div className="flex shrink-0 items-center gap-2.5">
            <button
              type="button"
              aria-label="Previous slide"
              disabled={!canScrollPrev}
              onClick={() => api?.scrollPrev()}
              className={arrowClass(canScrollPrev)}
            >
              <ChevronLeft aria-hidden className="h-5 w-5" />
            </button>
            <button
              type="button"
              aria-label="Next slide"
              disabled={!canScrollNext}
              onClick={() => api?.scrollNext()}
              className={arrowClass(canScrollNext)}
            >
              <ChevronRight aria-hidden className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}