import type { Metadata } from "next";

import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";
import { DashboardStats } from "@/components/dashboard/dashboard-stats";
import { QuickActions } from "@/components/dashboard/quick-actions";
import { RecentBookings } from "@/components/dashboard/recent-bookings";
import { RecentListings } from "@/components/dashboard/recent-listings";
import { SidebarProvider } from "@/components/ui/sidebar";
import { getDashboardSummary } from "@/lib/dashboard";
import { requireSessionUser } from "@/lib/session";

export const metadata: Metadata = {
  title: "Dashboard — Rentora Studio",
  description:
    "Your Rentora Studio dashboard: bookings, listings and account overview.",
};

/**
 * Default authenticated destination. Session is verified on the server from
 * the HTTPOnly cookie; unauthenticated visitors are redirected to /login with
 * the intended path preserved in ?redirect=.
 */
export default async function DashboardPage() {
  const user = await requireSessionUser("/dashboard");
  const summary = await getDashboardSummary({
    id: user.id,
    email: user.email,
  });

  // Formatted on the server so the date never causes a hydration mismatch.
  const dateLabel = new Intl.DateTimeFormat("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date());

  return (
    <SidebarProvider>
      <DashboardSidebar isHost={summary.isHost} />

      <div className="flex min-w-0 flex-1 flex-col">
        <DashboardHeader name={user.name} dateLabel={dateLabel} />

        <main className="flex flex-1 flex-col gap-8 px-4 py-6 sm:px-6 lg:px-8">
          <DashboardStats renter={summary.renter} host={summary.host} />

          <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
            <div className="xl:col-span-2">
              <RecentBookings bookings={summary.recentBookings} />
            </div>
            <QuickActions />
          </div>

          {summary.isHost ? (
            <RecentListings listings={summary.recentListings} />
          ) : null}
        </main>
      </div>
    </SidebarProvider>
  );
}
