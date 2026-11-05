import { Check, Circle, X } from "lucide-react";
import { passwordRules } from "@/lib/auth-utils";
import { cn } from "cn";

type PasswordRequirementsProps = {
  password: string;
  id?: string;
  className?: string;
};

/**
 * Live password rule checklist shown under the sign-up password field.
 * Neutral before typing, then success/error indicators as the user types.
 */
export function PasswordRequirements({
  password,
  id,
  className,
}: PasswordRequirementsProps) {
  const touched = password.length > 0;

  return (
    <ul
      id={id}
      aria-live="polite"
      className={cn("flex flex-col gap-1.5", className)}
    >
      {passwordRules.map((rule) => {
        const met = rule.test(password);
        const Icon = met ? Check : touched ? X : Circle;
        return (
          <li
            key={rule.id}
            className={cn(
              "flex items-center gap-2 text-xs transition-colors",
              met
                ? "text-primary"
                : touched
                  ? "text-destructive"
                  : "text-muted-foreground"
            )}
          >
            <Icon aria-hidden className="size-3.5 shrink-0" />
            <span>{rule.label}</span>
          </li>
        );
      })}
    </ul>
  );
}
