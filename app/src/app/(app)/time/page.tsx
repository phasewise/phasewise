import { addDays, format, startOfWeek } from "date-fns";
import { getCurrentUser } from "@/lib/supabase/auth";
import { prisma } from "@/lib/prisma";
import { PHASE_LABELS } from "@/lib/constants";
import TimeSheetClient from "./TimeSheetClient";
import TimesheetSubmitClient from "./TimesheetSubmitClient";

function getWeekStart(date: Date) {
  return startOfWeek(date, { weekStartsOn: 1 });
}

const DAY_NAMES = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export default async function TimePage() {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return (
      <div className="p-6 sm:p-8">
        <div className="rounded-2xl border border-[#E2EBE4] bg-white p-8 text-[#1A2E22]">
          <h1 className="font-serif text-2xl">Time Sheets</h1>
          <p className="mt-3 text-sm text-[#6B8C74]">Please sign in to access time entry.</p>
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

  // Fetch active (non-archived) projects with their phases
  const projects = await prisma.project.findMany({
    where: { organizationId: currentUser.organizationId, status: { not: "ARCHIVED" } },
    include: {
      phases: {
        orderBy: { sortOrder: "asc" },
      },
    },
    orderBy: { name: "asc" },
  });

  // Fetch existing time entries for this week
  const entries = await prisma.timeEntry.findMany({
    where: {
      userId: currentUser.id,
      date: { gte: weekStartDate, lte: addDays(weekStartDate, 6) },
    },
  });

  // Format projects for the client
  const projectsForClient = projects.map((p) => ({
    id: p.id,
    name: p.name,
    phases: p.phases.map((phase) => ({
      id: phase.id,
      name: PHASE_LABELS[phase.phaseType] ?? phase.phaseType,
    })),
  }));

  // Build initial entries map (key: projectId:phaseId:date → value: hours)
  const initialEntries: Record<string, string> = {};
  entries.forEach((entry) => {
    const key = `${entry.projectId}:${entry.phaseId}:${format(entry.date, "yyyy-MM-dd")}`;
    initialEntries[key] = entry.hours.toString();
  });

  // Build initial rows from existing entries (unique project+phase combos)
  const seenRows = new Set<string>();
  const initialRows: Array<{ projectId: string; phaseId: string }> = [];
  entries.forEach((entry) => {
    const rowKey = `${entry.projectId}:${entry.phaseId}`;
    if (!seenRows.has(rowKey)) {
      seenRows.add(rowKey);
      initialRows.push({ projectId: entry.projectId, phaseId: entry.phaseId });
    }
  });

  const dateStrings = weekDates.map((d) => format(d, "yyyy-MM-dd"));
  const dateLabels = weekDates.map((d, i) => `${DAY_NAMES[i]} ${format(d, "M/d")}`);

  return (
    <div className="p-6 sm:p-8 max-w-6xl">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="font-serif text-3xl text-[#1A2E22]">Time Sheets</h1>
          <p className="mt-1 text-sm text-[#6B8C74]">
            Week of {format(weekStartDate, "MMMM d, yyyy")}
          </p>
        </div>
        <TimesheetSubmitClient
          weekStart={format(weekStartDate, "yyyy-MM-dd")}
          status={timesheet?.status ?? "DRAFT"}
        />
      </div>

      <TimeSheetClient
        projects={projectsForClient}
        dates={dateStrings}
        dateLabels={dateLabels}
        initialEntries={initialEntries}
        initialRows={initialRows}
      />
    </div>
  );
}
