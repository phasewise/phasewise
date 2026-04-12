import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/supabase/auth";
import { salaryToHourlyRate } from "@/lib/billing-defaults";

export const dynamic = "force-dynamic";

/**
 * POST /api/team/billing
 *
 * Update billing rate and/or salary for a team member.
 * Only OWNER and ADMIN can access this endpoint.
 *
 * Body: { userId, billingRate?, salary? }
 */
export async function POST(request: Request) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
    }

    // Only OWNER and ADMIN can modify billing rates and salary
    if (currentUser.role !== "OWNER" && currentUser.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Only owners and admins can manage billing rates." },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { userId, billingRate, salary } = body as {
      userId?: string;
      billingRate?: string | number;
      salary?: string | number;
    };

    if (!userId) {
      return NextResponse.json({ error: "userId is required." }, { status: 400 });
    }

    // Verify the target user belongs to the same organization
    const targetUser = await prisma.user.findUnique({
      where: { id: userId },
      select: { organizationId: true },
    });

    if (!targetUser || targetUser.organizationId !== currentUser.organizationId) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    // Build the update data
    const updateData: {
      billingRate?: Prisma.Decimal | null;
      salary?: Prisma.Decimal | null;
      costRate?: Prisma.Decimal | null;
    } = {};

    if (billingRate !== undefined) {
      updateData.billingRate =
        billingRate !== null && billingRate !== ""
          ? new Prisma.Decimal(billingRate)
          : null;
    }

    if (salary !== undefined) {
      const salaryNum = salary !== null && salary !== "" ? Number(salary) : null;
      updateData.salary = salaryNum !== null ? new Prisma.Decimal(salaryNum) : null;
      // Auto-calculate cost rate from salary
      updateData.costRate =
        salaryNum !== null
          ? new Prisma.Decimal(salaryToHourlyRate(salaryNum))
          : null;
    }

    const updated = await prisma.user.update({
      where: { id: userId },
      data: updateData,
      select: {
        id: true,
        fullName: true,
        email: true,
        role: true,
        billingRate: true,
        salary: true,
        costRate: true,
      },
    });

    return NextResponse.json({ success: true, user: updated });
  } catch (error) {
    console.error("Update billing error:", error);
    return NextResponse.json(
      { error: "Failed to update billing information." },
      { status: 500 }
    );
  }
}
