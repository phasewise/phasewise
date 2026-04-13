import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/supabase/auth";

export const dynamic = "force-dynamic";

/**
 * GET /api/settings/org
 *
 * Fetch organization settings (auto-numbering config, etc.)
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
        name: true,
        projectNumberPrefix: true,
        projectNumberNext: true,
        autoNumberProjects: true,
      },
    });

    if (!org) {
      return NextResponse.json({ error: "Organization not found." }, { status: 404 });
    }

    return NextResponse.json({ org });
  } catch (error) {
    console.error("Get org settings error:", error);
    return NextResponse.json({ error: "Failed to load settings." }, { status: 500 });
  }
}

/**
 * PATCH /api/settings/org
 *
 * Update organization settings. OWNER/ADMIN only.
 */
export async function PATCH(request: Request) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
    }

    if (currentUser.role !== "OWNER" && currentUser.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Only owners and admins can change organization settings." },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { projectNumberPrefix, projectNumberNext, autoNumberProjects } = body as {
      projectNumberPrefix?: string;
      projectNumberNext?: number;
      autoNumberProjects?: boolean;
    };

    const data: Record<string, unknown> = {};
    if (projectNumberPrefix !== undefined) {
      data.projectNumberPrefix = projectNumberPrefix.trim().toUpperCase() || "PW";
    }
    if (projectNumberNext !== undefined) {
      const num = Math.max(1, Math.floor(Number(projectNumberNext)));
      data.projectNumberNext = num;
    }
    if (autoNumberProjects !== undefined) {
      data.autoNumberProjects = autoNumberProjects;
    }

    const updated = await prisma.organization.update({
      where: { id: currentUser.organizationId },
      data,
      select: {
        projectNumberPrefix: true,
        projectNumberNext: true,
        autoNumberProjects: true,
      },
    });

    return NextResponse.json({ success: true, org: updated });
  } catch (error) {
    console.error("Update org settings error:", error);
    return NextResponse.json({ error: "Failed to update settings." }, { status: 500 });
  }
}
