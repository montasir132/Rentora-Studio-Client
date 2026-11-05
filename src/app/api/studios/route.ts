/**
 * POST /api/studios   — create a studio listing for the signed-in user.
 * PUT /api/studios    — update one of the user's own listings (ownership enforced).
 */
import { headers } from "next/headers";
import { ObjectId } from "mongodb";

import { auth, db } from "@/lib/auth";
import { studioCategories } from "@/lib/nav";
import { isValidHttpUrl } from "@/lib/auth-utils";

type StudioInput = {
  name: string;
  category: string;
  hourlyRate: number;
  image: string | null;
  description: string | null;
};

const VALID_CATEGORIES = new Set(studioCategories.map((c) => c.slug));

/** Shared server-side validation for create + update. */
function parseStudioInput(body: unknown): StudioInput | { error: string } {
  if (!body || typeof body !== "object") {
    return { error: "Invalid request body." };
  }
  const raw = body as Record<string, unknown>;

  const name = typeof raw.name === "string" ? raw.name.trim() : "";
  if (!name) return { error: "Studio name is required." };
  if (name.length > 100) return { error: "Studio name must be 100 characters or fewer." };

  const category = typeof raw.category === "string" ? raw.category : "";
  if (!VALID_CATEGORIES.has(category)) {
    return { error: "Please choose a valid studio category." };
  }

  const hourlyRate = Number(raw.hourlyRate);
  if (!Number.isFinite(hourlyRate) || hourlyRate <= 0) {
    return { error: "Hourly rate must be a positive number." };
  }
  if (hourlyRate > 100_000) return { error: "Hourly rate looks unrealistic." };

  const imageRaw = typeof raw.image === "string" ? raw.image.trim() : "";
  if (imageRaw && !isValidHttpUrl(imageRaw)) {
    return { error: "Image URL must start with http:// or https://." };
  }

  const descriptionRaw = typeof raw.description === "string" ? raw.description.trim() : "";
  if (descriptionRaw.length > 500) {
    return { error: "Description must be 500 characters or fewer." };
  }

  return {
    name,
    category,
    hourlyRate,
    image: imageRaw || null,
    description: descriptionRaw || null,
  };
}

async function getSessionOr401() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) return null;
  return session.user;
}

export async function POST(request: Request) {
  const user = await getSessionOr401();
  if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const input = parseStudioInput(await request.json().catch(() => null));
  if ("error" in input) return Response.json({ error: input.error }, { status: 422 });

  const now = new Date();
  const doc = {
    hostId: user.id,
    ...input,
    status: "active" as const,
    createdAt: now,
    updatedAt: now,
  };

  const result = await db.collection("studios").insertOne(doc);

  return Response.json(
    { studio: { id: String(result.insertedId), ...doc } },
    { status: 201 }
  );
}

export async function PUT(request: Request) {
  const user = await getSessionOr401();
  if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const body = (await request.json().catch(() => null)) as
    | (Record<string, unknown> & { id?: unknown })
    | null;
  const input = parseStudioInput(body);
  if ("error" in input) return Response.json({ error: input.error }, { status: 422 });

  let objectId: ObjectId;
  try {
    objectId = new ObjectId(String(body?.id ?? ""));
  } catch {
    return Response.json({ error: "Invalid studio id." }, { status: 400 });
  }

  // Ownership check: users can only ever edit their own listings.
  const existing = await db
    .collection("studios")
    .findOne({ _id: objectId, hostId: user.id });
  if (!existing) {
    return Response.json(
      { error: "Studio not found or you do not have permission to edit it." },
      { status: 404 }
    );
  }

  await db.collection("studios").updateOne(
    { _id: objectId, hostId: user.id },
    { $set: { ...input, updatedAt: new Date() } }
  );

  return Response.json({ ok: true });
}
