import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, BadgeCheck, CalendarDays, Mail, ShieldCheck, UserRound } from "lucide-react";

import { SignOutButton } from "@/components/auth/SignOutButton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { isHostAccount, requireSessionUser } from "@/lib/session";

export const metadata: Metadata = {
  title: "My Profile — Rentora Studio",
};

function formatMemberSince(value: Date | string | undefined): string {
  if (!value) return "—";
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

/** Read-only account overview built from the real session + user record. */
export default async function ProfilePage() {
  const user = await requireSessionUser("/profile");
  const isHost = await isHostAccount(user.email);

  const initials =
    user.name
      .split(" ")
      .map((part) => part[0])
      .filter(Boolean)
      .slice(0, 2)
      .join("")
      .toUpperCase() || "U";

  return (
    <section className="mx-auto w-full max-w-2xl px-4 py-10 sm:px-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold text-foreground">My Profile</h1>
        <p className="text-sm text-muted-foreground">
          Your Rentora Studio account details.
        </p>
      </div>

      <Card className="mt-6 shadow-sm">
        <CardHeader>
          <div className="flex items-center gap-4">
            <Avatar size="lg">
              {user.image ? <AvatarImage src={user.image} alt={user.name} /> : null}
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <CardTitle className="truncate text-lg font-semibold">
                {user.name}
              </CardTitle>
              <CardDescription className="truncate">{user.email}</CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="flex flex-col gap-4">
          <div className="flex flex-wrap gap-2">
            <Badge
              variant={user.emailVerified ? "default" : "secondary"}
              className="gap-1.5"
            >
              <BadgeCheck aria-hidden className="size-3.5" />
              {user.emailVerified ? "Email verified" : "Email not verified"}
            </Badge>
            <Badge variant={isHost ? "default" : "outline"} className="gap-1.5">
              <ShieldCheck aria-hidden className="size-3.5" />
              {isHost ? "Verified host" : "Standard member"}
            </Badge>
          </div>

          <dl className="flex flex-col divide-y divide-border rounded-lg border border-border">
            <div className="flex items-center gap-3 px-4 py-3">
              <UserRound aria-hidden className="size-4 text-muted-foreground" />
              <dt className="text-sm text-muted-foreground">Full name</dt>
              <dd className="ml-auto truncate text-sm font-medium text-foreground">
                {user.name}
              </dd>
            </div>
            <div className="flex items-center gap-3 px-4 py-3">
              <Mail aria-hidden className="size-4 text-muted-foreground" />
              <dt className="text-sm text-muted-foreground">Email address</dt>
              <dd className="ml-auto truncate text-sm font-medium text-foreground">
                {user.email}
              </dd>
            </div>
            <div className="flex items-center gap-3 px-4 py-3">
              <CalendarDays aria-hidden className="size-4 text-muted-foreground" />
              <dt className="text-sm text-muted-foreground">Member since</dt>
              <dd className="ml-auto text-sm font-medium text-foreground">
                {formatMemberSince(user.createdAt)}
              </dd>
            </div>
          </dl>

          <div className="flex flex-wrap gap-2">
            <SignOutButton />
            <Button variant="ghost" render={<Link href="/dashboard" />}>
              <ArrowLeft aria-hidden className="size-4" />
              Back to Dashboard
            </Button>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
