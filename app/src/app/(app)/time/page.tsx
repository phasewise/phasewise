import { addDays, format, startOfWeek } from "date-fns";
import { getCurrentUser } from "@/lib/supabase/auth";
import { prisma } from "@/lib/prisma";
import { PHASE_LABELS } from "@/lib/constants";
import TimeSheetClient from "./TimeSheetClient";
import TimesheetSubmitClient from "./TimesheetSubmitClient";

function getWeekStart(date: Date) {
  return startOfWeek(date, { weekStartsOn: 1 });
}

export default async function TimePage() {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return (
      <div className="p-8">
        <div className="rounded-3xl border border-slate-200 bg-white p-8 text-slate-700">
          <h1 className="text-2xl font-semibold">Weekly timesheet</h1>
          <p className="mt-3 text-sm text-slate-500">Please sign in to access time entry.</p>
        </div>
      </div>
    );
  }

  const weekStartDate = getWeekStart(new Date());
  const weekDates = Array.from({ length: 7 }, (_, index) =>
    addDays(weekStartDate, index)
  );

  const timesheet = await prisma.weeklyTimesheet.findUnique({
    where: {
      userId_weekStart: {
        userId: currentUser.id,
        weekStart: weekStartDate,
      },
    },
  });

  const projects = await prisma.project.findMany({
    where: { organizationId: currentUser.organizationId, status: { not: "ARCHIVED" } },
    include: {
      phases: {
        where: { status: { not: "COMPLETE" } },
        orderBy: { sortOrder: "asc" },
      },
    },
    orderBy: { name: "asc" },
  });

  const entries = await prisma.timeEntry.findMany({
    where: {
      userId: currentUser.id,
      date: { gte: weekStartDate, lte: addDays(weekStartDate, 6) },
    },
  });

  const rows = projects.flatMap((project) =>
    project.phases.map((phase) => ({
      projectId: project.id,
      projectName: project.name,
      phaseId: phase.id,
      phaseName: PHASE_LABELS[phase.phaseType] ?? phase.phaseType,
    }))
  );

  const initialEntries: Record<string, string> = {};

  entries.forEach((entry) => {
    const key = `${entry.projectId}:${entry.phaseId}:${format(entry.date, "yyyy-MM-dd")}`;
    initialEntries[key] = entry.hours.toString();
  });

  const dateStrings = weekDates.map((date) => format(date, "yyyy-MM-dd"));

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Weekly timesheet</h1>
        <p className="mt-2 text-sm text-slate-500">
          Log hours for the week starting {format(weekStartDate, "MMM d, yyyy")}.
        </p>
      </div>

      <div className="grid gap-6 xl:grid-cols-[360px_1fr] mb-6">
        <TimesheetSubmitClient
          weekStart={format(weekStartDate, "yyyy-MM-dd")}
          status={timesheet?.status ?? "DRAFT"}
        />
      </div>

      <TimeSheetClient rows={rows} dates={dateStrings} initialEntries={initialEntries} />
    </div>
  );
}
