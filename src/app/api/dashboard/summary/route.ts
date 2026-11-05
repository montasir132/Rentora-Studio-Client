/**
 * GET /api/dashboard/summary — real dashboard numbers for the signed-in user.
 * Session is read server-side from the HTTPOnly cookie; nothing is trusted
 * from the client.
 */
import { headers } from "next/headers";

import { auth } from "@/lib/auth";
import { getDashboardSummary } from "@/lib/dashboard";

export async function GET() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const summary = await getDashboardSummary({
    id: session.user.id,
    email: session.user.email,
  });

  return Response.json(summary);
}
