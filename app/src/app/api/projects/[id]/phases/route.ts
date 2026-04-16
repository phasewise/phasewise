import { NextResponse } from "next/server";
import { PhaseType, PhaseStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/supabase/auth";

export const dynamic = "force-dynamic";

type PhaseInput = {
  id?: string;
  phaseType: string;
  customName?: string;
  status: string;
  sortOrder: number;
};

/**
 * PUT /api/projects/[id]/phases
 *
 * Replace all phases for a project. Deletes phases not in the input,
 * updates existing ones, and creates new ones.
 *
 * Body: { phases: PhaseInput[] }
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
      select: { organizationId: true },
    });

    if (!project || project.organizationId !== currentUser.organizationId) {
      return NextResponse.json({ error: "Project not found." }, { status: 404 });
    }

    const body = await request.json();
    const { phases } = body as { phases: PhaseInput[] };

    if (!Array.isArray(phases)) {
      return NextResponse.json({ error: "phases must be an array." }, { status: 400 });
    }

    // Get existing phase IDs for this project
    const existingPhases = await prisma.projectPhase.findMany({
      where: { projectId },
      select: { id: true },
    });
    const existingIds = new Set(existingPhases.map((p) => p.id));

    // Determine which phases to create, update, or delete
    const incomingIds = new Set(phases.filter((p) => p.id).map((p) => p.id!));
    const toDelete = [...existingIds].filter((id) => !incomingIds.has(id));

    await prisma.$transaction(async (tx) => {
      // Delete removed phases
      if (toDelete.length > 0) {
        await tx.projectPhase.deleteMany({
          where: { id: { in: toDelete }, projectId },
        });
      }

      // Update existing + create new. NOTE: budgetedFee / budgetedHours
      // are intentionally NOT written here — the Work Plan endpoint is
      // the single source of truth for those. Writing stale form state
      // here would clobber the Work Plan's synced values.
      for (let i = 0; i < phases.length; i++) {
        const phase = phases[i];
        const data = {
          phaseType: phase.phaseType as PhaseType,
          customName: phase.customName || null,
          status: (phase.status || "NOT_STARTED") as PhaseStatus,
          sortOrder: phase.sortOrder ?? i,
        };

        if (phase.id && existingIds.has(phase.id)) {
          await tx.projectPhase.update({
            where: { id: phase.id },
            data,
          });
        } else {
          await tx.projectPhase.create({
            data: { ...data, projectId },
          });
        }
      }
    });

    // Fetch updated phases to return
    const updatedPhases = await prisma.projectPhase.findMany({
      where: { projectId },
      orderBy: { sortOrder: "asc" },
    });

    return NextResponse.json({ success: true, phases: updatedPhases });
  } catch (error) {
    console.error("Update phases error:", error);
    return NextResponse.json(
      { error: "Failed to update phases." },
      { status: 500 }
    );
  }
}
