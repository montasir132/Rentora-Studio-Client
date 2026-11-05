import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { AuthBrandPanel, type AuthBrand } from "@/components/auth/AuthBrandPanel";

type AuthLayoutProps = {
  brand: AuthBrand;
  children: React.ReactNode;
};

/**
 * Split-screen shell shared by /login and /register:
 * brand panel on the left, form slot on the right, with a
 * "Back to Home" link beneath the form.
 */
export function AuthLayout({ brand, children }: AuthLayoutProps) {
  return (
    <div className="grid min-h-[calc(100dvh-4rem)] w-full lg:grid-cols-2">
      <AuthBrandPanel {...brand} />

      <div className="flex flex-col items-center justify-center gap-6 px-4 py-10 sm:px-8">
        <div className="w-full max-w-md">{children}</div>

        <Link
          href="/"
          className="inline-flex items-center gap-1.5 rounded-full px-2 py-1 text-sm font-medium text-muted-foreground transition-colors hover:text-primary focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
        >
          <ArrowLeft aria-hidden className="size-4" />
          Back to Home
        </Link>
      </div>
    </div>
  );
}
