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

    // Fetch billing rates for staff to calculate estimated fee
    const allUserIds = new Set(
      plan.flatMap((e) => e.staff.map((s) => s.userId).filter(Boolean))
    );
    const users = await prisma.user.findMany({
      where: { id: { in: [...allUserIds] } },
      select: { id: true, billingRate: true },
    });
    const rateMap = new Map(
      users.map((u) => [u.id, Number(u.billingRate ?? 0)])
    );

    await prisma.$transaction(async (tx) => {
      for (const entry of plan) {
        if (!validPhaseIds.has(entry.phaseId)) continue;

        // Delete all existing staff plans for this phase
        await tx.phaseStaffPlan.deleteMany({
          where: { phaseId: entry.phaseId },
        });

        const validStaff = entry.staff.filter(
          (s) => s.userId && s.plannedHours > 0
        );

        // Create new staff plans
        if (validStaff.length > 0) {
          await tx.phaseStaffPlan.createMany({
            data: validStaff.map((s) => ({
              phaseId: entry.phaseId,
              userId: s.userId,
              plannedHours: new Prisma.Decimal(s.plannedHours),
            })),
          });
        }

        // Auto-sync: update phase budgetedHours and budgetedFee
        // from the work plan so they stay consistent
        const totalHours = validStaff.reduce(
          (sum, s) => sum + s.plannedHours,
          0
        );
        const totalFee = validStaff.reduce(
          (sum, s) => sum + s.plannedHours * (rateMap.get(s.userId) ?? 0),
          0
        );

        if (validStaff.length > 0) {
          await tx.projectPhase.update({
            where: { id: entry.phaseId },
            data: {
              budgetedHours: new Prisma.Decimal(totalHours),
              budgetedFee: new Prisma.Decimal(totalFee),
            },
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
