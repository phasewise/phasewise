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
      },
    });

    return NextResponse.json({ success: true, timesheet: approved });
  }

  return NextResponse.json({ error: "Unsupported action." }, { status: 400 });
}
