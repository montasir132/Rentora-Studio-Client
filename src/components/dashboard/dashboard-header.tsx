import { SidebarTrigger } from "@/components/ui/sidebar";
import { UserDropdown } from "@/components/auth/user-dropdown";

type DashboardHeaderProps = {
  /** Real session user name — never hardcoded. */
  name: string;
  /** Pre-formatted on the server to avoid timezone hydration mismatches. */
  dateLabel: string;
};

/**
 * Dashboard top bar: mobile sidebar trigger, welcome message, current date
 * and the profile dropdown. Rendered as a server component — the only client
 * pieces are the imported trigger and dropdown.
 */
export function DashboardHeader({ name, dateLabel }: DashboardHeaderProps) {
  return (
    <header className="sticky top-16 z-30 border-b border-border bg-background/95 px-4 py-3 backdrop-blur sm:px-6">
      <div className="flex items-center gap-3">
        <SidebarTrigger
          aria-label="Open dashboard menu"
          className="shrink-0 md:hidden"
        />

        <div className="min-w-0 flex-1">
          <h1 className="truncate text-lg font-bold text-foreground sm:text-xl">
            Welcome back, {name}!
          </h1>
          <p className="truncate text-sm text-muted-foreground">
            {dateLabel}
            <span className="hidden sm:inline">
              {" "}
              · Here&apos;s an overview of your bookings and studios.
            </span>
          </p>
        </div>

        <UserDropdown align="end" />
      </div>
    </header>
  );
}
