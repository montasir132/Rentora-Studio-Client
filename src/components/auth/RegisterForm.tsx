"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { toast } from "react-hot-toast";

import { GoogleAuthButton } from "@/components/auth/GoogleAuthButton";
import { PasswordInput } from "@/components/auth/PasswordInput";
import { PasswordRequirements } from "@/components/auth/PasswordRequirements";
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
import { signIn, signUp, useSession } from "@/lib/auth-client";
import {
  authErrorMessage,
  intendedRedirect,
  isValidEmail,
  isValidHttpUrl,
  passwordRuleError,
} from "@/lib/auth-utils";

type FieldErrors = {
  name?: string;
  email?: string;
  image?: string;
  password?: string;
  confirmPassword?: string;
  terms?: string;
};

type RegisterFormProps = {
  /** False when GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET are missing server-side. */
  googleConfigured?: boolean;
};

export function RegisterForm({ googleConfigured = true }: RegisterFormProps) {
  const router = useRouter();
  const session = useSession();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [image, setImage] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [terms, setTerms] = useState(false);

  const [pending, setPending] = useState<null | "credentials" | "google">(null);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const alertRef = useRef<HTMLDivElement>(null);

  // Already signed in? Leave the sign-up screen for the intended route.
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

    if (!name.trim()) next.name = "Please enter your full name.";

    if (!email.trim()) next.email = "Email address is required.";
    else if (!isValidEmail(email)) next.email = "Enter a valid email address.";

    if (image.trim() && !isValidHttpUrl(image)) {
      next.image = "Enter a valid URL starting with http:// or https://.";
    }

    if (!password) next.password = "Password is required.";
    else {
      const ruleMessage = passwordRuleError(password);
      if (ruleMessage) next.password = ruleMessage;
    }

    if (!confirmPassword) next.confirmPassword = "Please confirm your password.";
    else if (confirmPassword !== password) {
      next.confirmPassword = "Passwords do not match.";
    }

    if (!terms) {
      next.terms = "Please accept the Terms & Conditions to continue.";
    }

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
    const loadingId = toast.loading("Creating your account…");
    try {
      const { data, error } = await signUp.email({
        name: name.trim(),
        email: email.trim(),
        password,
        image: image.trim() || undefined,
      });

      if (error) {
        const message = authErrorMessage(
          error,
          "Registration failed. Please try again."
        );
        setFormError(message);
        toast.error(message, { id: loadingId });
        if (error.code === "USER_ALREADY_EXISTS" || error.code === "USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL") {
          setErrors({ email: "An account with this email already exists." });
        }
        return;
      }

      if (data) {
        // Success toast only after Better Auth actually created the account.
        toast.success("Account created successfully! Welcome to Rentora Studio.", {
          id: loadingId,
        });
        router.replace(intendedRedirect());
      }
    } finally {
      setPending(null);
    }
  };

  const handleGoogle = async () => {
    if (pending) return;

    setFormError(null);
    setPending("google");
    const loadingId = toast.loading("Connecting to Google…");
    try {
      const { data, error } = await signIn.social({
        provider: "google",
        callbackURL: intendedRedirect(),
        newUserCallbackURL: intendedRedirect(),
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

  const passwordsMatch =
    confirmPassword.length > 0 && confirmPassword === password;

  return (
    <Card className="shadow-sm">
      <CardHeader className="text-center">
        <CardTitle className="text-xl font-semibold">
          Create your account
        </CardTitle>
        <CardDescription>
          Fill in the details below to join Rentora Studio.
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
            <FieldLabel htmlFor="register-name">Full Name</FieldLabel>
            <Input
              id="register-name"
              name="name"
              type="text"
              autoComplete="name"
              placeholder="Your full name"
              value={name}
              onChange={(event) => {
                setName(event.target.value);
                clearError("name");
              }}
              aria-invalid={errors.name ? true : undefined}
              aria-describedby={errors.name ? "register-name-error" : undefined}
            />
            {errors.name && (
              <FieldError id="register-name-error">{errors.name}</FieldError>
            )}
          </Field>

          <Field>
            <FieldLabel htmlFor="register-email">Email Address</FieldLabel>
            <Input
              id="register-email"
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
              aria-describedby={
                errors.email ? "register-email-error" : undefined
              }
            />
            {errors.email && (
              <FieldError id="register-email-error">{errors.email}</FieldError>
            )}
          </Field>

          <Field>
            <FieldLabel htmlFor="register-image">
              Profile Photo URL{" "}
              <span className="font-normal text-muted-foreground">
                (optional)
              </span>
            </FieldLabel>
            <Input
              id="register-image"
              name="image"
              type="url"
              inputMode="url"
              autoComplete="url"
              placeholder="https://example.com/your-photo.jpg"
              value={image}
              onChange={(event) => {
                setImage(event.target.value);
                clearError("image");
              }}
              aria-invalid={errors.image ? true : undefined}
              aria-describedby={
                errors.image ? "register-image-error" : undefined
              }
            />
            {errors.image && (
              <FieldError id="register-image-error">{errors.image}</FieldError>
            )}
          </Field>

          <Field>
            <FieldLabel htmlFor="register-password">Password</FieldLabel>
            <PasswordInput
              id="register-password"
              name="password"
              autoComplete="new-password"
              placeholder="Create a password"
              value={password}
              onChange={(event) => {
                setPassword(event.target.value);
                clearError("password");
              }}
              aria-invalid={errors.password ? true : undefined}
              aria-describedby="register-password-requirements"
            />
            <PasswordRequirements
              id="register-password-requirements"
              password={password}
              className="mt-1"
            />
            {errors.password && <FieldError>{errors.password}</FieldError>}
          </Field>

          <Field>
            <FieldLabel htmlFor="register-confirm-password">
              Confirm Password
            </FieldLabel>
            <PasswordInput
              id="register-confirm-password"
              name="confirmPassword"
              autoComplete="new-password"
              placeholder="Repeat your password"
              value={confirmPassword}
              onChange={(event) => {
                setConfirmPassword(event.target.value);
                clearError("confirmPassword");
              }}
              aria-invalid={errors.confirmPassword ? true : undefined}
              aria-describedby={
                errors.confirmPassword
                  ? "register-confirm-error"
                  : passwordsMatch
                    ? "register-confirm-hint"
                    : undefined
              }
            />
            {passwordsMatch && (
              <p
                id="register-confirm-hint"
                className="text-xs text-primary transition-colors"
              >
                Passwords match.
              </p>
            )}
            {errors.confirmPassword && (
              <FieldError id="register-confirm-error">
                {errors.confirmPassword}
              </FieldError>
            )}
          </Field>

          <div className="flex flex-col gap-2">
            <Field orientation="horizontal">
              <Checkbox
                id="register-terms"
                name="terms"
                checked={terms}
                onCheckedChange={(checked) => {
                  setTerms(checked);
                  clearError("terms");
                }}
                aria-invalid={errors.terms ? true : undefined}
              />
              <FieldLabel
                htmlFor="register-terms"
                className="font-normal text-sm text-muted-foreground"
              >
                I agree to the{" "}
                <Link
                  href="/terms"
                  className="text-primary underline-offset-4 hover:underline"
                >
                  Terms &amp; Conditions
                </Link>{" "}
                and{" "}
                <Link
                  href="/privacy"
                  className="text-primary underline-offset-4 hover:underline"
                >
                  Privacy Policy
                </Link>
              </FieldLabel>
            </Field>
            {errors.terms && <FieldError>{errors.terms}</FieldError>}
          </div>

          <Button
            type="submit"
            size="lg"
            className="w-full"
            disabled={pending !== null}
          >
            {pending === "credentials" ? (
              <>
                <Loader2 aria-hidden className="size-4 animate-spin" />
                Creating account…
              </>
            ) : (
              "Create Account"
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
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-medium text-primary underline-offset-4 hover:underline"
          >
            Sign In
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
