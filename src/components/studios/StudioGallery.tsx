"use client";

import { useState } from "react";
import { ImageOff, Maximize2 } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "cn";

type StudioGalleryProps = {
  /** All real image URLs — the primary cover first, gallery images after. */
  images: string[];
  alt: string;
};

/**
 * Studio image gallery: large primary image with click-to-preview dialog and
 * thumbnail navigation when the API returns more than one image. Renders
 * gracefully with a single image (or none at all) — never fake thumbnails.
 */
export default function StudioGallery({ images, alt }: StudioGalleryProps) {
  const list = images.filter((src) => typeof src === "string" && src.trim());
  const [activeIndex, setActiveIndex] = useState(0);
  const current = list[Math.min(activeIndex, list.length - 1)];

  if (list.length === 0) {
    return (
      <div className="grid aspect-16/10 w-full place-items-center rounded-xl border border-border bg-muted text-muted-foreground">
        <div className="flex flex-col items-center gap-2">
          <ImageOff aria-hidden className="size-8" />
          <p className="text-sm">No photos available yet</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <Dialog>
        <DialogTrigger
          render={
            <button
              type="button"
              aria-label={`Preview ${alt}`}
              className="group relative aspect-16/10 w-full overflow-hidden rounded-xl border border-border bg-muted outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
            />
          }
        >
          {/* API images point at arbitrary hosts — plain img (see StudiosCard). */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={current}
            alt={alt}
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 ease-out group-hover:scale-[1.03]"
          />
          <span className="absolute right-3 bottom-3 flex items-center gap-1.5 rounded-full bg-background/90 px-3 py-1.5 text-xs font-semibold text-foreground opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
            <Maximize2 aria-hidden className="size-3.5" />
            Preview
          </span>
        </DialogTrigger>

        <DialogContent className="max-w-4xl border-border bg-card p-4">
          <DialogHeader>
            <DialogTitle className="text-base">{alt}</DialogTitle>
          </DialogHeader>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={current}
            alt={alt}
            className="max-h-[70vh] w-full rounded-lg object-contain"
          />
        </DialogContent>
      </Dialog>

      {list.length > 1 ? (
        <ul className="flex flex-wrap gap-2" aria-label="Studio photos">
          {list.map((src, index) => (
            <li key={src}>
              <button
                type="button"
                onClick={() => setActiveIndex(index)}
                aria-label={`Show photo ${index + 1}`}
                aria-current={index === activeIndex}
                className={cn(
                  "size-16 overflow-hidden rounded-lg border-2 outline-none transition-all focus-visible:ring-3 focus-visible:ring-ring/50",
                  index === activeIndex
                    ? "border-primary"
                    : "border-border opacity-70 hover:opacity-100"
                )}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={src}
                  alt=""
                  loading="lazy"
                  className="h-full w-full object-cover"
                />
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
