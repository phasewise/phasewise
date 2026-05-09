import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/supabase/auth";
import {
  DEFAULT_LEAVE_POLICY,
  LEAVE_TYPES,
  LeavePolicy,
  getEffectivePolicy,
} from "@/lib/leave";

export const dynamic = "force-dynamic";

// Zod schema for a single leave-type policy entry. Mirrors
// LeavePolicyEntry in lib/leave.ts. The previous hand-rolled
// sanitizePolicy only validated 2 of 5 fields (annualHours,
// rolloverCap) — mode, monthlyAccrual, and cap (added 2026-05-04
// for the ACCRUED leave mode work) were silently dropped on every
// save. An OWNER configuring an ACCRUED policy via the admin UI
// would see it persist correctly in local React state, then revert
// to FRONTLOAD defaults on next read. This Zod schema closes that
// drift — every field is validated and persisted, and the type
// system enforces sync with LeavePolicyEntry.
const leavePolicyEntrySchema = z.object({
  annualHours: z.number().nonnegative().max(10000).default(0),
  rolloverCap: z.number().min(-1).max(10000).default(0),
  mode: z.enum(["FRONTLOAD", "ACCRUED"]).optional(),
  monthlyAccrual: z.number().nonnegative().max(1000).default(0),
  cap: z.number().nonnegative().max(10000).default(0),
});

const leavePolicySchema = z.object(
  Object.fromEntries(
    LEAVE_TYPES.map((type) => [type, leavePolicyEntrySchema.optional()])
  )
);

function sanitizePolicy(raw: unknown): LeavePolicy {
  // Zod's safeParse never throws — invalid entries get filtered out
  // via the .partial() shape and out-of-range numbers get clamped at
  // the schema level. Belt-and-suspenders: also gracefully return {}
  // if the top-level isn't an object.
  if (!raw || typeof raw !== "object") return {};
  const result = leavePolicySchema.safeParse(raw);
  if (!result.success) {
    // Log details server-side so we can debug a malformed payload
    // without exposing internals to the client.
    console.warn("Invalid leave policy payload:", result.error.flatten());
    return {};
  }
  return result.data as LeavePolicy;
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
