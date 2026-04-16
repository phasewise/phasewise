import { NextResponse } from "next/server";
import { Prisma, LeaveType } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import { checkAndSendBudgetAlert } from "@/lib/budget-alerts";
import { LEAVE_TYPES } from "@/lib/leave";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const body = await request.json();
  const { projectId, phaseId, leaveType, date, hours, description } = body;

  const isLeave = !!leaveType;

  if (!date || hours === undefined) {
    return NextResponse.json(
      { error: "date and hours are required." },
      { status: 400 }
    );
  }

  if (isLeave) {
    if (!LEAVE_TYPES.includes(leaveType as LeaveType)) {
      return NextResponse.json({ error: "Invalid leaveType." }, { status: 400 });
    }
  } else if (!projectId || !phaseId) {
    return NextResponse.json(
      { error: "projectId and phaseId are required (or leaveType for leave entries)." },
      { status: 400 }
    );
  }

  const parsedDate = new Date(date);
  if (Number.isNaN(parsedDate.getTime())) {
    return NextResponse.json({ error: "Invalid date." }, { status: 400 });
  }

  const parsedHours = Number(hours);
  if (Number.isNaN(parsedHours) || parsedHours < 0) {
    return NextResponse.json({ error: "Hours must be a non-negative number." }, { status: 400 });
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  const currentUser = await prisma.user.findUnique({
    where: { authId: user.id },
  });

  if (!currentUser) {
    return NextResponse.json({ error: "Unable to resolve current user." }, { status: 401 });
  }

  if (!isLeave) {
    const phase = await prisma.projectPhase.findUnique({
      where: { id: phaseId },
      include: { project: true },
    });

    if (!phase || phase.project.organizationId !== currentUser.organizationId) {
      return NextResponse.json({ error: "Project phase not found." }, { status: 404 });
    }

    if (phase.project.id !== projectId) {
      return NextResponse.json({ error: "Phase does not belong to selected project." }, { status: 400 });
    }
  }

  const existingEntry = await prisma.timeEntry.findFirst({
    where: isLeave
      ? {
          userId: currentUser.id,
          leaveType: leaveType as LeaveType,
          date: parsedDate,
          projectId: null,
        }
      : {
          userId: currentUser.id,
          projectId,
          phaseId,
          leaveType: null,
          date: parsedDate,
        },
  });

  if (parsedHours <= 0) {
    if (existingEntry) {
      await prisma.timeEntry.delete({ where: { id: existingEntry.id } });
    }

    return NextResponse.json({ success: true, deleted: !!existingEntry });
  }

  const entryData = {
    organizationId: currentUser.organizationId,
    userId: currentUser.id,
    projectId: isLeave ? null : projectId,
    phaseId: isLeave ? null : phaseId,
    leaveType: isLeave ? (leaveType as LeaveType) : null,
    date: parsedDate,
    hours: new Prisma.Decimal(parsedHours),
    description: description || undefined,
    isBillable: !isLeave,
  };

  const savedEntry = existingEntry
    ? await prisma.timeEntry.update({
        where: { id: existingEntry.id },
        data: entryData,
      })
    : await prisma.timeEntry.create({ data: entryData });

  if (!isLeave && projectId) {
    void checkAndSendBudgetAlert(projectId).catch((err) => {
      console.error("[time] Budget alert check failed:", err);
    });
  }

  return NextResponse.json({ success: true, entry: savedEntry });
}
