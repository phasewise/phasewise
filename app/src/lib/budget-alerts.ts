import { prisma } from "@/lib/prisma";
import { sendTransactional, LOOPS_TEMPLATES } from "@/lib/loops";

export type BudgetAlertLevel = "WARNING_75" | "CRITICAL_90" | "OVER_100" | null;

/**
 * Check a project's budget burn rate and return the alert level.
 * Returns null if the project is healthy (under 75% burn).
 */
export function getBudgetAlertLevel(
  hoursUsed: number,
  budgetedHours: number
): BudgetAlertLevel {
  if (budgetedHours <= 0) return null;
  const burnRate = (hoursUsed / budgetedHours) * 100;
  if (burnRate >= 100) return "OVER_100";
  if (burnRate >= 90) return "CRITICAL_90";
  if (burnRate >= 75) return "WARNING_75";
  return null;
}

export const ALERT_LABELS: Record<string, { label: string; color: string; bgColor: string }> = {
  WARNING_75: { label: "75% budget used", color: "text-amber-700", bgColor: "bg-amber-50 border-amber-200" },
  CRITICAL_90: { label: "90% budget used", color: "text-rose-600", bgColor: "bg-rose-50 border-rose-200" },
  OVER_100: { label: "Over budget", color: "text-rose-700", bgColor: "bg-rose-100 border-rose-300" },
};

/**
 * After a time entry is saved, check if the project has crossed a
 * budget alert threshold. If so, send an email to the project creator
 * (usually the PM or owner).
 *
 * We track the "last alert level sent" to avoid spamming — if we already
 * sent a 75% alert, we won't send it again until the project crosses
 * the 90% threshold.
 *
 * For MVP, we store the last alert level in project description metadata
 * (a simple approach that avoids schema changes). In the future, this
 * should be a proper AlertHistory table.
 */
export async function checkAndSendBudgetAlert(projectId: string): Promise<void> {
  try {
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: {
        phases: true,
        createdBy: { select: { email: true, fullName: true } },
      },
    });

    if (!project) return;

    const budgetedHours = project.phases.reduce(
      (sum, phase) => sum + Number(phase.budgetedHours ?? 0),
      0
    );

    if (budgetedHours <= 0) return;

    // Get total hours used on this project
    const result = await prisma.timeEntry.aggregate({
      where: { projectId },
      _sum: { hours: true },
    });
    const hoursUsed = Number(result._sum.hours ?? 0);

    const alertLevel = getBudgetAlertLevel(hoursUsed, budgetedHours);
    if (!alertLevel) return;

    // Check if we already sent this alert level (stored as a simple
    // marker in the project's description field as [ALERT:LEVEL]).
    // This is a temporary MVP approach — proper solution would use a
    // dedicated alerts table.
    const lastAlertMarker = project.description?.match(/\[ALERT:(\w+)\]/)?.[1];
    const alertOrder = ["WARNING_75", "CRITICAL_90", "OVER_100"];
    const lastAlertIndex = lastAlertMarker ? alertOrder.indexOf(lastAlertMarker) : -1;
    const currentAlertIndex = alertOrder.indexOf(alertLevel);

    if (currentAlertIndex <= lastAlertIndex) {
      // Already sent this level or a higher one
      return;
    }

    // Update the marker
    const cleanDescription = (project.description ?? "").replace(/\[ALERT:\w+\]/g, "").trim();
    const newDescription = `${cleanDescription} [ALERT:${alertLevel}]`.trim();
    await prisma.project.update({
      where: { id: projectId },
      data: { description: newDescription },
    });

    // Send the alert email
    const burnRate = Math.round((hoursUsed / budgetedHours) * 100);
    const budgetedFee = project.phases.reduce(
      (sum, phase) => sum + Number(phase.budgetedFee ?? 0),
      0
    );
    const firstName = project.createdBy.fullName.split(/\s+/)[0] || "there";

    const alertInfo = ALERT_LABELS[alertLevel];

    // We'll use the welcome template as a generic email for now since we
    // don't have a dedicated budget alert template in Loops. The template
    // system handles missing templates gracefully (logs and continues).
    // TODO: Create a dedicated "Budget Alert" transactional template in Loops
    await sendTransactional({
      email: project.createdBy.email,
      transactionalId: LOOPS_TEMPLATES.PAYMENT_FAILED, // Reusing as a generic alert for now
      dataVariables: {
        firstName,
        firmName: `${project.name} — ${alertInfo.label}. ${burnRate}% of budgeted hours used (${hoursUsed.toFixed(1)}h of ${budgetedHours.toFixed(1)}h). Budget: $${budgetedFee.toLocaleString()}.`,
      },
    });

    console.log(`[budget-alert] Sent ${alertLevel} alert for project ${project.name} (${burnRate}%)`);
  } catch (error) {
    // Budget alerts should never block time entry operations
    console.error("[budget-alert] Failed to check/send alert:", error);
  }
}
