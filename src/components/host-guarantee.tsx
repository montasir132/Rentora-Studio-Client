import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  Headphones,
  ShieldCheck,
  Wrench,
  type LucideIcon,
} from "lucide-react";

type Assurance = {
  icon: LucideIcon;
  title: string;
  text: string;
};

const assurances: Assurance[] = [
  {
    icon: ShieldCheck,
    title: "Liability Protection",
    text: "Every booking is backed by host liability cover, so an accident on set is handled by us — never by you.",
  },
  {
    icon: BadgeCheck,
    title: "Verified Profiles",
    text: "Hosts are ID-checked and each listing is reviewed before it goes live. Reviews come only from real bookings.",
  },
  {
    icon: Wrench,
    title: "Equipment Safety",
    text: "Gear checklists, secure access codes and clear house rules keep your kit protected from load-in to wrap.",
  },
  {
    icon: Headphones,
    title: "24/7 Host Support",
    text: "Real humans, around the clock — reach us before, during or after your session and we respond fast.",
  },
];

/** "Host Guarantee & Creator Support" — platform assurances in a 2×2 grid. */
export function HostGuarantee() {
  return (
    <section id="about" aria-labelledby="guarantee-heading" className="bg-card">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 md:py-20">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.5fr)] lg:gap-16">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-3 py-1 text-xs font-semibold uppercase tracking-widest text-primary">
              <ShieldCheck aria-hidden className="size-3.5" />
              Book with confidence
            </span>
            <h2
              id="guarantee-heading"
              className="mt-4 text-balance text-3xl font-extrabold tracking-tight sm:text-4xl"
            >
              Host Guarantee &amp; Creator Support
            </h2>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-muted-foreground sm:text-base">
              Renting a studio should feel safe for hosts and creators alike.
              Every session on Rentora Studio is protected by four promises.
            </p>
            <Link
              href="/how-it-works"
              className="group mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-primary transition-colors hover:text-primary/80 focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
            >
              Learn how booking works
              <ArrowRight
                aria-hidden
                className="size-4 transition-transform duration-200 group-hover:translate-x-1"
              />
            </Link>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {assurances.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  className="rounded-2xl border border-border bg-background p-5 shadow-sm sm:p-6"
                >
                  <span className="grid size-11 place-items-center rounded-full bg-primary/10 text-primary">
                    <Icon aria-hidden className="size-5" />
                  </span>
                  <h3 className="mt-4 text-base font-semibold tracking-tight">
                    {item.title}
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                    {item.text}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
