import { ArrowRight, CalendarDays, Search, Sparkles, Zap, type LucideIcon } from "lucide-react";

type BookingStep = {
  step: string;
  icon: LucideIcon;
  title: string;
  text: string;
};

const bookingSteps: BookingStep[] = [
  {
    step: "Step 01",
    icon: Search,
    title: "Discover Spaces",
    text: "Browse studios by category, location and amenities — real photos, honest reviews and transparent hourly rates.",
  },
  {
    step: "Step 02",
    icon: CalendarDays,
    title: "Select Shoot Hours",
    text: "Pick the date and time slot that fits your schedule and see live availability the moment you search.",
  },
  {
    step: "Step 03",
    icon: Zap,
    title: "Book Instantly",
    text: "Confirm and pay in one step. Instant approval — no back-and-forth messages with the host required.",
  },
  {
    step: "Step 04",
    icon: Sparkles,
    title: "Create & Produce",
    text: "Check in with your booking code, shoot your project, then leave a review when you wrap.",
  },
];

/** "How Booking Works" — 4-step workflow with arrow connectors between cards. */
export function BookingSteps() {
  return (
    <section id="how-it-works" className="pt-14">
      <div aria-labelledby="booking-steps-heading" className="border-y border-border">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 md:py-20">
          <div className="mx-auto max-w-2xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-semibold uppercase tracking-widest text-primary">
              How booking works
            </span>
            <h2
              id="booking-steps-heading"
              className="mt-4 text-balance text-3xl font-extrabold tracking-tight sm:text-4xl"
            >
              Four steps from idea to shoot day
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
              No quote requests, no waiting around. Here is the whole journey —
              start to finish.
            </p>
          </div>

          <ol className="mt-12 grid gap-8 md:grid-cols-4">
            {bookingSteps.map((item, index) => {
              const Icon = item.icon;
              const isLast = index === bookingSteps.length - 1;
              return (
                <li key={item.title} className="relative">
                  {/* Connector, drawn in the gap between cards on desktop */}
                  {!isLast && (
                    <ArrowRight
                      aria-hidden
                      className="absolute top-1/2 -right-6.5 hidden size-5 -translate-y-1/2 text-primary/50 md:block"
                    />
                  )}
                  <div className="flex h-full flex-col rounded-2xl border border-border bg-card p-6 shadow-sm">
                    <span className="text-xs font-bold tracking-[0.18em] text-primary">
                      {item.step}
                    </span>
                    <span className="mt-5 grid size-12 place-items-center rounded-xl bg-primary/10 text-primary">
                      <Icon aria-hidden className="size-6" />
                    </span>
                    <h3 className="mt-4 text-base font-semibold tracking-tight sm:text-lg">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {item.text}
                    </p>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
