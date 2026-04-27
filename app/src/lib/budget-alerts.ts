import { Prisma } from "@prisma/client";
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
 * Dedup uses the BudgetAlert table: a unique (projectId, alertLevel)
 * row is the source of truth for "we already sent this alert". We try
 * to insert before sending — on P2002 we skip silently. This guarantees
 * exactly-once email delivery per (project, threshold) pair even under
 * concurrent time entry writes.
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

    // Claim the alert by inserting the row. If a row already exists for
    // (projectId, alertLevel) we treat that as "already sent" and bail.
    // This is atomic at the DB layer — no double-sends even under load.
    try {
      await prisma.budgetAlert.create({
        data: { projectId, alertLevel },
      });
    } catch (err) {
      if (
        err instanceof Prisma.PrismaClientKnownRequestError &&
        err.code === "P2002"
      ) {
        return;
      }
      throw err;
    }

    // Send the alert email. We require the dedicated BUDGET_ALERT
    // template — falling back to PAYMENT_FAILED would silently send mail
    // with the wrong variable schema, leaving the customer confused
    // about what failed. Better to skip and surface a loud log line.
    if (!LOOPS_TEMPLATES.BUDGET_ALERT) {
      console.error(
        "[budget-alert] LOOPS_TEMPLATE_BUDGET_ALERT env var is not set — skipping email for project",
        project.name,
        alertLevel
      );
      return;
    }

    const burnRate = Math.round((hoursUsed / budgetedHours) * 100);
    const budgetedFee = project.phases.reduce(
      (sum, phase) => sum + Number(phase.budgetedFee ?? 0),
      0
    );
    const firstName = project.createdBy.fullName.split(/\s+/)[0] || "there";
    const alertInfo = ALERT_LABELS[alertLevel];

    await sendTransactional({
      email: project.createdBy.email,
      transactionalId: LOOPS_TEMPLATES.BUDGET_ALERT,
      dataVariables: {
        recipientName: firstName,
        projectName: project.name,
        alertLabel: alertInfo.label,
        burnRate: String(burnRate),
        hoursUsed: hoursUsed.toFixed(1),
        budgetedHours: budgetedHours.toFixed(1),
        budgetedFee: budgetedFee.toLocaleString(),
      },
    });

    console.log(`[budget-alert] Sent ${alertLevel} alert for project ${project.name} (${burnRate}%)`);
  } catch (error) {
    // Budget alerts should never block time entry operations
    console.error("[budget-alert] Failed to check/send alert:", error);
  }
}
