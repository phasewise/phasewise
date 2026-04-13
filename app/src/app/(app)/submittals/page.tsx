import { getCurrentUser } from "@/lib/supabase/auth";
import { prisma } from "@/lib/prisma";
import SubmittalsClient from "./SubmittalsClient";

export const dynamic = "force-dynamic";

const STATUS_COLORS: Record<string, string> = {
  PENDING: "bg-amber-50 text-amber-700 border-amber-200",
  UNDER_REVIEW: "bg-blue-50 text-blue-700 border-blue-200",
  APPROVED: "bg-[#F0FAF4] text-[#2D6A4F] border-[#52B788]/30",
  REJECTED: "bg-rose-50 text-rose-700 border-rose-200",
  RESUBMIT: "bg-orange-50 text-orange-700 border-orange-200",
  CLOSED: "bg-[#F7F9F7] text-[#6B8C74] border-[#E2EBE4]",
};

export default async function SubmittalsPage() {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return (
      <div className="p-6 sm:p-8">
        <div className="rounded-2xl border border-[#E2EBE4] bg-white p-8 text-[#1A2E22]">
          <h1 className="font-serif text-2xl">Submittals & RFIs</h1>
          <p className="mt-3 text-sm text-[#6B8C74]">Please sign in to manage submittals.</p>
        </div>
      </div>
    );
  }

  // Fetch submittals
  const submittals = await prisma.submittal.findMany({
    where: { organizationId: currentUser.organizationId },
    include: {
      project: { select: { id: true, name: true } },
      createdBy: { select: { fullName: true } },
      assignedTo: { select: { fullName: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  // Fetch projects for the create form dropdown
  const projects = await prisma.project.findMany({
    where: { organizationId: currentUser.organizationId, status: { not: "ARCHIVED" } },
    select: { id: true, name: true },
    orderBy: { name: "asc" },
  });

  // Fetch team members for assignment dropdown
  const teamMembers = await prisma.user.findMany({
    where: { organizationId: currentUser.organizationId, isActive: true },
    select: { id: true, fullName: true },
    orderBy: { fullName: "asc" },
  });

  const submittalsForClient = submittals.map((s) => ({
    id: s.id,
    type: s.type,
    number: s.number,
    subject: s.subject,
    description: s.description,
    status: s.status,
    ballInCourt: s.ballInCourt,
    dueDate: s.dueDate?.toISOString() ?? null,
    submittedDate: s.submittedDate?.toISOString() ?? null,
    responseDate: s.responseDate?.toISOString() ?? null,
    projectId: s.projectId,
    projectName: s.project.name,
    createdBy: s.createdBy.fullName,
    assignedTo: s.assignedTo?.fullName ?? null,
    assignedToId: s.assignedToId,
    createdAt: s.createdAt.toISOString(),
  }));

  // Summary stats
  const openCount = submittals.filter((s) => !["APPROVED", "CLOSED", "REJECTED"].includes(s.status)).length;
  const overdueCount = submittals.filter((s) => {
    if (!s.dueDate) return false;
    if (["APPROVED", "CLOSED", "REJECTED"].includes(s.status)) return false;
    return s.dueDate < new Date();
  }).length;

  return (
    <div className="p-6 sm:p-8 max-w-6xl">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="font-serif text-3xl text-[#1A2E22]">Submittals & RFIs</h1>
          <p className="mt-1 text-sm text-[#6B8C74]">
            {openCount} open · {overdueCount > 0 && <span className="text-rose-600">{overdueCount} overdue</span>}
            {overdueCount === 0 && "none overdue"}
          </p>
        </div>
      </div>

      <SubmittalsClient
        submittals={submittalsForClient}
        projects={projects}
        teamMembers={teamMembers}
        statusColors={STATUS_COLORS}
      />
    </div>
  );
}
