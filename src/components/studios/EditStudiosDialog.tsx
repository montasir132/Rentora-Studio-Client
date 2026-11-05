"use client";

import { useRouter } from "next/navigation";
import { Pencil } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "cn";

type EditStudiosDialogProps = {
  id: string;
  className?: string;
};

export function EditStudiosDialog({ id, className }: EditStudiosDialogProps) {
  const router = useRouter();

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      className={cn("gap-1.5", className)}
      onClick={() => router.push(`/studios/edit/${encodeURIComponent(id)}`)}
    >
      <Pencil aria-hidden className="size-3.5" />
      Edit
    </Button>
  );
}
