import type { LeaveType } from "@prisma/client";
import { prisma } from "@/lib/prisma";

// Two ways to grant leave:
// - FRONTLOAD (default, legacy): the full annualHours is available
//   on day one of the year. Simple, common at small firms, but lets
//   a new hire burn 80 hours of vacation in their first month.
// - ACCRUED: monthlyAccrual hours are added to the balance at the
//   start of each completed month. Caps at `cap`. Rollover at year
//   change is still governed by rolloverCap. Matches what most
//   payroll providers (Gusto, ADP, QuickBooks Payroll) use.
export type LeaveMode = "FRONTLOAD" | "ACCRUED";

export type LeavePolicyEntry = {
  annualHours: number; // hours granted per year (FRONTLOAD) or annual target (ACCRUED display)
  rolloverCap: number; // max hours that carry across years; 0 = none, -1 = unlimited
  mode?: LeaveMode; // defaults to FRONTLOAD if missing
  monthlyAccrual?: number; // hours added per completed month when mode=ACCRUED
  cap?: number; // max balance an employee can hold when mode=ACCRUED; 0 = no cap
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
      const modeRaw = typeof e.mode === "string" ? (e.mode as string).toUpperCase() : undefined;
      const mode: LeaveMode | undefined =
        modeRaw === "ACCRUED" || modeRaw === "FRONTLOAD" ? (modeRaw as LeaveMode) : undefined;
      const monthlyAccrual = Number(e.monthlyAccrual ?? 0);
      const cap = Number(e.cap ?? 0);
      if (!Number.isNaN(annualHours) && !Number.isNaN(rolloverCap)) {
        out[type] = {
          annualHours,
          rolloverCap,
          mode,
          monthlyAccrual: Number.isNaN(monthlyAccrual) ? 0 : monthlyAccrual,
          cap: Number.isNaN(cap) ? 0 : cap,
        };
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
  // Resolved mode + the hours actually accrued so far this year (only
  // meaningful when mode=ACCRUED — for FRONTLOAD this equals annualHours).
  mode: LeaveMode;
  accruedHours: number;
};

// Accrued hours so far in the year, as of `date`. Counts COMPLETED
// months only — Jan 15 with monthlyAccrual=10 yields 10 (just January
// counts; Feb hasn't completed yet). Capped at `cap` if set.
export function computeAccruedHours(
  monthlyAccrual: number,
  cap: number,
  date: Date = new Date()
): number {
  const completedMonths = date.getMonth(); // 0..11; Jan=0 means 0 months completed
  const accrued = monthlyAccrual * completedMonths;
  if (cap > 0) return Math.min(accrued, cap);
  return accrued;
}

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
    const entry = policy[type];
    const annualHours = entry?.annualHours ?? 0;
    const usedHours = usedByType.get(type) ?? 0;
    const mode: LeaveMode = entry?.mode === "ACCRUED" ? "ACCRUED" : "FRONTLOAD";
    const accruedHours =
      mode === "ACCRUED"
        ? computeAccruedHours(entry?.monthlyAccrual ?? 0, entry?.cap ?? 0)
        : annualHours;
    return {
      type,
      annualHours,
      usedHours,
      remainingHours: accruedHours - usedHours,
      mode,
      accruedHours,
    };
  });
}
