import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/supabase/auth";
import { DEFAULT_BILLING_RATES, getDefaultsForTitle, salaryToHourlyRate } from "@/lib/billing-defaults";
import type { UserRole } from "@prisma/client";

export const dynamic = "force-dynamic";

/**
 * POST /api/team/members
 *
 * Add a new team member to the organization.
 * Only OWNER and ADMIN can add team members.
 *
 * Body: { fullName, email, role, billingRate?, salary? }
 *
 * Creates a User row with a placeholder authId (the person hasn't signed
 * up yet). When they sign up via /signup, we'll need to link their
 * Supabase auth account to this existing User row. For now this creates
 * the staff record so the owner can assign them to projects and set rates.
 */
export async function POST(request: Request) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
    }

    if (currentUser.role !== "OWNER" && currentUser.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Only owners and admins can add team members." },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { fullName, email, role, title, billingRate, salary } = body as {
      fullName?: string;
      email?: string;
      role?: string;
      title?: string;
      billingRate?: string | number;
      salary?: string | number;
    };

    if (!fullName || !email) {
      return NextResponse.json(
        { error: "Name and email are required." },
        { status: 400 }
      );
    }

    // Check if email already exists in this org
    const existing = await prisma.user.findFirst({
      where: {
        email: email.toLowerCase().trim(),
        organizationId: currentUser.organizationId,
      },
    });

    if (existing) {
      return NextResponse.json(
        { error: "A team member with this email already exists." },
        { status: 409 }
      );
    }

    const userRole = (role as UserRole) || "STAFF";

    // Use title-based defaults if a title was provided, otherwise fall back to role defaults
    const titleDefaults = title ? getDefaultsForTitle(title, userRole) : null;
    const defaults = titleDefaults || (DEFAULT_BILLING_RATES[userRole] ?? DEFAULT_BILLING_RATES.STAFF);

    const salaryNum = salary !== undefined && salary !== "" ? Number(salary) : defaults.salary;
    const rateNum = billingRate !== undefined && billingRate !== "" ? Number(billingRate) : defaults.billingRate;

    const user = await prisma.user.create({
      data: {
        authId: `pending_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
        organizationId: currentUser.organizationId,
        fullName: fullName.trim(),
        email: email.toLowerCase().trim(),
        role: userRole,
        title: title?.trim() || null,
        billingRate: new Prisma.Decimal(rateNum),
        salary: new Prisma.Decimal(salaryNum),
        costRate: new Prisma.Decimal(salaryToHourlyRate(salaryNum)),
      },
      select: {
        id: true,
        fullName: true,
        email: true,
        role: true,
        title: true,
        billingRate: true,
        salary: true,
        costRate: true,
        isActive: true,
      },
    });

    return NextResponse.json({ success: true, user });
  } catch (error) {
    console.error("Add team member error:", error);
    return NextResponse.json(
      { error: "Failed to add team member." },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/team/members
 *
 * Update an existing team member's info.
 * Only OWNER and ADMIN can edit team members.
 *
 * Body: { userId, fullName?, email?, isActive? }
 */
export async function PATCH(request: Request) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
    }

    if (currentUser.role !== "OWNER" && currentUser.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Only owners and admins can edit team members." },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { userId, fullName, email, title, isActive } = body as {
      userId?: string;
      fullName?: string;
      email?: string;
      title?: string;
      isActive?: boolean;
    };

    if (!userId) {
      return NextResponse.json({ error: "userId is required." }, { status: 400 });
    }

    // Verify user belongs to same org
    const targetUser = await prisma.user.findUnique({
      where: { id: userId },
      select: { organizationId: true, role: true },
    });

    if (!targetUser || targetUser.organizationId !== currentUser.organizationId) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    // Prevent deactivating the only OWNER
    if (isActive === false && targetUser.role === "OWNER") {
      const ownerCount = await prisma.user.count({
        where: {
          organizationId: currentUser.organizationId,
          role: "OWNER",
          isActive: true,
        },
      });
      if (ownerCount <= 1) {
        return NextResponse.json(
          { error: "Cannot deactivate the only owner." },
          { status: 400 }
        );
      }
    }

    const updateData: Record<string, unknown> = {};
    if (fullName !== undefined) updateData.fullName = fullName.trim();
    if (email !== undefined) updateData.email = email.toLowerCase().trim();
    if (title !== undefined) updateData.title = title.trim() || null;
    if (isActive !== undefined) updateData.isActive = isActive;

    const updated = await prisma.user.update({
      where: { id: userId },
      data: updateData,
      select: {
        id: true,
        fullName: true,
        email: true,
        role: true,
        isActive: true,
      },
    });

    return NextResponse.json({ success: true, user: updated });
  } catch (error) {
    console.error("Update team member error:", error);
    return NextResponse.json(
      { error: "Failed to update team member." },
      { status: 500 }
    );
  }
}
