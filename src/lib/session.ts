import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { auth, db } from "@/lib/auth";

export type SessionUser = {
  id: string;
  name: string;
  email: string;
  image?: string | null;
  emailVerified: boolean;
  createdAt?: Date | string;
};

export async function getSessionUser(): Promise<SessionUser | null> {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  return (session?.user as SessionUser | undefined) ?? null;
}

export async function requireSessionUser(pathname: string): Promise<SessionUser> {
  const user = await getSessionUser();
  if (!user) {
    redirect(`/login?redirect=${encodeURIComponent(pathname)}`);
  }
  return user;
}

export async function isHostAccount(email: string): Promise<boolean> {
  const doc = await db
    .collection("user")
    .findOne<{ hostVerified?: unknown }>({ email });
  return doc?.hostVerified === true;
}
