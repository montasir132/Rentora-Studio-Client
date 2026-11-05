"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function NewsletterForm() {
  const [subscribed, setSubscribed] = useState(false);

  if (subscribed) {
    return (
      <p
        role="status"
        className="mt-4 inline-block rounded-full border border-border bg-card px-4 py-2 text-sm font-medium text-foreground"
      >
        You&apos;re on the list — watch your inbox!
      </p>
    );
  }

  return (
    <form
      className="mt-4"
      onSubmit={(event) => {
        event.preventDefault();
        // No backend yet — acknowledge locally.
        setSubscribed(true);
      }}
    >
      <div className="relative">
        <Input
          type="email"
          required
          autoComplete="email"
          placeholder="Your email address"
          aria-label="Email address"
          className="h-11 rounded-full border-border bg-card pl-4 pr-32 shadow-sm"
        />
        <Button
          type="submit"
          className="absolute right-1.5 top-1/2 h-8 -translate-y-1/2 rounded-full px-4"
        >
          Subscribe
        </Button>
      </div>
    </form>
  );
}
