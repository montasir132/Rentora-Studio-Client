
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function isValidEmail(value: string): boolean {
  return EMAIL_PATTERN.test(value.trim());
}

export function isValidHttpUrl(value: string): boolean {
  try {
    const url = new URL(value.trim());
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

export type PasswordRule = {
  id: "length" | "uppercase" | "lowercase";
  label: string;
  test: (password: string) => boolean;
};

export const passwordRules: PasswordRule[] = [
  { id: "length", label: "At least 6 characters", test: (password) => password.length >= 6 },
  { id: "uppercase", label: "At least one uppercase letter (A–Z)", test: (password) => /[A-Z]/.test(password) },
  { id: "lowercase", label: "At least one lowercase letter (a–z)", test: (password) => /[a-z]/.test(password) },
];

export function isPasswordValid(password: string): boolean {
  return passwordRules.every((rule) => rule.test(password));
}

export function passwordRuleError(password: string): string | undefined {
  const failures: Record<PasswordRule["id"], string> = {
    length: "Password must be at least 6 characters.",
    uppercase: "Password must include at least one uppercase letter.",
    lowercase: "Password must include at least one lowercase letter.",
  };
  const failedRule = passwordRules.find((rule) => !rule.test(password));
  return failedRule ? failures[failedRule.id] : undefined;
}

export function safeRedirect(target: string | null | undefined, fallback = "/dashboard"): string {
  if (!target) return fallback;
  const value = target.trim();
  if (!value.startsWith("/") || value.startsWith("//") || value.includes("\\")) {
    return fallback;
  }
  return value;
}

export function intendedRedirect(fallback = "/dashboard"): string {
  if (typeof window === "undefined") return fallback;
  return safeRedirect(
    new URLSearchParams(window.location.search).get("redirect"),
    fallback
  );
}

type AuthClientError = { code?: string; message?: string } | null | undefined;

export function authErrorMessage(
  error: AuthClientError,
  fallback = "Something went wrong. Please try again."
): string {
  if (!error) return fallback;

  switch (error.code) {
    case "INVALID_EMAIL_OR_PASSWORD":
      return "Incorrect email or password. Please try again.";
    case "USER_NOT_FOUND":
      return "No account found with this email.";
    case "INVALID_PASSWORD":
      return "Incorrect password. Please try again.";
    case "USER_ALREADY_EXISTS":
    case "USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL":
      return "An account with this email already exists. Try signing in instead.";
    case "EMAIL_NOT_VERIFIED":
      return "Please verify your email address before signing in.";
    case "TOO_MANY_REQUESTS":
      return "Too many attempts. Please wait a moment and try again.";
    case "MISSING_FIELDS":
      return "Please fill in all required fields.";
    case "PASSWORD_TOO_SHORT":
      return "Password must be at least 6 characters.";
    case "PASSWORD_TOO_LONG":
      return "Password is too long.";
    case "INVALID_EMAIL":
      return "Enter a valid email address.";
    default: {
      const message = error.message?.trim();
      if (!message || /fetch|network|failed to/i.test(message)) {
        return "Can't reach the server. Check your connection and try again.";
      }
      return message;
    }
  }
}
