import Link from "next/link";
import {
  Building2,
  CalendarCheck,
  CirclePlus,
  Compass,
  type LucideIcon,
} from "lucide-react";

type QuickAction = {
  href: string;
  label: string;
  description: string;
  icon: LucideIcon;
};

const quickActions: QuickAction[] = [
  {
    href: "/studios",
    label: "Explore Studios",
    description: "Browse creative spaces near you",
    icon: Compass,
  },
  {
    href: "/add-studio",
    label: "Add New Studio",
    description: "List a space you own",
    icon: CirclePlus,
  },
  {
    href: "/my-bookings",
    label: "View My Bookings",
    description: "Track your reservations",
    icon: CalendarCheck,
  },
  {
    href: "/my-listings",
    label: "Manage My Listings",
    description: "Edit your studio listings",
    icon: Building2,
  },
];

/** Shortcut cards to the most common tasks. */
export function QuickActions() {
  return (
    <section aria-labelledby="quick-actions-heading" className="flex flex-col gap-3">
      <h2 id="quick-actions-heading" className="text-base font-semibold text-foreground">
        Quick Actions
      </h2>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {quickActions.map((action) => {
          const Icon = action.icon;
          return (
            <Link
              key={action.href}
              href={action.href}
              className="group flex items-center gap-3 rounded-xl border border-border bg-card p-4 outline-none transition-colors hover:border-primary/40 hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/50"
            >
              <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                <Icon aria-hidden className="size-4.5" />
              </span>
              <span className="min-w-0">
                <span className="block truncate text-sm font-semibold text-foreground">
                  {action.label}
                </span>
                <span className="block truncate text-xs text-muted-foreground">
                  {action.description}
                </span>
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
