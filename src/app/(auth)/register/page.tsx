import type { Metadata } from "next";

import { AuthLayout } from "@/components/auth/AuthLayout";
import { RegisterForm } from "@/components/auth/RegisterForm";

export const metadata: Metadata = {
  title: "Create account",
  description:
    "Join a community of creators and discover spaces that bring your ideas to life — with Rentora Studio.",
};

/** Boolean only — the Google credentials themselves never reach the client. */
const googleConfigured = Boolean(
  process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
);

export default function RegisterPage() {
  return (
    <AuthLayout
      brand={{
        heading: "Start Your Creative Journey",
        text: "Join a community of creators and discover spaces that bring your ideas to life.",
        image:
          "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=1400&q=80",
        alt: "Music production studio with a mixing console and warm lighting",
      }}
    >
      <RegisterForm googleConfigured={googleConfigured} />
    </AuthLayout>
  );
}
