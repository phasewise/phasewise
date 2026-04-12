import type { UserRole } from "@prisma/client";

/**
 * Industry-standard billing rate defaults for landscape architecture firms.
 *
 * Source: ASLA surveys, BLS data, Monograph benchmarks, land8.com industry
 * discussions. Based on a net multiplier of 2.5-3.5x base hourly salary
 * (the "Rule of Thirds" — 1/3 salary, 1/3 overhead, 1/3 profit).
 *
 * Owners can modify these per-staff in the team settings page. These are
 * just the auto-populated defaults when a new team member is added.
 */
export const DEFAULT_BILLING_RATES: Record<
  UserRole,
  { salary: number; billingRate: number; label: string }
> = {
  OWNER: { salary: 120000, billingRate: 200, label: "Principal / Owner" },
  ADMIN: { salary: 100000, billingRate: 175, label: "Senior Associate / Admin" },
  SUPERVISOR: { salary: 100000, billingRate: 175, label: "Senior Associate / Supervisor" },
  PM: { salary: 85000, billingRate: 150, label: "Landscape Architect / PM" },
  STAFF: { salary: 60000, billingRate: 110, label: "Designer / Staff" },
};

/**
 * Convert annual salary to hourly cost rate.
 * Based on standard 2,080 working hours per year (52 weeks × 40 hours).
 */
export function salaryToHourlyRate(annualSalary: number): number {
  return Math.round((annualSalary / 2080) * 100) / 100;
}

/**
 * Calculate a suggested billing rate from a salary using a net multiplier.
 * Default multiplier is 3.0x (middle of the 2.5-3.5x range).
 */
export function suggestBillingRate(
  annualSalary: number,
  multiplier = 3.0
): number {
  const hourlyPay = annualSalary / 2080;
  return Math.round(hourlyPay * multiplier * 100) / 100;
}
