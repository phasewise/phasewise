import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

const approverRoles = ["OWNER", "ADMIN", "SUPERVISOR"];

export async function POST(request: Request) {
  const body = await request.json();
  const { action, weekStart, timesheetId } = body;

  if (!action) {
    return NextResponse.json({ error: "Action is required." }, { status: 400 });
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  const currentUser = await prisma.user.findUnique({ where: { authId: user.id } });

  if (!currentUser) {
    return NextResponse.json({ error: "Current user not found." }, { status: 401 });
  }

  if (action === "submit") {
    if (!weekStart) {
      return NextResponse.json({ error: "weekStart is required to submit." }, { status: 400 });
    }

    const parsedWeekStart = new Date(weekStart);
    if (Number.isNaN(parsedWeekStart.getTime())) {
      return NextResponse.json({ error: "Invalid week start date." }, { status: 400 });
    }

    // Sequencing rule: a future week can't be submitted until the
    // current week has been submitted (or already approved). Editing
    // future weeks is fine — only submission is gated. Mirrors the UI
    // banner so server can't be bypassed by a curl post.
    const todayWeekStart = (() => {
      const d = new Date();
      const day = d.getDay(); // 0 = Sunday
      const monday = new Date(d);
      const diff = (day + 6) % 7; // back up to Monday
      monday.setDate(d.getDate() - diff);
      monday.setHours(0, 0, 0, 0);
      return monday;
    })();
    if (parsedWeekStart.getTime() > todayWeekStart.getTime()) {
      const currentWeekSheet = await prisma.weeklyTimesheet.findUnique({
        where: {
          userId_weekStart: {
            userId: currentUser.id,
            weekStart: todayWeekStart,
          },
        },
      });
      if (!currentWeekSheet || currentWeekSheet.status === "DRAFT") {
        return NextResponse.json(
          {
            error:
              "Submit the current week's timesheet first — future weeks can't be submitted ahead of the current one.",
          },
          { status: 403 }
        );
      }
    }

    const existing = await prisma.weeklyTimesheet.findUnique({
      where: {
        userId_weekStart: {
          userId: currentUser.id,
          weekStart: parsedWeekStart,
        },
      },
    });

    const timesheet = existing
      ? await prisma.weeklyTimesheet.update({
          where: { id: existing.id },
          data: {
            status: "SUBMITTED",
            submittedAt: new Date(),
            // Clear any prior reviewer feedback — user just re-submitted,
            // so the old "fix this" note is no longer relevant.
            reviewComment: null,
            reviewedById: null,
            reviewedAt: null,
          },
        })
      : await prisma.weeklyTimesheet.create({
          data: {
            userId: currentUser.id,
            weekStart: parsedWeekStart,
            status: "SUBMITTED",
            submittedAt: new Date(),
          },
        });

    return NextResponse.json({ success: true, timesheet });
  }

  if (action === "approve") {
    if (!timesheetId) {
      return NextResponse.json({ error: "timesheetId is required to approve." }, { status: 400 });
    }

    const timesheet = await prisma.weeklyTimesheet.findUnique({
      where: { id: timesheetId },
      include: { user: true },
    });

    if (!timesheet || timesheet.user.organizationId !== currentUser.organizationId) {
      return NextResponse.json({ error: "Timesheet not found." }, { status: 404 });
    }

    // Approval gate: standard OWNER/ADMIN/SUPERVISOR roles, OR the
    // user's direct supervisor (delegation), OR the alternate
    // supervisor (vacation cover). Means a PM with role=PM can
    // approve their direct reports' timesheets without needing
    // full SUPERVISOR role permissions across the org, AND the firm
    // doesn't lose approval throughput when the primary is on leave.
    const isRoleApprover = approverRoles.includes(currentUser.role);
    const isDirectSupervisor = timesheet.user.supervisorId === currentUser.id;
    const isAlternateSupervisor = timesheet.user.alternateSupervisorId === currentUser.id;
    if (!isRoleApprover && !isDirectSupervisor && !isAlternateSupervisor) {
      return NextResponse.json({ error: "Insufficient permissions." }, { status: 403 });
    }

    if (timesheet.status !== "SUBMITTED") {
      return NextResponse.json({ error: "Only submitted timesheets can be approved." }, { status: 400 });
    }

    const approved = await prisma.weeklyTimesheet.update({
      where: { id: timesheetId },
      data: {
        status: "APPROVED",
        approvedById: currentUser.id,
        approvedAt: new Date(),
        // Approving clears any prior reject comment — fresh slate.
        reviewComment: null,
        reviewedById: null,
        reviewedAt: null,
      },
    });

    return NextResponse.json({ success: true, timesheet: approved });
  }

  // "Reject" / "Request changes" — approver sends a SUBMITTED timesheet
  // back to DRAFT with a comment. The staff member sees the comment on
  // their timesheet page and re-submits after fixing. Same flow as
  // reopen, but it explicitly captures WHY the reviewer sent it back so
  // it's a teachable moment, not a silent reset.
  if (action === "reject") {
    if (!timesheetId) {
      return NextResponse.json({ error: "timesheetId is required to reject." }, { status: 400 });
    }

    const reviewComment = (body.reviewComment as string | undefined)?.trim();
    if (!reviewComment) {
      return NextResponse.json(
        { error: "A comment is required when sending a timesheet back." },
        { status: 400 }
      );
    }

    const timesheet = await prisma.weeklyTimesheet.findUnique({
      where: { id: timesheetId },
      include: { user: true },
    });

    if (!timesheet || timesheet.user.organizationId !== currentUser.organizationId) {
      return NextResponse.json({ error: "Timesheet not found." }, { status: 404 });
    }

    // Same delegation rule as approve — direct + alternate supervisors
    // can also send a timesheet back for changes.
    const isRoleApprover = approverRoles.includes(currentUser.role);
    const isDirectSupervisor = timesheet.user.supervisorId === currentUser.id;
    const isAlternateSupervisor = timesheet.user.alternateSupervisorId === currentUser.id;
    if (!isRoleApprover && !isDirectSupervisor && !isAlternateSupervisor) {
      return NextResponse.json({ error: "Insufficient permissions." }, { status: 403 });
    }

    if (timesheet.status !== "SUBMITTED") {
      return NextResponse.json(
        { error: "Only submitted timesheets can be sent back for changes." },
        { status: 400 }
      );
    }

    const rejected = await prisma.weeklyTimesheet.update({
      where: { id: timesheetId },
      data: {
        status: "DRAFT",
        submittedAt: null,
        reviewComment,
        reviewedById: currentUser.id,
        reviewedAt: new Date(),
      },
    });

    return NextResponse.json({ success: true, timesheet: rejected });
  }

  // Reopen a submitted or approved timesheet so the user can edit again.
  // - Owners of the timesheet can recall their own SUBMITTED back to DRAFT.
  // - Owners of the timesheet who also have approver role can reopen their
  //   own APPROVED back to DRAFT (single-person firms hit this case).
  // - Approvers (OWNER/ADMIN/SUPERVISOR) can reopen anyone's timesheet in
  //   their org, regardless of status.
  if (action === "reopen") {
    if (!weekStart) {
      return NextResponse.json({ error: "weekStart is required to reopen." }, { status: 400 });
    }

    const parsedWeekStart = new Date(weekStart);
    if (Number.isNaN(parsedWeekStart.getTime())) {
      return NextResponse.json({ error: "Invalid week start date." }, { status: 400 });
    }

    // Optional `userId` lets approvers reopen someone else's timesheet.
    // Defaults to the requester's own.
    const targetUserId = (body.userId as string | undefined) ?? currentUser.id;

    if (targetUserId !== currentUser.id) {
      // Approver acting on someone else's timesheet — verify role + same org.
      if (!approverRoles.includes(currentUser.role)) {
        return NextResponse.json({ error: "Insufficient permissions." }, { status: 403 });
      }
      const target = await prisma.user.findUnique({
        where: { id: targetUserId },
        select: { organizationId: true },
      });
      if (!target || target.organizationId !== currentUser.organizationId) {
        return NextResponse.json({ error: "User not found." }, { status: 404 });
      }
    }

    const timesheet = await prisma.weeklyTimesheet.findUnique({
      where: {
        userId_weekStart: {
          userId: targetUserId,
          weekStart: parsedWeekStart,
        },
      },
    });

    if (!timesheet) {
      return NextResponse.json({ error: "Timesheet not found." }, { status: 404 });
    }

    // Reopening an APPROVED timesheet requires approver privilege even
    // when acting on your own — it's an audit-trail concern. Single-person
    // firms hit this branch but the user IS an approver, so they pass.
    if (timesheet.status === "APPROVED" && !approverRoles.includes(currentUser.role)) {
      return NextResponse.json(
        { error: "Only approvers can reopen an approved timesheet. Ask your manager." },
        { status: 403 }
      );
    }

    if (timesheet.status === "DRAFT") {
      return NextResponse.json({ error: "Timesheet is already a draft." }, { status: 400 });
    }

    const reopened = await prisma.weeklyTimesheet.update({
      where: { id: timesheet.id },
      data: {
        status: "DRAFT",
        submittedAt: null,
        approvedById: null,
        approvedAt: null,
      },
    });

    return NextResponse.json({ success: true, timesheet: reopened });
  }

  // ── Schedule template (Apply Schedule) ──────────────────────────────
  // Phase 1 of the Apply-Schedule feature: capture this week's entries
  // as a reusable weekly pattern, then fill any other DRAFT week from
  // it. Removes the friction of typing the same Mon-Fri grid every
  // week for staff with stable assignments.

  if (action === "save-template") {
    if (!weekStart) {
      return NextResponse.json({ error: "weekStart is required to save template." }, { status: 400 });
    }
    const parsedWeekStart = new Date(weekStart);
    if (Number.isNaN(parsedWeekStart.getTime())) {
      return NextResponse.json({ error: "Invalid week start date." }, { status: 400 });
    }
    const weekEndDate = new Date(parsedWeekStart);
    weekEndDate.setDate(weekEndDate.getDate() + 6);

    // Pull this user's billable / project-linked entries for the week.
    // Skip leave + overhead entries — those don't belong in a recurring
    // template (you don't take vacation every week).
    const entries = await prisma.timeEntry.findMany({
      where: {
        userId: currentUser.id,
        date: { gte: parsedWeekStart, lte: weekEndDate },
        leaveType: null,
        overheadCategory: null,
        projectId: { not: null },
        phaseId: { not: null },
      },
      select: { projectId: true, phaseId: true, date: true, hours: true },
    });

    // Build the template: group by (projectId, phaseId), stamp hours
    // per day-of-week.
    const dayKeys: Array<keyof typeof byDow> = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];
    const byDow = { mon: 0, tue: 0, wed: 0, thu: 0, fri: 0, sat: 0, sun: 0 } as const;
    type Row = { projectId: string; phaseId: string; hoursPerDay: typeof byDow };
    const rowsByKey = new Map<string, Row>();

    for (const e of entries) {
      if (!e.projectId || !e.phaseId) continue;
      const key = `${e.projectId}|${e.phaseId}`;
      // JS getDay(): 0=Sun .. 6=Sat. Map to Mon-first 0..6.
      const dow = e.date.getDay();
      const dayIdx = (dow + 6) % 7;
      const dayKey = dayKeys[dayIdx];
      const existing = rowsByKey.get(key);
      if (existing) {
        existing.hoursPerDay = {
          ...existing.hoursPerDay,
          [dayKey]: existing.hoursPerDay[dayKey] + Number(e.hours),
        };
      } else {
        rowsByKey.set(key, {
          projectId: e.projectId,
          phaseId: e.phaseId,
          hoursPerDay: { ...byDow, [dayKey]: Number(e.hours) },
        });
      }
    }

    const template = Array.from(rowsByKey.values());
    if (template.length === 0) {
      return NextResponse.json(
        { error: "Nothing to save — log at least one project hour this week first." },
        { status: 400 }
      );
    }

    await prisma.user.update({
      where: { id: currentUser.id },
      data: { weeklyScheduleTemplate: template },
    });

    return NextResponse.json({ success: true, rowCount: template.length });
  }

  if (action === "apply-template") {
    if (!weekStart) {
      return NextResponse.json({ error: "weekStart is required to apply template." }, { status: 400 });
    }
    const parsedWeekStart = new Date(weekStart);
    if (Number.isNaN(parsedWeekStart.getTime())) {
      return NextResponse.json({ error: "Invalid week start date." }, { status: 400 });
    }

    // Only DRAFT weeks accept a template apply — overwriting submitted
    // or approved data via a one-click action would be too dangerous.
    const sheet = await prisma.weeklyTimesheet.findUnique({
      where: { userId_weekStart: { userId: currentUser.id, weekStart: parsedWeekStart } },
    });
    if (sheet && sheet.status !== "DRAFT") {
      return NextResponse.json(
        { error: "Apply schedule only works on draft weeks. Recall this submission first." },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: currentUser.id },
      select: { weeklyScheduleTemplate: true, organizationId: true },
    });
    const template = user?.weeklyScheduleTemplate;
    if (!Array.isArray(template) || template.length === 0) {
      return NextResponse.json(
        { error: "No saved schedule template. Click 'Save week as template' on a typical week first." },
        { status: 400 }
      );
    }

    // Build the new TimeEntry rows. Skip cells where hours = 0 so the
    // grid doesn't get a wall of zeros.
    const dayKeys = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"] as const;
    type TemplateRow = {
      projectId: string;
      phaseId: string;
      hoursPerDay: Record<(typeof dayKeys)[number], number>;
    };
    const rows = template as TemplateRow[];

    const created: Array<{ date: Date; projectId: string; phaseId: string; hours: number }> = [];
    for (const r of rows) {
      for (let i = 0; i < 7; i++) {
        const hrs = Number(r.hoursPerDay?.[dayKeys[i]] ?? 0);
        if (hrs <= 0) continue;
        const date = new Date(parsedWeekStart);
        date.setDate(date.getDate() + i);
        created.push({ date, projectId: r.projectId, phaseId: r.phaseId, hours: hrs });
      }
    }
    if (created.length === 0) {
      return NextResponse.json({ error: "Template has no hours to apply." }, { status: 400 });
    }

    // Delete any existing draft entries for this week first so the
    // apply is a clean replacement, not an additive duplicate.
    const weekEndDate = new Date(parsedWeekStart);
    weekEndDate.setDate(weekEndDate.getDate() + 6);
    await prisma.timeEntry.deleteMany({
      where: {
        userId: currentUser.id,
        date: { gte: parsedWeekStart, lte: weekEndDate },
        invoiceId: null,
        leaveType: null,
        overheadCategory: null,
      },
    });
    await prisma.timeEntry.createMany({
      data: created.map((c) => ({
        organizationId: user!.organizationId,
        userId: currentUser.id,
        projectId: c.projectId,
        phaseId: c.phaseId,
        date: c.date,
        hours: c.hours,
        isBillable: true,
      })),
    });

    return NextResponse.json({ success: true, entryCount: created.length });
  }

  return NextResponse.json({ error: "Unsupported action." }, { status: 400 });
}
