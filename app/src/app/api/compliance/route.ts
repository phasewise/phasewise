import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/supabase/auth";
import { createClient } from "@/lib/supabase/server";

async function deleteStoredDocument(path: string | null | undefined) {
  if (!path) return;
  // Only delete what we know lives in our private bucket. Legacy rows could
  // still hold a public URL string; skip those rather than risk a wrong
  // remove() call.
  if (path.startsWith("http")) return;
  try {
    const supabase = await createClient();
    await supabase.storage.from("compliance-docs").remove([path]);
  } catch (err) {
    console.error("[compliance] Failed to delete stored document:", err);
  }
}

export const dynamic = "force-dynamic";

const VALID_CATEGORIES = ["MWELO", "LEED", "SITES", "ADA", "PERMIT", "OTHER"];
const VALID_STATUSES = ["NOT_STARTED", "IN_PROGRESS", "COMPLETE", "N_A"];

/**
 * GET /api/compliance?projectId=xxx
 *
 * List all compliance items for the org, optionally filtered by project.
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

    const complianceItems = await prisma.complianceItem.findMany({
      where,
      include: {
        project: { select: { id: true, name: true } },
      },
      orderBy: [{ category: "asc" }, { name: "asc" }],
      take: 500,
    });

    return NextResponse.json({ complianceItems });
  } catch (error) {
    console.error("List compliance items error:", error);
    return NextResponse.json({ error: "Failed to load compliance items." }, { status: 500 });
  }
}

/**
 * POST /api/compliance
 *
 * Create a new compliance item.
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
      category,
      name,
      description,
      status,
      dueDate,
      documentUrl,
      notes,
    } = body as {
      projectId: string;
      category: string;
      name: string;
      description?: string;
      status?: string;
      dueDate?: string;
      documentUrl?: string;
      notes?: string;
    };

    if (!projectId || !category || !name) {
      return NextResponse.json(
        { error: "projectId, category, and name are required." },
        { status: 400 }
      );
    }

    if (!VALID_CATEGORIES.includes(category)) {
      return NextResponse.json(
        { error: `Invalid category. Must be one of: ${VALID_CATEGORIES.join(", ")}` },
        { status: 400 }
      );
    }

    if (status && !VALID_STATUSES.includes(status)) {
      return NextResponse.json(
        { error: `Invalid status. Must be one of: ${VALID_STATUSES.join(", ")}` },
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

    const item = await prisma.complianceItem.create({
      data: {
        projectId,
        organizationId: currentUser.organizationId,
        category,
        name,
        description: description || undefined,
        status: status || "NOT_STARTED",
        dueDate: dueDate ? new Date(dueDate) : undefined,
        documentUrl: documentUrl || undefined,
        notes: notes || undefined,
      },
      include: {
        project: { select: { id: true, name: true } },
      },
    });

    return NextResponse.json({ success: true, item });
  } catch (error) {
    console.error("Create compliance item error:", error);
    return NextResponse.json({ error: "Failed to create compliance item." }, { status: 500 });
  }
}

/**
 * PATCH /api/compliance
 *
 * Update a compliance item by id.
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
      category?: string;
      name?: string;
      description?: string;
      status?: string;
      dueDate?: string;
      documentUrl?: string;
      notes?: string;
    };

    if (!id) {
      return NextResponse.json({ error: "id is required." }, { status: 400 });
    }

    if (fields.category && !VALID_CATEGORIES.includes(fields.category)) {
      return NextResponse.json(
        { error: `Invalid category. Must be one of: ${VALID_CATEGORIES.join(", ")}` },
        { status: 400 }
      );
    }

    if (fields.status && !VALID_STATUSES.includes(fields.status)) {
      return NextResponse.json(
        { error: `Invalid status. Must be one of: ${VALID_STATUSES.join(", ")}` },
        { status: 400 }
      );
    }

    // Verify item belongs to org
    const existing = await prisma.complianceItem.findUnique({
      where: { id },
      select: { organizationId: true, documentUrl: true },
    });
    if (!existing || existing.organizationId !== currentUser.organizationId) {
      return NextResponse.json({ error: "Compliance item not found." }, { status: 404 });
    }

    const data: Record<string, unknown> = {};
    if (fields.category !== undefined) data.category = fields.category;
    if (fields.name !== undefined) data.name = fields.name;
    if (fields.description !== undefined) data.description = fields.description || null;
    if (fields.status !== undefined) data.status = fields.status;
    if (fields.dueDate !== undefined) data.dueDate = fields.dueDate ? new Date(fields.dueDate) : null;
    if (fields.documentUrl !== undefined) data.documentUrl = fields.documentUrl || null;
    if (fields.notes !== undefined) data.notes = fields.notes || null;

    const updated = await prisma.complianceItem.update({
      where: { id },
      data,
      include: {
        project: { select: { id: true, name: true } },
      },
    });

    // If the document path changed (replaced or cleared), remove the
    // previously-stored file from the bucket so we don't leak storage.
    if (
      fields.documentUrl !== undefined &&
      existing.documentUrl &&
      existing.documentUrl !== updated.documentUrl
    ) {
      await deleteStoredDocument(existing.documentUrl);
    }

    return NextResponse.json({ success: true, item: updated });
  } catch (error) {
    console.error("Update compliance item error:", error);
    return NextResponse.json({ error: "Failed to update compliance item." }, { status: 500 });
  }
}

/**
 * DELETE /api/compliance?id=xxx
 *
 * Remove a compliance item and any attached document file.
 */
export async function DELETE(request: Request) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
    }

    const url = new URL(request.url);
    const id = url.searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "id is required." }, { status: 400 });
    }

    const existing = await prisma.complianceItem.findUnique({
      where: { id },
      select: { organizationId: true, documentUrl: true },
    });
    if (!existing || existing.organizationId !== currentUser.organizationId) {
      return NextResponse.json({ error: "Compliance item not found." }, { status: 404 });
    }

    await prisma.complianceItem.delete({ where: { id } });
    await deleteStoredDocument(existing.documentUrl);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete compliance item error:", error);
    return NextResponse.json({ error: "Failed to delete compliance item." }, { status: 500 });
  }
}
