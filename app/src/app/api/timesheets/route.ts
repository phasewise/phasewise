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
    if (!approverRoles.includes(currentUser.role)) {
      return NextResponse.json({ error: "Insufficient permissions." }, { status: 403 });
    }

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
    if (!approverRoles.includes(currentUser.role)) {
      return NextResponse.json({ error: "Insufficient permissions." }, { status: 403 });
    }

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

  return NextResponse.json({ error: "Unsupported action." }, { status: 400 });
}
