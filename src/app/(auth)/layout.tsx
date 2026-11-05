import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "Account",
    template: "%s · Rentora Studio",
  },
  description:
    "Sign in to your Rentora Studio account or create one to book creative studios.",
};

/** Shared shell for the (auth) route group: background + page titles. */
export default function AuthPagesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="flex flex-1 flex-col bg-background">{children}</div>;
}
