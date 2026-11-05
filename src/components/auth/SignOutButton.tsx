"use client";

import { Loader2, LogOut } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useLogout } from "@/components/auth/logout-button";

/**
 * Standalone sign-out button backed by the shared useLogout hook
 * (real Better Auth sign-out + spec notifications + homepage redirect).
 */
export function SignOutButton() {
  const { logout, pending } = useLogout();

  return (
    <Button
      type="button"
      variant="outline"
      onClick={logout}
      disabled={pending}
    >
      {pending ? (
        <Loader2 aria-hidden className="size-4 animate-spin" />
      ) : (
        <LogOut aria-hidden className="size-4" />
      )}
      {pending ? "Signing out…" : "Sign out"}
    </Button>
  );
}
