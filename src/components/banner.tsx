"use client";

import { useRef, useState } from "react";
import type { PointerEvent } from "react";
import Image from "next/image";
import Link from "next/link";

import { Swiper, SwiperSlide } from "swiper/react";
import { A11y, Autoplay, EffectFade, Pagination } from "swiper/modules";
import type { Swiper as SwiperInstance } from "swiper";
import type { LucideIcon } from "lucide-react";
import {
  ArrowRight,
  Camera,
  ChevronLeft,
  ChevronRight,
  Mic,
  Music2,
  Sparkles,
} from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/pagination";

type HeroSlide = {
  id: string;
  badge: string;
  icon: LucideIcon;
  title: string;
  text: string;
  image: string;
  alt: string;
  statIcon: LucideIcon;
  statLabel: string;
  statValue: string;
};

const slides: HeroSlide[] = [
  {
    id: "podcast",
    badge: "For every creative vision",
    icon: Sparkles,
    title: "Your vision deserves the perfect space.",
    text: "Explore inspiring podcast rooms, music suites and production studios designed for creators.",
    image:
      "https://images.unsplash.com/photo-1478737270239-2f02b77fc618?auto=format&fit=crop&w=1400&q=80",
    alt: "Podcast microphone in a recording room",
    statIcon: Mic,
    statLabel: "Explore category",
    statValue: "Podcast Rooms",
  },
  {
    id: "creative",
    badge: "A creative space for every vision",
    icon: Camera,
    title: "Find your space. Create something extraordinary.",
    text: "Discover photography studios, podcast rooms, music suites and creative workspaces. Your next big idea starts here.",
    image:
      "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1400&q=80",
    alt: "Bright creative studio space",
    statIcon: Camera,
    statLabel: "Discover",
    statValue: "Creative Spaces",
  },
  {
    id: "music",
    badge: "Book by the hour",
    icon: Music2,
    title: "Record, shoot and rehearse on your schedule.",
    text: "Send a flexible hourly request, get a reply from the host and book the studio that fits your session.",
    image:
      "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=1400&q=80",
    alt: "Music production studio with mixing console",
    statIcon: Music2,
    statLabel: "Flexible sessions",
    statValue: "Hourly Booking",
  },
];

// ----------------------------------
// 3D Tilt Card
// ----------------------------------

function TiltCard({ slide }: { slide: HeroSlide }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const StatIcon = slide.statIcon;

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card || event.pointerType !== "mouse") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const rect = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;

    card.style.transform = `rotateX(${-y * 8}deg) rotateY(${x * 8}deg)`;
  };

  const resetTilt = () => {
    if (cardRef.current) {
      cardRef.current.style.transform = "rotateX(0deg) rotateY(0deg)";
    }
  };

  return (
    <div
      className="perspective-distant"
      onPointerMove={handlePointerMove}
      onPointerLeave={resetTilt}
    >
      <div
        ref={cardRef}
        className="relative transition-transform duration-200 ease-out motion-reduce:transition-none"
        style={{ transformStyle: "preserve-3d" }}
      >
        <div className="rounded-2xl border border-border bg-card p-2 shadow sm:rounded-3xl sm:p-3 ">
          <div className="relative aspect-4/3 w-full overflow-hidden rounded-2xl">
            {/* priority = সব ছবি আগেই লোড হবে, তাই স্লাইড বদলানোর সময় ছবি দেরিতে আসবে না */}
            <Image
              src={slide.image}
              alt={slide.alt}
              fill
              sizes="(max-width: 768px) 90vw, (max-width: 1280px) 50vw, 560px"
              priority
              className="object-cover"
            />
          </div>
        </div>

        <div
          className="absolute -bottom-5 left-2 z-10 flex items-center gap-2.5 rounded-2xl border border-border bg-card px-3 py-2.5 sm:gap-3 sm:px-4 sm:py-3 text-card-foreground shadow-xl sm:-left-6"
          style={{ transform: "translateZ(45px)" }}
        >
          <span className="grid size-9 shrink-0 place-items-center rounded-xl sm:size-11 bg-accent text-accent-foreground">
            <StatIcon className="size-5" />
          </span>
          <span className="leading-tight">
            <span className="block text-xs text-muted-foreground">
              {slide.statLabel}
            </span>
            <span className="block text-sm font-bold sm:text-lg">
              {slide.statValue}
            </span>
          </span>
        </div>
      </div>
    </div>
  );
}

// ----------------------------------
// Arrow button (সব স্ক্রিনে দেখা যাবে, নিজস্ব স্টাইল তাই variant এর উপর নির্ভর করে না)
// ----------------------------------

function ArrowButton({
  direction,
  onClick,
}: {
  direction: "prev" | "next";
  onClick: () => void;
}) {
  const Icon = direction === "prev" ? ChevronLeft : ChevronRight;

  return (
    <button
      type="button"
      aria-label={direction === "prev" ? "Previous slide" : "Next slide"}
      onClick={onClick}
      className={cn(
        "absolute z-30 bottom-2 md:bottom-auto md:top-1/2 md:-translate-y-1/2",
        "grid size-9 place-items-center rounded-full sm:size-10 md:size-12",
        "border border-border bg-card/90 text-foreground shadow-lg backdrop-blur",
        "transition-colors hover:bg-primary hover:text-primary-foreground",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        direction === "prev" ? "left-4 md:left-5" : "right-4 md:right-5"
      )}
    >
      <Icon className="size-4 sm:size-5 md:size-6" />
    </button>
  );
}

// ----------------------------------
// Hero Section
// ----------------------------------

export default function HeroSection() {
    const [swiper, setSwiper] = useState<SwiperInstance | null>(null);

    return (
        <section
        aria-label="Featured creative studios"
        className="relative isolate w-full max-w-full overflow-hidden bg-background text-foreground"
        >
        <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 -z-10 opacity-70"
            style={{
            background: `
                radial-gradient(60% 60% at 85% 20%, color-mix(in srgb, var(--secondary) 30%, transparent), transparent),
                radial-gradient(50% 50% at 10% 90%, color-mix(in srgb, var(--primary) 15%, transparent), transparent)
            `,
            }}
        />

        <Swiper
            modules={[Autoplay, EffectFade, Pagination, A11y]}
            effect="fade"
            fadeEffect={{ crossFade: true }}
            slidesPerView={1}
            loop
            speed={700}
            autoplay={{
            delay: 5500,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
            }}
            pagination={{ clickable: true }}
            onSwiper={(instance) => {
            setSwiper(instance);
            // reduced-motion হলে autoplay বন্ধ
            if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
                instance.autoplay?.stop();
            }
            }}
            className={cn(
            "w-full overflow-hidden pb-14 md:pb-12",
            "[&_.swiper-pagination]:bottom-5 md:[&_.swiper-pagination]:bottom-3",
            "[&_.swiper-pagination-bullet]:size-2",
            "[&_.swiper-pagination-bullet]:rounded-full",
            "[&_.swiper-pagination-bullet]:bg-muted-foreground/40",
            "[&_.swiper-pagination-bullet]:opacity-100",
            "[&_.swiper-pagination-bullet]:transition-all",
            "[&_.swiper-pagination-bullet-active]:w-7",
            "[&_.swiper-pagination-bullet-active]:bg-primary"
            )}
        >
            {slides.map((slide) => {
            const BadgeIcon = slide.icon;

            return (
                <SwiperSlide key={slide.id}>
                {/* px-14 = দুই পাশে arrow এর জন্য জায়গা */}
                <div className="mx-auto grid max-w-7xl items-center gap-8 px-5 py-10 sm:px-8 sm:py-12 md:min-h-130 md:grid-cols-2 md:gap-10 md:px-20 md:py-14 lg:min-h-150 lg:gap-14 lg:px-24 2xl:max-w-350">
                    <div className="mx-auto w-full max-w-xl md:mx-0">
                    <Badge
                        variant="outline"
                        className="mb-6 gap-2 rounded-full border-border bg-card/70 px-3 py-1.5 text-xs font-medium text-foreground backdrop-blur"
                    >
                        <BadgeIcon className="size-3.5 text-primary" />
                        {slide.badge}
                    </Badge>

                    <h1 className="text-balance text-[1.9rem] font-extrabold leading-[1.1] tracking-tight sm:text-4xl lg:text-5xl xl:text-6xl">
                        {slide.title}
                    </h1>

                    <p className="mt-4 max-w-md text-sm leading-relaxed text-muted-foreground sm:mt-5 sm:text-base lg:text-lg">
                        {slide.text}
                    </p>

                    <div className="mt-6 flex flex-col gap-3 sm:mt-8 sm:flex-row">
                        <Link
                        href="/studios"
                        className={cn(
                            buttonVariants({ size: "lg" }),
                            "w-full justify-center rounded-xl px-6 shadow-md shadow-primary/15 sm:w-auto"
                        )}
                        >
                        Explore Studios
                        <ArrowRight className="ml-1 size-4" />
                        </Link>

                        <Link
                        href="/add-studio"
                        className={cn(
                            buttonVariants({ size: "lg", variant: "outline" }),
                            "w-full justify-center rounded-xl border-primary/30 bg-card/70 px-6 backdrop-blur sm:w-auto",
                            "hover:bg-accent hover:text-accent-foreground"
                        )}
                        >
                        Host Your Space
                        </Link>
                    </div>
                    </div>

                    <div className="mx-auto w-full max-w-sm pb-6 sm:max-w-md md:max-w-xl">
                    <TiltCard slide={slide} />
                    </div>
                </div>
                </SwiperSlide>
            );
            })}
        </Swiper>

        <ArrowButton direction="prev" onClick={() => swiper?.slidePrev()} />
        <ArrowButton direction="next" onClick={() => swiper?.slideNext()} />
        </section>
    );
}