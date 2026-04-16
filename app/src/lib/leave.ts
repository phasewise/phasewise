import type { LeaveType } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export type LeavePolicyEntry = {
  annualHours: number; // hours granted per year
  rolloverCap: number; // max hours that carry across years; 0 = none, -1 = unlimited
};

export type LeavePolicy = Partial<Record<LeaveType, LeavePolicyEntry>>;

// Defaults chosen from typical small-firm practice (see BUSINESS_PLAN /
// CLAUDE.md notes on leave standards). Owners can override per-org or
// per-user.
export const DEFAULT_LEAVE_POLICY: LeavePolicy = {
  VACATION: { annualHours: 80, rolloverCap: 40 },
  SICK: { annualHours: 40, rolloverCap: 40 },
  HOLIDAY: { annualHours: 64, rolloverCap: 0 }, // ~8 company holidays
  UNPAID: { annualHours: 0, rolloverCap: 0 },
  OTHER: { annualHours: 0, rolloverCap: 0 },
};

export const LEAVE_TYPE_LABELS: Record<LeaveType, string> = {
  VACATION: "Vacation",
  SICK: "Sick",
  HOLIDAY: "Holiday",
  UNPAID: "Unpaid",
  OTHER: "Other",
};

export const LEAVE_TYPES: LeaveType[] = [
  "VACATION",
  "SICK",
  "HOLIDAY",
  "UNPAID",
  "OTHER",
];

export function getEffectivePolicy(
  orgPolicy: unknown,
  userOverride: unknown
): LeavePolicy {
  const base = coercePolicy(orgPolicy) ?? DEFAULT_LEAVE_POLICY;
  const override = coercePolicy(userOverride);
  if (!override) return base;
  const merged: LeavePolicy = { ...base };
  for (const type of LEAVE_TYPES) {
    if (override[type]) merged[type] = override[type];
  }
  return merged;
}

function coercePolicy(raw: unknown): LeavePolicy | null {
  if (!raw || typeof raw !== "object") return null;
  const obj = raw as Record<string, unknown>;
  const out: LeavePolicy = {};
  for (const type of LEAVE_TYPES) {
    const entry = obj[type];
    if (entry && typeof entry === "object") {
      const e = entry as Record<string, unknown>;
      const annualHours = Number(e.annualHours ?? 0);
      const rolloverCap = Number(e.rolloverCap ?? 0);
      if (!Number.isNaN(annualHours) && !Number.isNaN(rolloverCap)) {
        out[type] = { annualHours, rolloverCap };
      }
    }
  }
  return out;
}

export type LeaveBalance = {
  type: LeaveType;
  annualHours: number;
  usedHours: number;
  remainingHours: number;
};

export async function computeUserLeaveBalances(
  userId: string,
  year: number = new Date().getFullYear()
): Promise<LeaveBalance[]> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { organization: { select: { leavePolicy: true } } },
  });
  if (!user) return [];

  const policy = getEffectivePolicy(
    user.organization.leavePolicy,
    user.leavePolicyOverride
  );

  const yearStart = new Date(year, 0, 1);
  const yearEnd = new Date(year + 1, 0, 1);

  const entries = await prisma.timeEntry.findMany({
    where: {
      userId,
      leaveType: { not: null },
      date: { gte: yearStart, lt: yearEnd },
    },
    select: { leaveType: true, hours: true },
  });

  const usedByType = new Map<LeaveType, number>();
  for (const entry of entries) {
    if (!entry.leaveType) continue;
    usedByType.set(
      entry.leaveType,
      (usedByType.get(entry.leaveType) ?? 0) + Number(entry.hours)
    );
  }

  return LEAVE_TYPES.map((type) => {
    const annualHours = policy[type]?.annualHours ?? 0;
    const usedHours = usedByType.get(type) ?? 0;
    return {
      type,
      annualHours,
      usedHours,
      remainingHours: annualHours - usedHours,
    };
  });
}
