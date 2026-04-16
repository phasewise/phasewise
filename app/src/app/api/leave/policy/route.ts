import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/supabase/auth";
import {
  DEFAULT_LEAVE_POLICY,
  LEAVE_TYPES,
  LeavePolicy,
  getEffectivePolicy,
} from "@/lib/leave";

export const dynamic = "force-dynamic";

function sanitizePolicy(raw: unknown): LeavePolicy {
  if (!raw || typeof raw !== "object") return {};
  const obj = raw as Record<string, unknown>;
  const out: LeavePolicy = {};
  for (const type of LEAVE_TYPES) {
    const entry = obj[type];
    if (entry && typeof entry === "object") {
      const e = entry as Record<string, unknown>;
      const annualHours = Math.max(0, Number(e.annualHours ?? 0));
      const rolloverCap = Number(e.rolloverCap ?? 0);
      if (!Number.isNaN(annualHours) && !Number.isNaN(rolloverCap)) {
        out[type] = { annualHours, rolloverCap };
      }
    }
  }
  return out;
}

// GET /api/leave/policy — returns org default + per-user overrides.
// Owner/admin only.
export async function GET() {
  const currentUser = await getCurrentUser();
  if (!currentUser) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }
  if (currentUser.role !== "OWNER" && currentUser.role !== "ADMIN") {
    return NextResponse.json({ error: "Insufficient permissions." }, { status: 403 });
  }

  const org = await prisma.organization.findUnique({
    where: { id: currentUser.organizationId },
    select: { leavePolicy: true },
  });

  const users = await prisma.user.findMany({
    where: { organizationId: currentUser.organizationId, isActive: true },
    select: { id: true, fullName: true, role: true, leavePolicyOverride: true },
    orderBy: { fullName: "asc" },
  });

  return NextResponse.json({
    orgPolicy: (org?.leavePolicy as LeavePolicy | null) ?? DEFAULT_LEAVE_POLICY,
    defaultPolicy: DEFAULT_LEAVE_POLICY,
    users,
  });
}

// PATCH /api/leave/policy — update org default, OR user override.
// Body: { orgPolicy?: LeavePolicy; userId?: string; userOverride?: LeavePolicy | null }
export async function PATCH(request: Request) {
  const currentUser = await getCurrentUser();
  if (!currentUser) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }
  if (currentUser.role !== "OWNER" && currentUser.role !== "ADMIN") {
    return NextResponse.json({ error: "Insufficient permissions." }, { status: 403 });
  }

  const body = await request.json();

  if (body.orgPolicy !== undefined) {
    const sanitized = sanitizePolicy(body.orgPolicy);
    await prisma.organization.update({
      where: { id: currentUser.organizationId },
      data: { leavePolicy: sanitized as unknown as Prisma.InputJsonValue },
    });
  }

  if (body.userId) {
    const user = await prisma.user.findUnique({ where: { id: body.userId } });
    if (!user || user.organizationId !== currentUser.organizationId) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    if (body.userOverride === null) {
      await prisma.user.update({
        where: { id: body.userId },
        data: { leavePolicyOverride: Prisma.DbNull as unknown as Prisma.InputJsonValue },
      });
    } else if (body.userOverride !== undefined) {
      const sanitized = sanitizePolicy(body.userOverride);
      await prisma.user.update({
        where: { id: body.userId },
        data: { leavePolicyOverride: sanitized as unknown as Prisma.InputJsonValue },
      });
    }
  }

  return NextResponse.json({ success: true });
}

// GET /api/leave/policy/effective?userId=... — resolved policy for one user.
// Useful for client-side preview.
export async function POST(request: Request) {
  const currentUser = await getCurrentUser();
  if (!currentUser) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  const body = await request.json();
  const userId = body.userId || currentUser.id;

  if (userId !== currentUser.id && currentUser.role !== "OWNER" && currentUser.role !== "ADMIN") {
    return NextResponse.json({ error: "Insufficient permissions." }, { status: 403 });
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { organization: { select: { leavePolicy: true } } },
  });
  if (!user || user.organizationId !== currentUser.organizationId) {
    return NextResponse.json({ error: "User not found." }, { status: 404 });
  }

  const effective = getEffectivePolicy(
    user.organization.leavePolicy,
    user.leavePolicyOverride
  );

  return NextResponse.json({ policy: effective });
}
