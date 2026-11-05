import Image from "next/image";
import Link from "next/link";
import { Aperture, Sparkles } from "lucide-react";

export type AuthBrand = {
  heading: string;
  text: string;
  image: string;
  alt: string;
};

/**
 * Left half of the auth split screen: brand surface in --primary (burgundy in
 * light mode, dusty rose in dark mode), studio photo, heading and copy.
 *
 * The wordmark is inlined instead of reusing <Logo> because <Logo> uses
 * bg-primary/text-foreground directly and is tuned for light surfaces —
 * on a primary panel it would disappear in both themes.
 */
export function AuthBrandPanel({ heading, text, image, alt }: AuthBrand) {
  return (
    <aside className="relative isolate overflow-hidden bg-primary text-primary-foreground">
      {/* Subtle decorative brand circles (primary-foreground at 5% works in both themes) */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -right-20 -top-24 size-72 rounded-full bg-primary-foreground/5" />
        <div className="absolute -bottom-28 -left-10 size-80 rounded-full bg-primary-foreground/5" />
      </div>

      <div className="flex h-full flex-col gap-6 p-6 sm:p-8 lg:gap-8 lg:p-12">
        <div className="flex flex-col gap-4">
          <Link
            href="/"
            aria-label="Rentora Studio home"
            className="flex w-fit items-center gap-2.5 rounded-full focus-visible:ring-3 focus-visible:ring-primary-foreground/50 focus-visible:outline-none"
          >
            <span
              aria-hidden="true"
              className="grid size-9 shrink-0 place-items-center rounded-full bg-primary-foreground/15"
            >
              <Aperture className="size-5" strokeWidth={2.25} />
            </span>
            <span className="text-xl font-bold tracking-tight">
              Rentora <span className="text-primary-foreground/70">Studio</span>
            </span>
          </Link>

          <span className="inline-flex w-fit items-center gap-2 rounded-full bg-primary-foreground/10 px-3 py-1 text-xs font-semibold tracking-widest uppercase">
            <Sparkles aria-hidden className="size-3.5" />
            Rent. Create. Inspire.
          </span>
        </div>

        <div className="relative min-h-44 flex-1 overflow-hidden rounded-2xl border border-primary-foreground/15 sm:min-h-56 lg:min-h-64">
          <Image
            src={image}
            alt={alt}
            fill
            priority
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover"
          />
        </div>

        <div className="flex flex-col gap-3 pb-2 lg:pb-6">
          <h1 className="text-balance text-2xl font-extrabold leading-tight tracking-tight sm:text-3xl">
            {heading}
          </h1>
          <p className="max-w-md text-sm leading-relaxed text-primary-foreground/80 sm:text-base">
            {text}
          </p>
        </div>
      </div>
    </aside>
  );
}
