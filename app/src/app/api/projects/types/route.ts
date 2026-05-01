import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/supabase/auth";
import { resolveProjectTypes } from "@/lib/project-types";

export const dynamic = "force-dynamic";

/**
 * GET /api/projects/types
 *
 * Lightweight fetch of the org's effective project-type list. Used by
 * the project create + edit forms and the projects-list filter so they
 * all read from the same source.
 */
export async function GET() {
  const currentUser = await getCurrentUser();
  if (!currentUser) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  const org = await prisma.organization.findUnique({
    where: { id: currentUser.organizationId },
    select: { projectTypes: true },
  });

  return NextResponse.json({
    types: resolveProjectTypes(org?.projectTypes ?? null),
  });
}

/**
 * PUT /api/projects/types
 *
 * Replace the org's project-type list. Owner/Admin only.
 *
 * Body: { types: string[] }
 *
 * An empty array resets to the built-in defaults (since storing [] would
 * leave forms with no options at all, which is a worse UX than the
 * default taxonomy).
 */
export async function PUT(request: Request) {
  const currentUser = await getCurrentUser();
  if (!currentUser) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  if (currentUser.role !== "OWNER" && currentUser.role !== "ADMIN") {
    return NextResponse.json(
      { error: "Only owners and admins can change project types." },
      { status: 403 }
    );
  }

  const body = await request.json().catch(() => ({}));
  const incoming = Array.isArray(body.types) ? body.types : null;
  if (!incoming) {
    return NextResponse.json({ error: "types array is required." }, { status: 400 });
  }

  // Normalize: trim, drop empties, dedupe (case-insensitive).
  const seen = new Set<string>();
  const clean: string[] = [];
  for (const raw of incoming) {
    if (typeof raw !== "string") continue;
    const t = raw.trim();
    if (!t) continue;
    const key = t.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    clean.push(t);
  }

  await prisma.organization.update({
    where: { id: currentUser.organizationId },
    data: {
      // null = fall back to defaults. Empty array would also work but
      // null is more explicit about "no override".
      projectTypes:
        clean.length === 0
          ? Prisma.JsonNull
          : (clean as Prisma.InputJsonValue),
    },
  });

  // Always return the *resolved* list so the client renders defaults
  // when the user cleared everything.
  return NextResponse.json({
    types: clean.length === 0 ? [...resolveProjectTypes(null)] : clean,
  });
}
