import { getCurrentUser } from "@/lib/supabase/auth";
import { prisma } from "@/lib/prisma";
import TimeApprovalClient from "./TimeApprovalClient";

export const dynamic = "force-dynamic";

export default async function TimeApprovePage() {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return (
      <div className="p-8">
        <div className="rounded-3xl border border-slate-200 bg-white p-8 text-slate-700">
          <h1 className="text-2xl font-semibold">Approve timesheets</h1>
          <p className="mt-3 text-sm text-slate-500">Please sign in to review submitted work.</p>
        </div>
      </div>
    );
  }

  const canApprove = ["OWNER", "ADMIN", "SUPERVISOR"].includes(currentUser.role);

  if (!canApprove) {
    return (
      <div className="p-8">
        <div className="rounded-3xl border border-slate-200 bg-white p-8 text-slate-700">
          <h1 className="text-2xl font-semibold">Approve timesheets</h1>
          <p className="mt-3 text-sm text-slate-500">You do not have permission to approve timesheets.</p>
        </div>
      </div>
    );
  }

  const submittedTimesheets = await prisma.weeklyTimesheet.findMany({
    where: {
      status: "SUBMITTED",
      user: { organizationId: currentUser.organizationId },
    },
    include: {
      user: true,
    },
    orderBy: { submittedAt: "desc" },
  });

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Approve timesheets</h1>
        <p className="mt-2 text-sm text-slate-500">Review and approve submitted weekly timesheets for your team.</p>
      </div>

      <TimeApprovalClient timesheets={submittedTimesheets} />
    </div>
  );
}
