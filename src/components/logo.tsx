import { Aperture } from "lucide-react";
import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <span className={cn("flex items-center gap-2.5", className)}>
      <span
        aria-hidden
        className="grid size-9 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground"
      >
        <Aperture className="size-5" strokeWidth={2.25} />
      </span>
      <span className="text-xl font-bold tracking-tight">
        <span className="text-foreground">Rentora</span>{" "}
        <span className="text-primary">Studio</span>
      </span>
    </span>
  );
}
