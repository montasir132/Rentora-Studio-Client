"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Building2,
  CalendarCheck,
  ClipboardList,
  CirclePlus,
  LayoutDashboard,
  Loader2,
  LogOut,
  UserRound,
  type LucideIcon,
} from "lucide-react";

import { Logo } from "@/components/logo";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { useLogout } from "@/components/auth/logout-button";
import { isActivePath } from "@/lib/nav";
import { cn } from "cn";

type SidebarNavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
  /** Only rendered for accounts with verified host permission. */
  hostOnly?: boolean;
};

const sidebarNavItems: SidebarNavItem[] = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/my-bookings", label: "My Bookings", icon: CalendarCheck },
  { href: "/add-studio", label: "Add New Studio", icon: CirclePlus },
  { href: "/my-listings", label: "My Studio Listings", icon: Building2 },
  { href: "/host/bookings", label: "Host Bookings", icon: ClipboardList, hostOnly: true },
  { href: "/profile", label: "My Profile", icon: UserRound },
];

type DashboardSidebarProps = {
  /** Server-verified host permission — not inferred on the client. */
  isHost: boolean;
};

/**
 * Dashboard navigation: collapsible on desktop (rail click or Ctrl/Cmd+B),
 * a Sheet drawer on mobile. Uses the shared sidebar tokens from globals.css
 * and the same session-aware logout as the navbar.
 */
export function DashboardSidebar({ isHost }: DashboardSidebarProps) {
  const pathname = usePathname();
  const { logout, pending } = useLogout();

  const items = sidebarNavItems.filter((item) => !item.hostOnly || isHost);

  return (
    <Sidebar collapsible="icon" className="pt-16">
      <SidebarHeader>
        <Link
          href="/"
          aria-label="Rentora Studio home"
          className="flex w-fit items-center gap-2 rounded-lg px-1 py-1 outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          <Logo />
        </Link>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => {
                const Icon = item.icon;
                const active = isActivePath(pathname, item.href);
                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      render={<Link href={item.href} />}
                      isActive={active}
                      tooltip={item.label}
                      className={cn(
                        "gap-2.5",
                        active && "bg-sidebar-accent font-medium text-sidebar-primary"
                      )}
                    >
                      <Icon aria-hidden className="size-4" />
                      <span>{item.label}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarSeparator />
        <SidebarMenu className="px-2 py-2">
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={logout}
              disabled={pending}
              tooltip="Logout"
              className="gap-2.5 text-destructive hover:text-destructive data-[active]:text-destructive"
            >
              {pending ? (
                <Loader2 aria-hidden className="size-4 animate-spin" />
              ) : (
                <LogOut aria-hidden className="size-4" />
              )}
              <span>{pending ? "Signing out…" : "Logout"}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
