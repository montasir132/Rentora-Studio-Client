"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { toast } from "react-hot-toast";

import { GoogleAuthButton } from "@/components/auth/GoogleAuthButton";
import { PasswordInput } from "@/components/auth/PasswordInput";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { signIn, useSession } from "@/lib/auth-client";
import {
  authErrorMessage,
  intendedRedirect,
  isValidEmail,
} from "@/lib/auth-utils";

type FieldErrors = { email?: string; password?: string };

type LoginFormProps = {
  /** False when GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET are missing server-side. */
  googleConfigured?: boolean;
};

export function LoginForm({ googleConfigured = true }: LoginFormProps) {
  const router = useRouter();
  const session = useSession();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [pending, setPending] = useState<null | "credentials" | "google">(null);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const alertRef = useRef<HTMLDivElement>(null);

  // Already signed in? Leave the login screen for the intended route.
  useEffect(() => {
    if (!session.isPending && session.data) {
      router.replace(intendedRedirect());
    }
  }, [session.isPending, session.data, router]);

  // Keep the persistent form-level alert focused for screen readers.
  useEffect(() => {
    if (formError) {
      alertRef.current?.focus();
    }
  }, [formError]);

  const clearError = (key: keyof FieldErrors) => {
    setErrors((previous) => {
      if (!previous[key]) return previous;
      const next = { ...previous };
      delete next[key];
      return next;
    });
  };

  const validate = (): FieldErrors => {
    const next: FieldErrors = {};
    if (!email.trim()) next.email = "Email address is required.";
    else if (!isValidEmail(email)) next.email = "Enter a valid email address.";
    if (!password) next.password = "Password is required.";
    return next;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (pending) return;

    setFormError(null);
    const nextErrors = validate();
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }
    setErrors({});

    setPending("credentials");
    const loadingId = toast.loading("Signing in…");
    try {
      const { data, error } = await signIn.email({
        email: email.trim(),
        password,
        rememberMe: remember,
      });

      if (error) {
        const message = authErrorMessage(error, "Sign in failed. Please try again.");
        setFormError(message);
        toast.error(message, { id: loadingId });
        return;
      }

      if (data) {
        // Success toast only after Better Auth actually returned a session.
        toast.success("Welcome back! Login successful.", { id: loadingId });
        router.replace(intendedRedirect());
      }
    } finally {
      setPending(null);
    }
  };

  const handleGoogle = async () => {
    if (pending) return;

    setFormError(null);
    setErrors({});
    setPending("google");
    const loadingId = toast.loading("Connecting to Google…");
    try {
      const { data, error } = await signIn.social({
        provider: "google",
        callbackURL: intendedRedirect(),
      });

      if (error) {
        const message = googleConfigured
          ? authErrorMessage(error, "Google sign-in failed. Please try again.")
          : "Google sign-in isn’t configured. Set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in .env.";
        setFormError(message);
        toast.error(message, { id: loadingId });
        return;
      }

      // The browser leaves this page for Google's consent screen.
      if (data?.url) {
        window.location.assign(data.url);
      }
    } catch {
      toast.error("Google sign-in failed. Please try again.", { id: loadingId });
    } finally {
      setPending(null);
    }
  };

  return (
    <Card className="shadow-sm">
      <CardHeader className="text-center">
        <CardTitle className="text-xl font-semibold">
          Sign in to your account
        </CardTitle>
        <CardDescription>
          Enter your details to continue to Rentora Studio.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form
          noValidate
          onSubmit={handleSubmit}
          className="flex flex-col gap-5"
        >
          {formError && (
            <div
              ref={alertRef}
              role="alert"
              tabIndex={-1}
              className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm font-medium text-destructive outline-none"
            >
              {formError}
            </div>
          )}

          <Field>
            <FieldLabel htmlFor="login-email">Email Address</FieldLabel>
            <Input
              id="login-email"
              name="email"
              type="email"
              inputMode="email"
              autoComplete="email"
              placeholder="you@example.com"
              value={email}
              onChange={(event) => {
                setEmail(event.target.value);
                clearError("email");
              }}
              aria-invalid={errors.email ? true : undefined}
              aria-describedby={errors.email ? "login-email-error" : undefined}
            />
            {errors.email && (
              <FieldError id="login-email-error">{errors.email}</FieldError>
            )}
          </Field>

          <Field>
            <FieldLabel htmlFor="login-password">Password</FieldLabel>
            <PasswordInput
              id="login-password"
              name="password"
              autoComplete="current-password"
              placeholder="Enter your password"
              value={password}
              onChange={(event) => {
                setPassword(event.target.value);
                clearError("password");
              }}
              aria-invalid={errors.password ? true : undefined}
              aria-describedby={
                errors.password ? "login-password-error" : undefined
              }
            />
            {errors.password && (
              <FieldError id="login-password-error">
                {errors.password}
              </FieldError>
            )}
          </Field>

          <Field orientation="horizontal">
            <Checkbox
              id="login-remember"
              name="rememberMe"
              checked={remember}
              onCheckedChange={setRemember}
            />
            <FieldLabel
              htmlFor="login-remember"
              className="font-normal text-muted-foreground"
            >
              Remember me
            </FieldLabel>
          </Field>

          <Button type="submit" size="lg" className="w-full" disabled={pending !== null}>
            {pending === "credentials" ? (
              <>
                <Loader2 aria-hidden className="size-4 animate-spin" />
                Signing in…
              </>
            ) : (
              "Sign In"
            )}
          </Button>

          <FieldSeparator className="*:data-[slot=field-separator-content]:bg-card">
            Or continue with
          </FieldSeparator>

          <GoogleAuthButton
            onClick={handleGoogle}
            pending={pending === "google"}
            disabled={pending !== null}
          />
          {!googleConfigured && (
            <FieldDescription className="text-center">
              Google sign-in is unavailable until GOOGLE_CLIENT_ID and
              GOOGLE_CLIENT_SECRET are added to .env.
            </FieldDescription>
          )}
        </form>
      </CardContent>

      <CardFooter className="flex-col gap-1.5">
        <p className="text-sm text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link
            href="/register"
            className="font-medium text-primary underline-offset-4 hover:underline"
          >
            Create an account
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
