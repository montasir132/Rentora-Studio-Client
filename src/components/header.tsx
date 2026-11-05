"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Loader2, LogOut, Menu } from "lucide-react";

import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  UserDropdown,
  filterProfileMenuItems,
  hasHostPermission,
} from "@/components/auth/user-dropdown";
import { useLogout } from "@/components/auth/logout-button";
import { useSession } from "@/lib/auth-client";
import { navLinks, isActivePath } from "@/lib/nav";
import { cn } from "@/lib/utils";

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
  // Real Better Auth session (HTTPOnly cookie). Sign-in/up/out anywhere in
  // the app flips this immediately — no manual refresh needed.
  const { data: session } = useSession();
  const user = session?.user ?? null;

  const [mobileOpen, setMobileOpen] = useState(false);
  const { logout, pending } = useLogout();

  const isHost = hasHostPermission(user);
  const mobileMenuItems = filterProfileMenuItems(isHost);

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
            <UserDropdown />
          ) : (
            <>
              <Button
                variant="ghost"
                className="rounded-full px-4"
                render={<Link href="/login" />}
              >
                Login
              </Button>
              <Button
                className="rounded-full px-4"
                render={<Link href="/register" />}
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
                      {user.image ? (
                        <AvatarImage src={user.image} alt={user.name} />
                      ) : null}
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
                  {mobileMenuItems.map((item) => {
                    const Icon = item.icon;
                    const active = isActivePath(pathname, item.href);
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setMobileOpen(false)}
                        aria-current={active ? "page" : undefined}
                        className={cn(
                          "flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors hover:bg-muted",
                          active ? "bg-muted text-primary" : "text-foreground"
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
                      </Link>
                    );
                  })}
                  <Button
                    variant="ghost"
                    onClick={() => {
                      setMobileOpen(false);
                      void logout();
                    }}
                    disabled={pending}
                    className="justify-start gap-2 px-3 text-destructive hover:text-destructive"
                  >
                    {pending ? (
                      <Loader2 aria-hidden className="size-4 animate-spin" />
                    ) : (
                      <LogOut aria-hidden className="size-4" />
                    )}
                    {pending ? "Signing out…" : "Logout"}
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant="outline"
                    className="rounded-full"
                    render={<Link href="/login" />}
                    onClick={() => setMobileOpen(false)}
                  >
                    Login
                  </Button>
                  <Button
                    className="rounded-full"
                    render={<Link href="/register" />}
                    onClick={() => setMobileOpen(false)}
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
