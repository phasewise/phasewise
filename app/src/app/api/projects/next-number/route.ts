import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/supabase/auth";

export const dynamic = "force-dynamic";

/**
 * GET /api/projects/next-number
 *
 * Returns the next sequential project number for the authenticated user's
 * organization. Format: "PW-001", "PW-002", etc. The number is based on the
 * highest existing project number in the org that matches the "PW-NNN" pattern.
 *
 * If the org has no projects yet or none use the PW-NNN format, returns "PW-001".
 * If the org uses custom numbering (e.g., "2024-105"), this still works — it
 * only looks at PW-prefixed numbers to determine the next in sequence.
 */
export async function GET() {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
    }

    // Find all project numbers for this org that match the PW-NNN format
    const projects = await prisma.project.findMany({
      where: { organizationId: currentUser.organizationId },
      select: { projectNumber: true },
      orderBy: { createdAt: "desc" },
    });

    let maxNumber = 0;
    const pwPattern = /^PW-(\d+)$/i;

    for (const project of projects) {
      if (!project.projectNumber) continue;
      const match = project.projectNumber.match(pwPattern);
      if (match) {
        const num = parseInt(match[1], 10);
        if (num > maxNumber) maxNumber = num;
      }
    }

    const nextNumber = `PW-${String(maxNumber + 1).padStart(3, "0")}`;
    return NextResponse.json({ nextNumber, totalProjects: projects.length });
  } catch (error) {
    console.error("Next project number error:", error);
    return NextResponse.json(
      { error: "Failed to generate project number." },
      { status: 500 }
    );
  }
}
