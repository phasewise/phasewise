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
  ADMIN: { salary: 65000, billingRate: 100, label: "Office Admin" },
  SUPERVISOR: { salary: 100000, billingRate: 175, label: "Senior Associate" },
  PM: { salary: 85000, billingRate: 150, label: "Project Manager" },
  STAFF: { salary: 60000, billingRate: 110, label: "Designer / Staff" },
};

/**
 * LA firm title options for the user's display title.
 * These are suggestions — the owner can type any custom title.
 * Grouped by the access-control role they typically map to.
 */
export const LA_TITLE_OPTIONS: Array<{
  value: string;
  label: string;
  role: UserRole;
  salary: number;
  billingRate: number;
}> = [
  { value: "Principal / Owner", label: "Principal / Owner", role: "OWNER", salary: 130000, billingRate: 225 },
  { value: "Associate Principal", label: "Associate Principal", role: "OWNER", salary: 115000, billingRate: 200 },
  { value: "Senior Associate", label: "Senior Associate", role: "SUPERVISOR", salary: 105000, billingRate: 185 },
  { value: "Associate", label: "Associate", role: "SUPERVISOR", salary: 90000, billingRate: 160 },
  { value: "Senior Project Manager", label: "Senior Project Manager", role: "PM", salary: 95000, billingRate: 170 },
  { value: "Project Manager", label: "Project Manager", role: "PM", salary: 85000, billingRate: 150 },
  { value: "Senior Landscape Architect", label: "Senior Landscape Architect", role: "PM", salary: 90000, billingRate: 160 },
  { value: "Landscape Architect", label: "Landscape Architect", role: "STAFF", salary: 78000, billingRate: 140 },
  { value: "Landscape Designer", label: "Landscape Designer", role: "STAFF", salary: 68000, billingRate: 120 },
  { value: "Designer", label: "Designer", role: "STAFF", salary: 62000, billingRate: 110 },
  { value: "Junior Designer", label: "Junior Designer", role: "STAFF", salary: 55000, billingRate: 90 },
  { value: "Design Intern", label: "Design Intern", role: "STAFF", salary: 45000, billingRate: 75 },
  { value: "CAD / BIM Technician", label: "CAD / BIM Technician", role: "STAFF", salary: 58000, billingRate: 100 },
  { value: "Construction Administrator", label: "Construction Administrator", role: "PM", salary: 82000, billingRate: 145 },
  { value: "Specifications Writer", label: "Specifications Writer", role: "STAFF", salary: 72000, billingRate: 130 },
  { value: "Office Manager", label: "Office Manager", role: "ADMIN", salary: 60000, billingRate: 95 },
  { value: "Marketing Coordinator", label: "Marketing Coordinator", role: "ADMIN", salary: 55000, billingRate: 85 },
  { value: "Accounting / Bookkeeper", label: "Accounting / Bookkeeper", role: "ADMIN", salary: 55000, billingRate: 85 },
];

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

/**
 * Look up a title option by value and return the matching defaults.
 * Falls back to the generic role defaults if the title isn't found.
 */
export function getDefaultsForTitle(
  title: string,
  fallbackRole: UserRole = "STAFF"
): { salary: number; billingRate: number; role: UserRole } {
  const match = LA_TITLE_OPTIONS.find((t) => t.value === title);
  if (match) {
    return { salary: match.salary, billingRate: match.billingRate, role: match.role };
  }
  const roleDefaults = DEFAULT_BILLING_RATES[fallbackRole];
  return { salary: roleDefaults.salary, billingRate: roleDefaults.billingRate, role: fallbackRole };
}
