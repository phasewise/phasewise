export const PHASE_LABELS: Record<string, string> = {
  PRE_DESIGN: "Pre-Design",
  SCHEMATIC_DESIGN: "Schematic Design",
  DESIGN_DEVELOPMENT: "Design Development",
  CONSTRUCTION_DOCUMENTS: "Construction Documents",
  BIDDING: "Bidding & Negotiation",
  CONSTRUCTION_ADMIN: "Construction Administration",
  CLOSEOUT: "Closeout",
  OTHER: "Custom Phase",
};

export const PHASE_SHORT_LABELS: Record<string, string> = {
  PRE_DESIGN: "PD",
  SCHEMATIC_DESIGN: "SD",
  DESIGN_DEVELOPMENT: "DD",
  CONSTRUCTION_DOCUMENTS: "CD",
  BIDDING: "Bid",
  CONSTRUCTION_ADMIN: "CA",
  CLOSEOUT: "CL",
  OTHER: "OTH",
};

export const PHASE_ORDER = [
  "PRE_DESIGN",
  "SCHEMATIC_DESIGN",
  "DESIGN_DEVELOPMENT",
  "CONSTRUCTION_DOCUMENTS",
  "BIDDING",
  "CONSTRUCTION_ADMIN",
  "CLOSEOUT",
  "OTHER",
] as const;

/**
 * Get the display name for a phase, preferring customName if set.
 */
export function getPhaseDisplayName(
  phaseType: string,
  customName?: string | null
): string {
  if (customName) return customName;
  return PHASE_LABELS[phaseType] ?? phaseType;
}

export const STATUS_COLORS: Record<string, string> = {
  ACTIVE: "bg-green-100 text-green-800",
  ON_HOLD: "bg-yellow-100 text-yellow-800",
  COMPLETED: "bg-blue-100 text-blue-800",
  ARCHIVED: "bg-gray-100 text-gray-600",
  NOT_STARTED: "bg-gray-100 text-gray-600",
  IN_PROGRESS: "bg-blue-100 text-blue-800",
  COMPLETE: "bg-green-100 text-green-800",
};

export const PLAN_LIMITS = {
  TRIAL: { users: 3, projects: 5 },
  STARTER: { users: 3, projects: 10 },
  PROFESSIONAL: { users: 15, projects: -1 }, // -1 = unlimited
  STUDIO: { users: 50, projects: -1 },
  ENTERPRISE: { users: -1, projects: -1 },
};
