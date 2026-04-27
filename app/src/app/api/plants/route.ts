import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/supabase/auth";

export const dynamic = "force-dynamic";

/**
 * GET /api/plants?projectId=xxx
 *
 * List all plant entries for the org, optionally filtered by project.
 */
export async function GET(request: Request) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
    }

    const url = new URL(request.url);
    const projectId = url.searchParams.get("projectId");

    const where: Record<string, unknown> = {
      organizationId: currentUser.organizationId,
    };
    if (projectId) where.projectId = projectId;

    const plantEntries = await prisma.plantEntry.findMany({
      where,
      include: {
        project: { select: { id: true, name: true } },
      },
      orderBy: [{ botanicalName: "asc" }],
      take: 500,
    });

    return NextResponse.json({ plantEntries });
  } catch (error) {
    console.error("List plant entries error:", error);
    return NextResponse.json({ error: "Failed to load plant entries." }, { status: 500 });
  }
}

/**
 * POST /api/plants
 *
 * Create a new plant entry.
 */
export async function POST(request: Request) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
    }

    const body = await request.json();
    const {
      projectId,
      botanicalName,
      commonName,
      size,
      quantity,
      spacing,
      waterUse,
      unitCost,
      notes,
      substitution,
    } = body as {
      projectId: string;
      botanicalName: string;
      commonName: string;
      size?: string;
      quantity?: number;
      spacing?: string;
      waterUse?: string;
      unitCost?: number;
      notes?: string;
      substitution?: string;
    };

    if (!projectId || !botanicalName || !commonName) {
      return NextResponse.json(
        { error: "projectId, botanicalName, and commonName are required." },
        { status: 400 }
      );
    }

    // Verify project belongs to org
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      select: { organizationId: true },
    });
    if (!project || project.organizationId !== currentUser.organizationId) {
      return NextResponse.json({ error: "Project not found." }, { status: 404 });
    }

    const plant = await prisma.plantEntry.create({
      data: {
        projectId,
        organizationId: currentUser.organizationId,
        botanicalName,
        commonName,
        size: size || undefined,
        quantity: quantity ?? 1,
        spacing: spacing || undefined,
        waterUse: waterUse || undefined,
        unitCost: unitCost ?? undefined,
        notes: notes || undefined,
        substitution: substitution || undefined,
        approvalStatus: "PENDING",
      },
      include: {
        project: { select: { id: true, name: true } },
      },
    });

    return NextResponse.json({ success: true, plant });
  } catch (error) {
    console.error("Create plant entry error:", error);
    return NextResponse.json({ error: "Failed to create plant entry." }, { status: 500 });
  }
}

/**
 * PATCH /api/plants
 *
 * Update a plant entry by id.
 */
export async function PATCH(request: Request) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
    }

    const body = await request.json();
    const { id, ...fields } = body as {
      id: string;
      botanicalName?: string;
      commonName?: string;
      size?: string;
      quantity?: number;
      spacing?: string;
      waterUse?: string;
      unitCost?: number;
      notes?: string;
      substitution?: string;
      approvalStatus?: string;
    };

    if (!id) {
      return NextResponse.json({ error: "id is required." }, { status: 400 });
    }

    // Verify plant belongs to org
    const existing = await prisma.plantEntry.findUnique({
      where: { id },
      select: { organizationId: true },
    });
    if (!existing || existing.organizationId !== currentUser.organizationId) {
      return NextResponse.json({ error: "Plant entry not found." }, { status: 404 });
    }

    const data: Record<string, unknown> = {};
    if (fields.botanicalName !== undefined) data.botanicalName = fields.botanicalName;
    if (fields.commonName !== undefined) data.commonName = fields.commonName;
    if (fields.size !== undefined) data.size = fields.size || null;
    if (fields.quantity !== undefined) data.quantity = fields.quantity;
    if (fields.spacing !== undefined) data.spacing = fields.spacing || null;
    if (fields.waterUse !== undefined) data.waterUse = fields.waterUse || null;
    if (fields.unitCost !== undefined) data.unitCost = fields.unitCost ?? null;
    if (fields.notes !== undefined) data.notes = fields.notes || null;
    if (fields.substitution !== undefined) data.substitution = fields.substitution || null;
    if (fields.approvalStatus !== undefined) data.approvalStatus = fields.approvalStatus || null;

    const updated = await prisma.plantEntry.update({
      where: { id },
      data,
      include: {
        project: { select: { id: true, name: true } },
      },
    });

    return NextResponse.json({ success: true, plant: updated });
  } catch (error) {
    console.error("Update plant entry error:", error);
    return NextResponse.json({ error: "Failed to update plant entry." }, { status: 500 });
  }
}
