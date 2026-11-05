"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
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
import { cn } from "cn";

type DeleteStudiosDialogProps = {
  id: string;
  onDeleted?: () => void;
  className?: string;
};

/**
 * Custom confirmation dialog for deleting a studio listing.
 * Preserves the project's existing DELETE API call
 * (`NEXT_PUBLIC_STUDIO_DELETE_API_URL/:id`) — success only fires after the
 * API actually responds OK, duplicate submissions are blocked, and no
 * browser confirm()/alert() is used.
 */
export default function DeleteStudiosDialog({
  id,
  onDeleted,
  className,
}: DeleteStudiosDialogProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState(false);

  const handleDelete = async () => {
    if (pending) return; // prevent duplicate delete submissions
    setPending(true);
    const loadingId = toast.loading("Deleting studio…");

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_STUDIO_DELETE_API_URL}/${id}`,
        {
          method: "DELETE",
        }
      );

      if (!res.ok) {
        console.error(`Failed to delete studio: ${res.status}`);
        throw new Error(`Request failed: ${res.status}`);
      }

      // Only after the API confirmed: notify, close, then refresh the data.
      toast.success("Studio listing deleted successfully.", { id: loadingId });
      setOpen(false);
      if (onDeleted) onDeleted();
      else router.refresh();
    } catch {
      // Keep the dialog open so the user can retry.
      toast.error("Unable to delete this studio. Please try again.", {
        id: loadingId,
      });
    } finally {
      setPending(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger
        render={
          <Button
            type="button"
            variant="outline"
            size="sm"
            className={cn(
              "gap-1.5 text-destructive hover:border-destructive/40 hover:text-destructive",
              className
            )}
          />
        }
      >
        <Trash2 aria-hidden className="size-3.5" />
        Delete
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Studio?</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete this studio? This action cannot be
            undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={pending}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={pending}
            className="bg-destructive text-white hover:bg-destructive/90"
          >
            {pending ? "Deleting…" : "Delete Studio"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
