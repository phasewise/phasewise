import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/supabase/auth";

export const dynamic = "force-dynamic";

/**
 * GET /api/projects/next-number
 *
 * Returns the next sequential project number for the authenticated user's
 * organization, using the org's configured prefix and counter.
 *
 * Response: { nextNumber, prefix, autoEnabled }
 *
 * The counter increments atomically when a project is actually created
 * (handled in the POST /api/projects route), not here. This endpoint
 * only previews what the next number would be.
 */
export async function GET() {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
    }

    const org = await prisma.organization.findUnique({
      where: { id: currentUser.organizationId },
      select: {
        projectNumberPrefix: true,
        projectNumberNext: true,
        autoNumberProjects: true,
      },
    });

    if (!org) {
      return NextResponse.json({ error: "Organization not found." }, { status: 404 });
    }

    if (!org.autoNumberProjects) {
      return NextResponse.json({
        nextNumber: null,
        prefix: org.projectNumberPrefix,
        autoEnabled: false,
      });
    }

    const nextNumber = `${org.projectNumberPrefix}-${String(org.projectNumberNext).padStart(3, "0")}`;

    return NextResponse.json({
      nextNumber,
      prefix: org.projectNumberPrefix,
      autoEnabled: true,
    });
  } catch (error) {
    console.error("Next project number error:", error);
    return NextResponse.json(
      { error: "Failed to generate project number." },
      { status: 500 }
    );
  }
}
