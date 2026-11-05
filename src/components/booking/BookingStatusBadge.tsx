import type { LucideIcon } from "lucide-react";
import { Ban, CheckCheck, CircleCheck, Clock } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import type { BookingStatus } from "@/lib/types/booking";
import { cn } from "cn";

type BadgeConfig = {
  label: string;
  variant: "default" | "secondary" | "outline";
  icon: LucideIcon;
  className?: string;
};

/** Brand-matched badge for each real booking status. */
const STATUS_CONFIG: Record<BookingStatus, BadgeConfig> = {
  pending: { label: "Pending", variant: "secondary", icon: Clock },
  confirmed: { label: "Confirmed", variant: "default", icon: CircleCheck },
  completed: { label: "Completed", variant: "outline", icon: CheckCheck },
  cancelled: {
    label: "Cancelled",
    variant: "outline",
    icon: Ban,
    className: "border-destructive/30 text-destructive",
  },
};

export default function BookingStatusBadge({
  status,
  className,
}: {
  status: BookingStatus;
  className?: string;
}) {
  const config = STATUS_CONFIG[status];
  const Icon = config.icon;
  return (
    <Badge
      variant={config.variant}
      className={cn("gap-1", config.className, className)}
    >
      <Icon aria-hidden />
      {config.label}
    </Badge>
  );
}
