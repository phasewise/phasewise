import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/supabase/auth";

export const dynamic = "force-dynamic";

/**
 * GET /api/projects/[id]
 *
 * Fetch a single project with its phases.
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
    }

    const project = await prisma.project.findUnique({
      where: { id },
      include: { phases: { orderBy: { sortOrder: "asc" } } },
    });

    if (!project || project.organizationId !== currentUser.organizationId) {
      return NextResponse.json({ error: "Project not found." }, { status: 404 });
    }

    return NextResponse.json({ project });
  } catch (error) {
    console.error("Get project error:", error);
    return NextResponse.json(
      { error: "Failed to load project." },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/projects/[id]
 *
 * Update project details (name, number, client info, status, dates).
 * Phase updates are handled separately to keep this endpoint simple.
 */
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
    }

    const project = await prisma.project.findUnique({
      where: { id },
      select: { organizationId: true },
    });

    if (!project || project.organizationId !== currentUser.organizationId) {
      return NextResponse.json({ error: "Project not found." }, { status: 404 });
    }

    const body = await request.json();
    const {
      name,
      projectNumber,
      clientName,
      clientEmail,
      status,
      startDate,
      targetCompletion,
      contractFee,
      description,
    } = body;

    const data: Record<string, unknown> = {};
    if (name !== undefined) data.name = name;
    if (projectNumber !== undefined) data.projectNumber = projectNumber || null;
    if (clientName !== undefined) data.clientName = clientName || null;
    if (clientEmail !== undefined) data.clientEmail = clientEmail || null;
    if (status !== undefined) data.status = status;
    if (description !== undefined) data.description = description || null;
    if (startDate !== undefined) {
      data.startDate = startDate ? new Date(startDate) : null;
    }
    if (targetCompletion !== undefined) {
      data.targetCompletion = targetCompletion ? new Date(targetCompletion) : null;
    }
    if (contractFee !== undefined) {
      data.contractFee =
        contractFee === null || contractFee === "" ? null : new Prisma.Decimal(contractFee);
    }

    // If clientName changed, re-resolve clientId so the project stays
    // linked to a real Client row. Find existing case-insensitively or
    // create a new one. If clientName is being cleared, unlink.
    if (clientName !== undefined) {
      const trimmed = clientName?.trim();
      if (!trimmed) {
        data.clientId = null;
      } else {
        const existing = await prisma.client.findFirst({
          where: {
            organizationId: currentUser.organizationId,
            name: { equals: trimmed, mode: "insensitive" },
          },
          select: { id: true },
        });
        if (existing) {
          data.clientId = existing.id;
        } else {
          const created = await prisma.client.create({
            data: {
              organizationId: currentUser.organizationId,
              name: trimmed,
              email: clientEmail?.trim() || null,
            },
            select: { id: true },
          });
          data.clientId = created.id;
        }
      }
    }

    const updated = await prisma.project.update({
      where: { id },
      data,
    });

    return NextResponse.json({ success: true, project: updated });
  } catch (error) {
    console.error("Update project error:", error);
    return NextResponse.json(
      { error: "Failed to update project." },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/projects/[id]
 *
 * Archive a project (soft delete by setting status to ARCHIVED).
 */
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
    }

    // Only OWNER/ADMIN/PM can archive
    if (!["OWNER", "ADMIN", "PM"].includes(currentUser.role)) {
      return NextResponse.json(
        { error: "Insufficient permissions." },
        { status: 403 }
      );
    }

    const project = await prisma.project.findUnique({
      where: { id },
      select: { organizationId: true },
    });

    if (!project || project.organizationId !== currentUser.organizationId) {
      return NextResponse.json({ error: "Project not found." }, { status: 404 });
    }

    await prisma.project.update({
      where: { id },
      data: { status: "ARCHIVED" },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Archive project error:", error);
    return NextResponse.json(
      { error: "Failed to archive project." },
      { status: 500 }
    );
  }
}
