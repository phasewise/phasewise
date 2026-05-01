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
        invoiceNumberPrefix: true,
        invoiceNumberNext: true,
        autoNumberInvoices: true,
        invoiceNumberFormat: true,
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
    const {
      projectNumberPrefix,
      projectNumberNext,
      autoNumberProjects,
      invoiceNumberPrefix,
      invoiceNumberNext,
      autoNumberInvoices,
      invoiceNumberFormat,
    } = body as {
      projectNumberPrefix?: string;
      projectNumberNext?: number;
      autoNumberProjects?: boolean;
      invoiceNumberPrefix?: string;
      invoiceNumberNext?: number;
      autoNumberInvoices?: boolean;
      invoiceNumberFormat?: string;
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
    if (invoiceNumberPrefix !== undefined) {
      data.invoiceNumberPrefix = invoiceNumberPrefix.trim().toUpperCase() || "INV";
    }
    if (invoiceNumberNext !== undefined) {
      const num = Math.max(1, Math.floor(Number(invoiceNumberNext)));
      data.invoiceNumberNext = num;
    }
    if (autoNumberInvoices !== undefined) {
      data.autoNumberInvoices = autoNumberInvoices;
    }
    if (invoiceNumberFormat !== undefined) {
      const trimmed = invoiceNumberFormat.trim();
      // Validate at least the {N...} counter token is present so saved
      // formats actually produce unique numbers. Falls back to default
      // if the user clears the field entirely.
      if (!trimmed) {
        data.invoiceNumberFormat = "{prefix}-{N3}";
      } else if (!/\{N\d*\}/i.test(trimmed)) {
        return NextResponse.json(
          { error: "Invoice number format must include a counter token like {N}, {N3}, {N4}, or {N5}." },
          { status: 400 }
        );
      } else {
        data.invoiceNumberFormat = trimmed;
      }
    }

    const updated = await prisma.organization.update({
      where: { id: currentUser.organizationId },
      data,
      select: {
        projectNumberPrefix: true,
        projectNumberNext: true,
        autoNumberProjects: true,
        invoiceNumberPrefix: true,
        invoiceNumberNext: true,
        autoNumberInvoices: true,
        invoiceNumberFormat: true,
      },
    });

    return NextResponse.json({ success: true, org: updated });
  } catch (error) {
    console.error("Update org settings error:", error);
    return NextResponse.json({ error: "Failed to update settings." }, { status: 500 });
  }
}
