import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "cn";

/** The official multi-colour Google mark (lucide has no brand icons). */
function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
      className={className ?? "size-4"}
    >
      <path
        fill="#4285F4"
        d="M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.47a5.54 5.54 0 0 1-2.4 3.63v3.02h3.88c2.27-2.09 3.54-5.17 3.54-8.89z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.01c-1.08.72-2.45 1.16-4.05 1.16-3.13 0-5.78-2.11-6.73-4.96H1.28v3.09A11.99 11.99 0 0 0 12 24z"
      />
      <path
        fill="#FBBC05"
        d="M5.27 14.28a7.2 7.2 0 0 1 0-4.56V6.63H1.28a12 12 0 0 0 0 10.74l3.99-3.09z"
      />
      <path
        fill="#EA4335"
        d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0A11.99 11.99 0 0 0 1.28 6.63l3.99 3.09C6.22 6.86 8.87 4.75 12 4.75z"
      />
    </svg>
  );
}

type GoogleAuthButtonProps = {
  onClick: () => void;
  pending?: boolean;
  disabled?: boolean;
  className?: string;
};

/**
 * "Continue with Google" — triggers Better Auth's social sign-in.
 * The click handler lives in the form so this stays a pure view component.
 */
export function GoogleAuthButton({
  onClick,
  pending = false,
  disabled = false,
  className,
}: GoogleAuthButtonProps) {
  return (
    <Button
      type="button"
      variant="outline"
      size="lg"
      onClick={onClick}
      disabled={disabled || pending}
      className={cn("w-full gap-2", className)}
    >
      {pending ? (
        <Loader2 aria-hidden className="size-4 animate-spin" />
      ) : (
        <GoogleIcon className="size-4 shrink-0" />
      )}
      {pending ? "Connecting to Google…" : "Continue with Google"}
    </Button>
  );
}
