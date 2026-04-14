import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/supabase/auth";
import type { SubmittalType, SubmittalStatus } from "@prisma/client";

export const dynamic = "force-dynamic";

/**
 * GET /api/submittals?projectId=xxx
 *
 * List all submittals/RFIs for a project (or all projects if no projectId).
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

    const submittals = await prisma.submittal.findMany({
      where,
      include: {
        project: { select: { name: true } },
        createdBy: { select: { fullName: true } },
        assignedTo: { select: { fullName: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ submittals });
  } catch (error) {
    console.error("List submittals error:", error);
    return NextResponse.json({ error: "Failed to load submittals." }, { status: 500 });
  }
}

/**
 * POST /api/submittals
 *
 * Create a new submittal or RFI.
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
      type,
      subject,
      description,
      ballInCourt,
      dueDate,
      assignedToId,
    } = body as {
      projectId: string;
      type?: string;
      subject: string;
      description?: string;
      ballInCourt?: string;
      dueDate?: string;
      assignedToId?: string;
    };

    if (!projectId || !subject) {
      return NextResponse.json(
        { error: "projectId and subject are required." },
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

    // Generate sequential number
    const submittalType = (type as SubmittalType) || "SUBMITTAL";
    const prefix = submittalType === "RFI" ? "RFI" : "SUB";
    const existingCount = await prisma.submittal.count({
      where: { projectId, type: submittalType },
    });
    const number = `${prefix}-${String(existingCount + 1).padStart(3, "0")}`;

    const submittal = await prisma.submittal.create({
      data: {
        projectId,
        organizationId: currentUser.organizationId,
        type: submittalType,
        number,
        subject,
        description: description || undefined,
        ballInCourt: ballInCourt || undefined,
        dueDate: dueDate ? new Date(dueDate) : undefined,
        createdById: currentUser.id,
        assignedToId: assignedToId || undefined,
      },
      include: {
        project: { select: { name: true } },
        createdBy: { select: { fullName: true } },
        assignedTo: { select: { fullName: true } },
      },
    });

    return NextResponse.json({ success: true, submittal });
  } catch (error) {
    console.error("Create submittal error:", error);
    return NextResponse.json({ error: "Failed to create submittal." }, { status: 500 });
  }
}

/**
 * PATCH /api/submittals
 *
 * Update a submittal's status, ball-in-court, or response date.
 */
export async function PATCH(request: Request) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
    }

    const body = await request.json();
    const { id, status, subject, description, ballInCourt, dueDate, responseDate, assignedToId } = body as {
      id: string;
      status?: string;
      subject?: string;
      description?: string | null;
      ballInCourt?: string | null;
      dueDate?: string | null;
      responseDate?: string;
      assignedToId?: string | null;
    };

    if (!id) {
      return NextResponse.json({ error: "id is required." }, { status: 400 });
    }

    const existing = await prisma.submittal.findUnique({
      where: { id },
      select: { organizationId: true },
    });
    if (!existing || existing.organizationId !== currentUser.organizationId) {
      return NextResponse.json({ error: "Submittal not found." }, { status: 404 });
    }

    const data: Record<string, unknown> = {};
    if (status !== undefined) data.status = status as SubmittalStatus;
    if (subject !== undefined) data.subject = subject;
    if (description !== undefined) data.description = description;
    if (ballInCourt !== undefined) data.ballInCourt = ballInCourt || null;
    if (dueDate !== undefined) data.dueDate = dueDate ? new Date(dueDate) : null;
    if (responseDate !== undefined) data.responseDate = responseDate ? new Date(responseDate) : null;
    if (assignedToId !== undefined) data.assignedToId = assignedToId || null;

    const updated = await prisma.submittal.update({
      where: { id },
      data,
      include: {
        project: { select: { name: true } },
        createdBy: { select: { fullName: true } },
        assignedTo: { select: { fullName: true } },
      },
    });

    return NextResponse.json({ success: true, submittal: updated });
  } catch (error) {
    console.error("Update submittal error:", error);
    return NextResponse.json({ error: "Failed to update submittal." }, { status: 500 });
  }
}
