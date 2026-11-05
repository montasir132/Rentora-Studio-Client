import type { Metadata } from "next";

import { AuthLayout } from "@/components/auth/AuthLayout";
import { LoginForm } from "@/components/auth/LoginForm";

export const metadata: Metadata = {
  title: "Sign in",
  description:
    "Welcome back. Sign in to find your creative space and continue your journey with Rentora Studio.",
};

/** Boolean only — the Google credentials themselves never reach the client. */
const googleConfigured = Boolean(
  process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
);

export default function LoginPage() {
  return (
    <AuthLayout
      brand={{
        heading: "Welcome Back!",
        text: "Find your creative space and continue your journey with Rentora Studio.",
        image:
          "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1400&q=80",
        alt: "Bright creative studio workspace with desks and natural light",
      }}
    >
      <LoginForm googleConfigured={googleConfigured} />
    </AuthLayout>
  );
}
