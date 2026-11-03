"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, LayoutDashboard, Plus, Building2, CalendarCheck, LogOut, Menu } from "lucide-react";

import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { navLinks, isActivePath } from "@/lib/nav";
import { cn } from "@/lib/utils";

/** Demo identity so both header states can be previewed without a backend. */
const demoUser = {
  name: "Alex Carter",
  email: "alex@rentora.studio",
  avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=96&q=80",
};

type User = typeof demoUser | null;

const userMenuItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/studios/new", label: "Add New Studio", icon: Plus },
  { href: "/dashboard/listings", label: "My Studio Listings", icon: Building2 },
  { href: "/dashboard/bookings", label: "My Bookings", icon: CalendarCheck },
];

function navItemClass(active: boolean) {
  return cn(
    "relative text-sm font-medium transition-colors hover:text-primary",
    active ? "text-primary" : "text-foreground/80",
    active &&
      "after:absolute after:-bottom-1.5 after:left-0 after:h-0.5 after:w-full after:rounded-full after:bg-primary"
  );
}

export function Header() {
  const pathname = usePathname();
  // Starts signed out (matches the sample navbar); Login/Register flip the demo user on.
  const [user, setUser] = useState<User>(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/80">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link href="/" aria-label="Rentora Studio home" className="shrink-0">
          <Logo />
        </Link>

        {/* Desktop nav */}
        <nav aria-label="Main" className="hidden items-center gap-7 md:flex">
          {navLinks.map((link) => {
            const active = isActivePath(pathname, link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={navItemClass(active)}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Desktop actions */}
        <div className="hidden items-center gap-2 md:flex">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-2 rounded-full border border-border py-1 pl-1 pr-2.5 outline-none transition-colors hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/50">
                <Avatar size="sm">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback>
                    {user.name
                      .split(" ")
                      .map((part) => part[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <span className="max-w-28 truncate text-sm font-medium">
                  {user.name}
                </span>
                <ChevronDown aria-hidden className="size-3.5 text-muted-foreground" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" sideOffset={8} className="w-56">
                <DropdownMenuLabel className="text-xs">
                  <span className="block truncate font-medium text-foreground">
                    {user.name}
                  </span>
                  <span className="block truncate font-normal">
                    {user.email}
                  </span>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {userMenuItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <DropdownMenuItem
                      key={item.href}
                      render={<Link href={item.href} />}
                      className="gap-2"
                    >
                      <Icon aria-hidden className="size-4 text-muted-foreground" />
                      {item.label}
                    </DropdownMenuItem>
                  );
                })}
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  variant="destructive"
                  onClick={() => setUser(null)}
                  className="gap-2"
                >
                  <LogOut aria-hidden className="size-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Button
                variant="ghost"
                className="rounded-full px-4"
                onClick={() => setUser(demoUser)}
              >
                Login
              </Button>
              <Button
                className="rounded-full px-4"
                onClick={() => setUser(demoUser)}
              >
                Register
              </Button>
            </>
          )}
        </div>

        {/* Mobile trigger */}
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger
            render={
              <Button
                variant="ghost"
                size="icon"
                aria-label="Open menu"
                className="md:hidden"
              />
            }
          >
            <Menu aria-hidden className="size-5" />
          </SheetTrigger>
          <SheetContent side="right" className="w-72">
            <SheetHeader>
              <SheetTitle className="sr-only">Menu</SheetTitle>
            </SheetHeader>
            <nav aria-label="Mobile" className="flex flex-col gap-1 px-4">
              {navLinks.map((link) => {
                const active = isActivePath(pathname, link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    aria-current={active ? "page" : undefined}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      "rounded-lg px-3 py-2.5 text-base font-medium transition-colors hover:bg-muted",
                      active ? "bg-muted text-primary" : "text-foreground"
                    )}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>
            <div className="mt-2 flex flex-col gap-2 border-t border-border px-4 pt-4">
              {user ? (
                <>
                  <div className="flex items-center gap-3 px-3">
                    <Avatar size="sm">
                      <AvatarImage src={user.avatar} alt={user.name} />
                      <AvatarFallback>
                        {user.name
                          .split(" ")
                          .map((part) => part[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">{user.name}</p>
                      <p className="truncate text-xs text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </div>
                  {userMenuItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setMobileOpen(false)}
                        className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors hover:bg-muted"
                      >
                        <Icon aria-hidden className="size-4 text-muted-foreground" />
                        {item.label}
                      </Link>
                    );
                  })}
                  <Button
                    variant="ghost"
                    className="justify-start gap-2 px-3 text-destructive hover:text-destructive"
                    onClick={() => {
                      setUser(null);
                      setMobileOpen(false);
                    }}
                  >
                    <LogOut aria-hidden className="size-4" />
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant="outline"
                    className="rounded-full"
                    onClick={() => setUser(demoUser)}
                  >
                    Login
                  </Button>
                  <Button
                    className="rounded-full"
                    onClick={() => setUser(demoUser)}
                  >
                    Register
                  </Button>
                </>
              )}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
