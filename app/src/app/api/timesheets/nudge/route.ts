import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/supabase/auth";
import { sendTransactional, LOOPS_TEMPLATES } from "@/lib/loops";

export const dynamic = "force-dynamic";

/**
 * POST /api/timesheets/nudge
 *
 * Sends a "please submit your timesheet" email to a team member whose
 * weekly timesheet is still in DRAFT, blocking the firm from invoicing.
 * Triggered from the New Invoice form's "X not yet submitted" warning.
 *
 * Body: { userId: string, weekStart: string }
 *
 * Permissions: OWNER, ADMIN, SUPERVISOR (or PM nudging on their own
 * project? — keeping tight for now: only admin-tier roles can nudge,
 * since this is a real outgoing email and we don't want to surface a
 * spam vector to every staff member).
 *
 * No cooldown / dedup yet — operator can nudge as many times as they
 * want. If that becomes a problem we add a 24-hour throttle on the
 * (recipient, weekStart) pair.
 */
export async function POST(request: Request) {
  const currentUser = await getCurrentUser();
  if (!currentUser) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }
  if (
    currentUser.role !== "OWNER" &&
    currentUser.role !== "ADMIN" &&
    currentUser.role !== "SUPERVISOR"
  ) {
    return NextResponse.json(
      { error: "Only owners, admins, and supervisors can nudge timesheets." },
      { status: 403 }
    );
  }

  if (!LOOPS_TEMPLATES.TIMESHEET_NUDGE) {
    return NextResponse.json(
      {
        error:
          "Nudge email template is not configured. Set LOOPS_TEMPLATE_TIMESHEET_NUDGE in your environment after creating the template in Loops.",
      },
      { status: 500 }
    );
  }

  const body = await request.json().catch(() => ({}));
  const userId = typeof body.userId === "string" ? body.userId : null;
  const weekStartStr = typeof body.weekStart === "string" ? body.weekStart : null;

  if (!userId || !weekStartStr) {
    return NextResponse.json(
      { error: "userId and weekStart are required." },
      { status: 400 }
    );
  }

  // Look up the recipient and verify they're in the same org. Stops a
  // disgruntled admin in one firm from spamming a user in another.
  const recipient = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      fullName: true,
      organizationId: true,
      isActive: true,
    },
  });
  if (!recipient || recipient.organizationId !== currentUser.organizationId) {
    return NextResponse.json({ error: "User not found." }, { status: 404 });
  }
  if (!recipient.isActive) {
    return NextResponse.json(
      { error: "Cannot nudge a deactivated user." },
      { status: 400 }
    );
  }

  // Parse the weekStart cleanly. We accept either "YYYY-MM-DD" or a full
  // ISO string; both are common from JSON payloads.
  const weekDate = new Date(weekStartStr);
  if (Number.isNaN(weekDate.getTime())) {
    return NextResponse.json({ error: "Invalid weekStart." }, { status: 400 });
  }

  // Format week label using UTC so the date matches the display side
  // (the warning panel renders weekStart in UTC).
  const weekEnd = new Date(weekDate);
  weekEnd.setUTCDate(weekEnd.getUTCDate() + 6);
  const fmt = (d: Date) =>
    d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      timeZone: "UTC",
    });
  const weekLabel = `${fmt(weekDate)} – ${fmt(weekEnd)}`;

  const org = await prisma.organization.findUnique({
    where: { id: currentUser.organizationId },
    select: { name: true },
  });

  const senderFirstName = currentUser.fullName.split(/\s+/)[0] || "your manager";
  const recipientFirstName = recipient.fullName.split(/\s+/)[0] || "there";

  const baseUrl = (process.env.NEXT_PUBLIC_APP_URL || "https://phasewise.io").replace(
    /\/$/,
    ""
  );
  // Deep-link to the timesheet for the relevant week. Date param uses
  // the same YYYY-MM-DD format the timesheet page parses.
  const weekDateOnly = weekStartStr.length >= 10 ? weekStartStr.slice(0, 10) : weekStartStr;
  const timesheetUrl = `${baseUrl}/time?week=${weekDateOnly}`;

  const result = await sendTransactional({
    email: recipient.email,
    transactionalId: LOOPS_TEMPLATES.TIMESHEET_NUDGE,
    dataVariables: {
      recipientName: recipientFirstName,
      senderName: senderFirstName,
      firmName: org?.name ?? "your firm",
      weekLabel,
      timesheetUrl,
    },
  });

  if (!result.success) {
    return NextResponse.json(
      { error: `Failed to send nudge: ${result.error || "unknown"}` },
      { status: 502 }
    );
  }

  return NextResponse.json({ success: true, recipient: recipient.email });
}
