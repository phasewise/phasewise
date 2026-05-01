import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/supabase/auth";
import { DEFAULT_BILLING_RATES, getDefaultsForTitle, salaryToHourlyRate } from "@/lib/billing-defaults";
import { sendTransactional, LOOPS_TEMPLATES } from "@/lib/loops";
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

    const cleanEmail = email.toLowerCase().trim();

    const result = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          authId: `pending_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
          organizationId: currentUser.organizationId,
          fullName: fullName.trim(),
          email: cleanEmail,
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

      const invitation = await tx.invitation.create({
        data: {
          organizationId: currentUser.organizationId,
          email: cleanEmail,
          role: userRole,
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
        },
      });

      return { user, invitation };
    });

    // Fire-and-forget invite email
    const orgName = currentUser.organization?.name ?? "your firm";
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || new URL(request.url).origin;
    const inviteUrl = `${appUrl}/invite/${result.invitation.token}`;
    const [firstName] = fullName.trim().split(/\s+/);

    void sendTransactional({
      email: cleanEmail,
      transactionalId: LOOPS_TEMPLATES.INVITE,
      dataVariables: {
        recipientName: firstName || "there",
        orgName,
        role: userRole,
        inviteUrl,
      },
    }).catch((err) => {
      console.error("[loops] Invite email failed:", err);
    });

    return NextResponse.json({ success: true, user: result.user, inviteToken: result.invitation.token });
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
 * Body: { userId, fullName?, email?, title?, role?, phone?, billingRate?, salary?, isActive? }
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
    const {
      userId,
      fullName,
      email,
      title,
      role,
      phone,
      billingRate,
      salary,
      isActive,
      supervisorId,
    } = body as {
      userId?: string;
      fullName?: string;
      email?: string;
      title?: string;
      role?: string;
      phone?: string;
      billingRate?: string | number;
      salary?: string | number;
      isActive?: boolean;
      // null = clear; "" treated same as null. Anything else is a UUID
      // we'll verify is a valid user in the same org.
      supervisorId?: string | null;
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

    // Validate role if provided
    const VALID_ROLES = ["OWNER", "ADMIN", "SUPERVISOR", "PM", "STAFF"] as const;
    if (role !== undefined && !VALID_ROLES.includes(role as (typeof VALID_ROLES)[number])) {
      return NextResponse.json(
        { error: `Invalid role. Must be one of: ${VALID_ROLES.join(", ")}.` },
        { status: 400 }
      );
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

    // Prevent demoting the only OWNER away from OWNER
    if (
      role !== undefined &&
      role !== "OWNER" &&
      targetUser.role === "OWNER"
    ) {
      const ownerCount = await prisma.user.count({
        where: {
          organizationId: currentUser.organizationId,
          role: "OWNER",
          isActive: true,
        },
      });
      if (ownerCount <= 1) {
        return NextResponse.json(
          { error: "Cannot demote the only owner. Promote another user to OWNER first." },
          { status: 400 }
        );
      }
    }

    const updateData: Record<string, unknown> = {};
    if (fullName !== undefined) updateData.fullName = fullName.trim();
    if (email !== undefined) updateData.email = email.toLowerCase().trim();
    if (title !== undefined) updateData.title = title.trim() || null;
    if (role !== undefined) updateData.role = role as UserRole;
    if (phone !== undefined) updateData.phone = phone.trim() || null;
    if (isActive !== undefined) updateData.isActive = isActive;

    if (supervisorId !== undefined) {
      if (!supervisorId) {
        updateData.supervisorId = null;
      } else if (supervisorId === userId) {
        return NextResponse.json(
          { error: "A user can't be their own supervisor." },
          { status: 400 }
        );
      } else {
        // Verify the supervisor is in the same org. Doesn't have to be
        // an approver-role user — any active team member can be assigned
        // as a direct supervisor.
        const supervisor = await prisma.user.findUnique({
          where: { id: supervisorId },
          select: { organizationId: true, isActive: true },
        });
        if (
          !supervisor ||
          supervisor.organizationId !== currentUser.organizationId ||
          !supervisor.isActive
        ) {
          return NextResponse.json(
            { error: "Supervisor not found or inactive." },
            { status: 400 }
          );
        }
        updateData.supervisorId = supervisorId;
      }
    }

    if (billingRate !== undefined) {
      const rate = billingRate === "" || billingRate === null ? null : Number(billingRate);
      if (rate !== null && (Number.isNaN(rate) || rate < 0)) {
        return NextResponse.json(
          { error: "Billing rate must be a non-negative number." },
          { status: 400 }
        );
      }
      updateData.billingRate = rate === null ? null : new Prisma.Decimal(rate);
    }

    if (salary !== undefined) {
      const sal = salary === "" || salary === null ? null : Number(salary);
      if (sal !== null && (Number.isNaN(sal) || sal < 0)) {
        return NextResponse.json(
          { error: "Salary must be a non-negative number." },
          { status: 400 }
        );
      }
      updateData.salary = sal === null ? null : new Prisma.Decimal(sal);
      // Recompute hourly cost rate from salary (industry standard 2080 hours/year)
      updateData.costRate = sal === null ? null : new Prisma.Decimal(salaryToHourlyRate(sal));
    }

    const updated = await prisma.user.update({
      where: { id: userId },
      data: updateData,
      select: {
        id: true,
        fullName: true,
        email: true,
        role: true,
        title: true,
        phone: true,
        billingRate: true,
        salary: true,
        costRate: true,
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
