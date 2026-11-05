"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Ban, Loader2 } from "lucide-react";
import { toast } from "react-hot-toast";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useSession } from "@/lib/auth-client";
import type { Booking } from "@/lib/types/booking";

/**
 * Pending-only cancellation through the project's existing API
 * (DELETE NEXT_PUBLIC_BOOKING_DELETE_API_URL/:id — same endpoint, method and
 * Authorization header the original implementation used).
 *
 * The success toast only fires after the API actually responds; failures
 * keep the booking untouched and surface an error toast. A `pending` guard
 * prevents duplicate requests, and there is no browser confirm()/alert().
 */
export default function CancelBookingDialog({
  booking,
}: {
  booking: Booking;
}) {
  const router = useRouter();
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState(false);

  const handleCancel = async () => {
    if (pending) return; // never send duplicate requests

    const deleteApi = process.env.NEXT_PUBLIC_BOOKING_DELETE_API_URL;
    if (!deleteApi) {
      console.error("Booking delete api is not configured");
      toast.error("Unable to cancel this booking. Please try again.");
      return;
    }

    // Real session token when available — header preserved from the WIP.
    const token = session?.session?.token;
    const headers: Record<string, string> = {};
    if (token) headers.Authorization = `Bearer ${token}`;

    setPending(true);
    try {
      const res = await fetch(`${deleteApi}/${booking._id}`, {
        method: "DELETE",
        headers,
      });
      if (!res.ok) throw new Error(`Request failed: ${res.status}`);

      // Notifications only after the API actually responded.
      toast.success("Booking cancelled successfully.");
      setOpen(false);
      router.refresh(); // re-render the server-fetched booking list
    } catch {
      // Keep the dialog open and the booking exactly as it was.
      toast.error("Unable to cancel this booking. Please try again.");
    } finally {
      setPending(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger
        render={<Button variant="destructive" className="gap-2" disabled={pending} />}
      >
        <Ban aria-hidden className="size-4" />
        Cancel Booking
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Cancel This Booking?</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to cancel this booking? This action cannot be
            undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={pending}>Keep Booking</AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            disabled={pending}
            onClick={handleCancel}
          >
            {pending ? (
              <Loader2 aria-hidden className="size-4 animate-spin" />
            ) : null}
            {pending ? "Cancelling…" : "Yes, Cancel Booking"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
