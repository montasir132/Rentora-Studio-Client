import Link from "next/link";

import { Logo } from "@/components/logo";
import { NewsletterForm } from "@/components/home/newsletter-form";
import {
  XIcon,
  YoutubeIcon,
  InstagramIcon,
  LinkedinIcon,
} from "@/components/social-icons";
import { navLinks, studioCategories } from "@/lib/nav";

const socials = [
  { label: "X", href: "https://x.com", Icon: XIcon },
  { label: "YouTube", href: "https://youtube.com", Icon: YoutubeIcon },
  { label: "Instagram", href: "https://instagram.com", Icon: InstagramIcon },
  { label: "LinkedIn", href: "https://linkedin.com", Icon: LinkedinIcon },
];

function ColumnHeading({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-sm font-semibold tracking-wide text-foreground">
      {children}
    </h3>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid gap-10 py-12 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.6fr] lg:gap-0">
          {/* Brand */}
          <div className="lg:pr-10">
            <Link href="/" aria-label="Rentora Studio home">
              <Logo />
            </Link>
            <p className="mt-3 text-sm font-medium text-muted-foreground">
              Rent. Create. Inspire.
            </p>
          </div>

          {/* Quick links */}
          <div className="lg:border-l lg:border-border lg:px-8">
            <ColumnHeading>Quick Links</ColumnHeading>
            <ul className="mt-4 space-y-2.5">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-primary"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div className="lg:border-l lg:border-border lg:px-8">
            <ColumnHeading>Popular Categories</ColumnHeading>
            <ul className="mt-4 space-y-2.5">
              {studioCategories.map((category) => (
                <li key={category.href}>
                  <Link
                    href={category.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-primary"
                  >
                    {category.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter + socials */}
          <div className="lg:border-l lg:border-border lg:pl-8">
            <ColumnHeading>Subscribe to our Newsletter</ColumnHeading>
            <NewsletterForm />
            <ul className="mt-6 flex items-center gap-3">
              {socials.map(({ label, href, Icon }) => (
                <li key={label}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Rentora Studio on ${label}`}
                    className="grid size-10 place-items-center rounded-full bg-foreground text-background transition-colors hover:bg-primary hover:text-primary-foreground focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
                  >
                    <Icon className="size-4" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Legal bar */}
        <div className="border-t border-border py-5">
          <p className="text-center text-xs text-muted-foreground sm:text-sm">
            © {new Date().getFullYear()} Rentora Studio. All rights reserved.
            <span aria-hidden className="mx-2 text-border">
              |
            </span>
            <Link
              href="/terms"
              className="transition-colors hover:text-foreground"
            >
              Terms &amp; Conditions
            </Link>
            <span aria-hidden className="mx-2 text-border">
              |
            </span>
            <Link
              href="/privacy"
              className="transition-colors hover:text-foreground"
            >
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
