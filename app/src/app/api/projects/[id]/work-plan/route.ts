import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/supabase/auth";

export const dynamic = "force-dynamic";

/**
 * GET /api/projects/[id]/work-plan
 *
 * Fetch the work plan (phase staff assignments) for a project.
 * Returns all phases with their assigned staff and planned hours.
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: projectId } = await params;

  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
    }

    const project = await prisma.project.findUnique({
      where: { id: projectId },
      select: { organizationId: true },
    });

    if (!project || project.organizationId !== currentUser.organizationId) {
      return NextResponse.json({ error: "Project not found." }, { status: 404 });
    }

    const phases = await prisma.projectPhase.findMany({
      where: { projectId },
      orderBy: { sortOrder: "asc" },
      include: {
        workPlan: {
          include: {
            user: {
              select: { id: true, fullName: true, billingRate: true },
            },
          },
        },
      },
    });

    return NextResponse.json({ phases });
  } catch (error) {
    console.error("Get work plan error:", error);
    return NextResponse.json(
      { error: "Failed to load work plan." },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/projects/[id]/work-plan
 *
 * Replace the entire work plan for a project. Accepts an array of
 * phase entries, each containing the phase ID and an array of staff
 * assignments with planned hours.
 *
 * Body: {
 *   plan: Array<{
 *     phaseId: string;
 *     staff: Array<{ userId: string; plannedHours: number }>
 *   }>
 * }
 */
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: projectId } = await params;

  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
    }

    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: { phases: { select: { id: true } } },
    });

    if (!project || project.organizationId !== currentUser.organizationId) {
      return NextResponse.json({ error: "Project not found." }, { status: 404 });
    }

    const body = await request.json();
    const { plan } = body as {
      plan: Array<{
        phaseId: string;
        staff: Array<{ userId: string; plannedHours: number }>;
      }>;
    };

    if (!Array.isArray(plan)) {
      return NextResponse.json({ error: "plan must be an array." }, { status: 400 });
    }

    const validPhaseIds = new Set(project.phases.map((p) => p.id));

    await prisma.$transaction(async (tx) => {
      for (const entry of plan) {
        if (!validPhaseIds.has(entry.phaseId)) continue;

        // Delete all existing staff plans for this phase
        await tx.phaseStaffPlan.deleteMany({
          where: { phaseId: entry.phaseId },
        });

        // Create new staff plans
        if (entry.staff && entry.staff.length > 0) {
          await tx.phaseStaffPlan.createMany({
            data: entry.staff
              .filter((s) => s.userId && s.plannedHours > 0)
              .map((s) => ({
                phaseId: entry.phaseId,
                userId: s.userId,
                plannedHours: new Prisma.Decimal(s.plannedHours),
              })),
          });
        }
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Update work plan error:", error);
    return NextResponse.json(
      { error: "Failed to update work plan." },
      { status: 500 }
    );
  }
}
