import Link from "next/link";
import type { LucideIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "cn";

type EmptyStateProps = {
  icon: LucideIcon;
  title: string;
  description: string;
  /** Link CTA (`href`) or button CTA (`onAction`) — one or both. */
  action?: { href?: string; label: string; onAction?: () => void };
  className?: string;
};

/** Friendly empty state: icon, helpful copy and a relevant CTA. */
export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-3 px-6 py-12 text-center",
        className
      )}
    >
      <span className="grid size-12 place-items-center rounded-full bg-primary/10 text-primary">
        <Icon aria-hidden className="size-6" />
      </span>
      <div className="flex flex-col gap-1">
        <h3 className="text-base font-semibold text-foreground">{title}</h3>
        <p className="max-w-sm text-sm text-muted-foreground">{description}</p>
      </div>
      {action ? (
        <Button
          {...(action.href ? { render: <Link href={action.href} /> } : {})}
          onClick={action.onAction}
          className="mt-1 rounded-full"
        >
          {action.label}
        </Button>
      ) : null}
    </div>
  );
}
