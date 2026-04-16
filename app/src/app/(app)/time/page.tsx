import { addDays, format, startOfWeek } from "date-fns";
import { getCurrentUser } from "@/lib/supabase/auth";
import { prisma } from "@/lib/prisma";
import { PHASE_LABELS } from "@/lib/constants";
import { computeUserLeaveBalances, LEAVE_TYPE_LABELS } from "@/lib/leave";
import TimeSheetClient from "./TimeSheetClient";
import TimesheetSubmitClient from "./TimesheetSubmitClient";
import TimesheetUserSelector from "./TimesheetUserSelector";

function getWeekStart(date: Date) {
  return startOfWeek(date, { weekStartsOn: 1 });
}

const DAY_NAMES = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const ADMIN_ROLES = ["OWNER", "ADMIN", "SUPERVISOR"];

export default async function TimePage({
  searchParams,
}: {
  searchParams: Promise<{ userId?: string }>;
}) {
  const params = await searchParams;
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

  const canViewOthers = ADMIN_ROLES.includes(currentUser.role);

  // Determine which user's timesheet to display
  let viewingUserId = currentUser.id;
  let viewingUserName = "your";
  let isViewingOther = false;

  if (canViewOthers && params.userId && params.userId !== currentUser.id) {
    // Verify the selected user belongs to the same org
    const selectedUser = await prisma.user.findUnique({
      where: { id: params.userId },
      select: { id: true, fullName: true, organizationId: true },
    });
    if (selectedUser && selectedUser.organizationId === currentUser.organizationId) {
      viewingUserId = selectedUser.id;
      viewingUserName = `${selectedUser.fullName}'s`;
      isViewingOther = true;
    }
  }

  // Fetch team members for the admin selector
  let teamMembers: Array<{ id: string; fullName: string }> = [];
  if (canViewOthers) {
    teamMembers = await prisma.user.findMany({
      where: { organizationId: currentUser.organizationId, isActive: true },
      select: { id: true, fullName: true },
      orderBy: { fullName: "asc" },
    });
  }

  const weekStartDate = getWeekStart(new Date());
  const weekDates = Array.from({ length: 7 }, (_, index) =>
    addDays(weekStartDate, index)
  );

  const timesheet = await prisma.weeklyTimesheet.findUnique({
    where: {
      userId_weekStart: {
        userId: viewingUserId,
        weekStart: weekStartDate,
      },
    },
  });

  const projects = await prisma.project.findMany({
    where: { organizationId: currentUser.organizationId, status: { not: "ARCHIVED" } },
    include: {
      phases: {
        orderBy: { sortOrder: "asc" },
      },
    },
    orderBy: { name: "asc" },
  });

  const entries = await prisma.timeEntry.findMany({
    where: {
      userId: viewingUserId,
      date: { gte: weekStartDate, lte: addDays(weekStartDate, 6) },
    },
  });

  const projectsForClient = projects.map((p) => ({
    id: p.id,
    name: p.name,
    phases: p.phases.map((phase) => ({
      id: phase.id,
      name: PHASE_LABELS[phase.phaseType] ?? phase.phaseType,
    })),
  }));

  const initialEntries: Record<string, string> = {};
  entries.forEach((entry) => {
    const dateKey = format(entry.date, "yyyy-MM-dd");
    const key = entry.leaveType
      ? `LEAVE:${entry.leaveType}:${dateKey}`
      : `${entry.projectId}:${entry.phaseId}:${dateKey}`;
    initialEntries[key] = entry.hours.toString();
  });

  const seenRows = new Set<string>();
  const initialRows: Array<{ projectId: string; phaseId: string; leaveType?: string }> = [];
  entries.forEach((entry) => {
    const rowKey = entry.leaveType
      ? `LEAVE:${entry.leaveType}`
      : `${entry.projectId}:${entry.phaseId}`;
    if (seenRows.has(rowKey)) return;
    seenRows.add(rowKey);
    if (entry.leaveType) {
      initialRows.push({ projectId: "", phaseId: "", leaveType: entry.leaveType });
    } else if (entry.projectId && entry.phaseId) {
      initialRows.push({ projectId: entry.projectId, phaseId: entry.phaseId });
    }
  });

  const balances = await computeUserLeaveBalances(viewingUserId);

  const dateStrings = weekDates.map((d) => format(d, "yyyy-MM-dd"));
  const dateLabels = weekDates.map((d, i) => `${DAY_NAMES[i]} ${format(d, "M/d")}`);

  return (
    <div className="p-6 sm:p-8 max-w-6xl">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="font-serif text-3xl text-[#1A2E22]">Time Sheets</h1>
          <p className="mt-1 text-sm text-[#6B8C74]">
            {isViewingOther ? (
              <>Viewing {viewingUserName} timesheet · Week of {format(weekStartDate, "MMMM d, yyyy")}</>
            ) : (
              <>Week of {format(weekStartDate, "MMMM d, yyyy")}</>
            )}
          </p>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          {!canViewOthers && (
            <div className="inline-flex items-center gap-2 rounded-lg bg-[#F0FAF4] border border-[#52B788]/30 px-3 py-2 text-sm text-[#2D6A4F]">
              <span className="text-xs uppercase tracking-[0.18em] text-[#6B8C74] font-semibold">Logging as</span>
              <span className="font-medium">{currentUser.fullName}</span>
            </div>
          )}
          {canViewOthers && teamMembers.length > 1 && (
            <TimesheetUserSelector
              teamMembers={teamMembers}
              currentUserId={currentUser.id}
              selectedUserId={viewingUserId}
            />
          )}
          {!isViewingOther && (
            <TimesheetSubmitClient
              weekStart={format(weekStartDate, "yyyy-MM-dd")}
              status={timesheet?.status ?? "DRAFT"}
            />
          )}
        </div>
      </div>

      {isViewingOther && (
        <div className="mb-4 bg-amber-50 border border-amber-200 rounded-xl p-3 text-sm text-amber-800">
          You are viewing {viewingUserName} timesheet in read-only mode.
          {timesheet?.status === "SUBMITTED" && (
            <> This timesheet has been <span className="font-semibold">submitted</span> for approval.</>
          )}
          {timesheet?.status === "APPROVED" && (
            <> This timesheet has been <span className="font-semibold">approved</span>.</>
          )}
        </div>
      )}

      {balances.some((b) => b.annualHours > 0 || b.usedHours > 0) && (
        <div className="mb-5 grid grid-cols-2 sm:grid-cols-5 gap-3">
          {balances.map((b) => {
            const pct = b.annualHours > 0 ? (b.usedHours / b.annualHours) * 100 : 0;
            const accent =
              pct > 100
                ? "text-rose-600"
                : pct > 80
                  ? "text-amber-600"
                  : "text-[#2D6A4F]";
            return (
              <div
                key={b.type}
                className="rounded-2xl border border-[#E2EBE4] bg-white px-4 py-3 shadow-sm"
              >
                <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#6B8C74]">
                  {LEAVE_TYPE_LABELS[b.type]}
                </div>
                <div className={`mt-1 text-lg font-semibold ${accent}`}>
                  {b.remainingHours.toFixed(0)}h
                  <span className="text-[#A3BEA9] text-sm font-normal"> / {b.annualHours}h</span>
                </div>
                {b.annualHours > 0 && (
                  <div className="mt-2 h-1 rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className={`h-full ${
                        pct > 100 ? "bg-rose-500" : pct > 80 ? "bg-amber-500" : "bg-[#52B788]"
                      }`}
                      style={{ width: `${Math.min(pct, 100)}%` }}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      <TimeSheetClient
        projects={projectsForClient}
        dates={dateStrings}
        dateLabels={dateLabels}
        initialEntries={initialEntries}
        initialRows={initialRows}
        readOnly={isViewingOther}
      />
    </div>
  );
}
