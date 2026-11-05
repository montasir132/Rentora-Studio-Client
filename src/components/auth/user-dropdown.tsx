"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Building2,
  CalendarCheck,
  ChevronDown,
  LayoutDashboard,
  Loader2,
  LogOut,
  CirclePlus,
  type LucideIcon,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLogout } from "@/components/auth/logout-button";
import { useSession } from "@/lib/auth-client";
import { isActivePath } from "@/lib/nav";
import { cn } from "@/lib/utils";

export type ProfileMenuItem = {
  href: string;
  label: string;
  icon: LucideIcon;
  hostOnly?: boolean;
};
 
export const profileMenuItems: ProfileMenuItem[] = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/add-studio", label: "Add New Studio", icon: CirclePlus },
  { href: "/my-listings", label: "My Studio Listings", icon: Building2 },
  { href: "/my-bookings", label: "My Bookings", icon: CalendarCheck },
];

 
export function hasHostPermission(user: unknown): boolean {
  if (!user || typeof user !== "object") return false;
  return (user as { hostVerified?: unknown }).hostVerified === true;
}

export function filterProfileMenuItems(isHost: boolean): ProfileMenuItem[] {
  return profileMenuItems.filter((item) => !item.hostOnly || isHost);
}

type UserDropdownProps = {
  align?: "start" | "end";
  className?: string;
};

/** Avatar + name trigger with the authenticated user's menu. Renders nothing for guests. */
export function UserDropdown({ align = "end", className }: UserDropdownProps) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const user = session?.user ?? null;
  const { logout, pending } = useLogout();

  if (!user) return null;

  const isHost = hasHostPermission(user);
  const items = filterProfileMenuItems(isHost);
  const initials =
    user.name
      .split(" ")
      .map((part) => part[0])
      .filter(Boolean)
      .slice(0, 2)
      .join("")
      .toUpperCase() || "U";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={cn(
          "flex items-center gap-2 rounded-full border border-border py-1 pl-1 pr-2.5 outline-none transition-colors hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/50",
          className
        )}
      >
        <Avatar size="sm">
          {user.image ? <AvatarImage src={user.image} alt={user.name} /> : null}
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
        <span className="hidden max-w-28 truncate text-sm font-medium sm:inline">
          {user.name}
        </span>
        <ChevronDown aria-hidden className="size-3.5 text-muted-foreground" />
      </DropdownMenuTrigger>

      <DropdownMenuContent align={align} sideOffset={8} className="w-60">
        {/* Label must live inside a Group in Base UI */}
        <DropdownMenuGroup>
          <DropdownMenuLabel className="text-xs">
            <span className="flex items-center gap-3">
              <Avatar size="sm">
                {user.image ? <AvatarImage src={user.image} alt={user.name} /> : null}
                <AvatarFallback>{initials}</AvatarFallback>
              </Avatar>
              <span className="min-w-0">
                <span className="block truncate font-medium text-foreground">
                  {user.name}
                </span>
                <span className="block truncate font-normal">{user.email}</span>
              </span>
            </span>
          </DropdownMenuLabel>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          {items.map((item) => {
            const Icon = item.icon;
            const active = isActivePath(pathname, item.href);
            return (
              <DropdownMenuItem
                key={item.href}
                render={<Link href={item.href} />}
                className={cn(
                  "gap-2.5 px-2.5 py-2",
                  active && "bg-accent font-medium text-primary"
                )}
              >
                <Icon
                  aria-hidden
                  className={cn(
                    "size-4 text-muted-foreground",
                    active && "text-primary"
                  )}
                />
                {item.label}
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuGroup>

        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem
            variant="destructive"
            onClick={() => void logout()}
            disabled={pending}
            className="gap-2.5 px-2.5 py-2"
          >
            {pending ? (
              <Loader2 aria-hidden className="size-4 animate-spin" />
            ) : (
              <LogOut aria-hidden className="size-4" />
            )}
            {pending ? "Signing out…" : "Logout"}
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}