import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendTransactional, LOOPS_TEMPLATES } from "@/lib/loops";

export const dynamic = "force-dynamic";

/**
 * GET /api/cron/submittal-reminders
 *
 * Scans for overdue submittals/RFIs and sends reminder emails to the
 * assigned person (or the creator if no one is assigned).
 *
 * This endpoint is designed to be called by a cron job (e.g., Vercel
 * Cron or an external scheduler) once per day.
 *
 * To prevent spamming, we only send reminders for items that became
 * overdue within the last 7 days. Items overdue for more than 7 days
 * are assumed to have already been reminded (or are being ignored).
 *
 * Security: This route uses a simple bearer token check so it can't
 * be triggered by random visitors. Set CRON_SECRET in env vars.
 */
export async function GET(request: Request) {
  // Verify cron secret
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    // Find overdue submittals that haven't been resolved
    const overdueSubmittals = await prisma.submittal.findMany({
      where: {
        dueDate: {
          lt: now,
          gte: sevenDaysAgo,
        },
        status: {
          notIn: ["APPROVED", "CLOSED", "REJECTED"],
        },
      },
      include: {
        project: { select: { name: true } },
        createdBy: { select: { email: true, fullName: true } },
        assignedTo: { select: { email: true, fullName: true } },
      },
    });

    if (overdueSubmittals.length === 0) {
      return NextResponse.json({
        success: true,
        message: "No overdue submittals found.",
        sent: 0,
      });
    }

    let sentCount = 0;

    for (const submittal of overdueSubmittals) {
      // Send to assignee if available, otherwise to creator
      const recipient = submittal.assignedTo ?? submittal.createdBy;
      const firstName = recipient.fullName.split(/\s+/)[0] || "there";

      const daysOverdue = Math.floor(
        (now.getTime() - (submittal.dueDate?.getTime() ?? now.getTime())) / (1000 * 60 * 60 * 24)
      );

      // Skip silently when the dedicated Submittal Reminder template
      // isn't configured. The previous fallback piggy-backed on the
      // PAYMENT_FAILED template and stuffed the entire submittal prose
      // into its `firmName` merge variable — which renders as garbled
      // "Hi <recipient>, <prose>" in the wrong template's body. Better
      // to skip than to send a confusing email; an unset template ID
      // is an admin-config issue, not an end-user-facing one.
      if (!LOOPS_TEMPLATES.SUBMITTAL_REMINDER) {
        console.warn(
          "Submittal reminders cron: LOOPS_TEMPLATE_SUBMITTAL_REMINDER not set — skipping send."
        );
        continue;
      }

      await sendTransactional({
        email: recipient.email,
        transactionalId: LOOPS_TEMPLATES.SUBMITTAL_REMINDER,
        dataVariables: {
          recipientName: firstName,
          submittalNumber: submittal.number,
          subject: submittal.subject,
          projectName: submittal.project.name,
          daysOverdue: String(daysOverdue),
          ballInCourt: submittal.ballInCourt ?? "Unassigned",
        },
      });

      sentCount++;
    }

    return NextResponse.json({
      success: true,
      message: `Sent ${sentCount} reminder${sentCount === 1 ? "" : "s"}.`,
      sent: sentCount,
      overdueCount: overdueSubmittals.length,
    });
  } catch (error) {
    console.error("Submittal reminders cron error:", error);
    return NextResponse.json(
      { error: "Failed to process submittal reminders." },
      { status: 500 }
    );
  }
}
