"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, LogOut } from "lucide-react";
import { toast } from "react-hot-toast";

import { Button } from "@/components/ui/button";
import { signOut } from "@/lib/auth-client";
import { cn } from "cn";

/**
 * Real Better Auth sign-out shared by the header dropdown, the mobile menu,
 * the dashboard sidebar and the dashboard sign-out button — one implementation,
 * one set of notifications, no simulated logout.
 */
export function useLogout() {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  const logout = async () => {
    if (pending) return;
    setPending(true);
    const loadingId = toast.loading("Signing out…");
    try {
      const { error } = await signOut();

      if (error) {
        toast.error("Unable to log out. Please try again.", { id: loadingId });
        return;
      }

      // Session cookie is cleared; the shared auth client also flips the
      // navbar back to its guest state immediately.
      toast.success("You have successfully logged out.", { id: loadingId });
      router.replace("/");
      router.refresh();
    } catch {
      toast.error("Unable to log out. Please try again.", { id: loadingId });
    } finally {
      setPending(false);
    }
  };

  return { logout, pending };
}

type LogoutButtonProps = {
  variant?: "ghost" | "outline" | "destructive";
  className?: string;
};

/** Standalone logout button (dashboard sidebar / profile page). */
export function LogoutButton({ variant = "ghost", className }: LogoutButtonProps) {
  const { logout, pending } = useLogout();

  return (
    <Button
      type="button"
      variant={variant}
      onClick={logout}
      disabled={pending}
      className={cn("justify-start gap-2", className)}
    >
      {pending ? (
        <Loader2 aria-hidden className="size-4 animate-spin" />
      ) : (
        <LogOut aria-hidden className="size-4" />
      )}
      {pending ? "Signing out…" : "Logout"}
    </Button>
  );
}
