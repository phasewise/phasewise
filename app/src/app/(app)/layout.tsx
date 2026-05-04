import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/supabase/auth";
import { prisma } from "@/lib/prisma";
import MobileSidebar from "./_components/MobileSidebar";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    redirect("/login");
  }

  // Notification counts — surfaced as badges on relevant nav items so
  // operators see what needs them without having to open each page
  // first. Computed per-request because the sidebar re-renders on
  // route changes anyway.
  const isOwnerOrAdmin = currentUser.role === "OWNER" || currentUser.role === "ADMIN";
  const isApprover =
    isOwnerOrAdmin || currentUser.role === "SUPERVISOR";

  const [pendingApprovals, draftInvoices, overdueSubmittals] = await Promise.all([
    // SUBMITTED timesheets in this user's approver scope. Role-approvers
    // see all of org; everyone else only direct reports OR alternate-
    // supervisor reports (vacation cover). Mirrors the /time/approve
    // page's scoping rule.
    prisma.weeklyTimesheet.count({
      where: {
        status: "SUBMITTED",
        user: {
          organizationId: currentUser.organizationId,
          ...(isApprover
            ? {}
            : {
                OR: [
                  { supervisorId: currentUser.id },
                  { alternateSupervisorId: currentUser.id },
                ],
              }),
        },
      },
    }),
    // DRAFT invoices the auto-cron has prepared (or the user has) —
    // OWNER/ADMIN only. Staff don't bill.
    isOwnerOrAdmin
      ? prisma.invoice.count({
          where: {
            organizationId: currentUser.organizationId,
            status: "DRAFT",
          },
        })
      : 0,
    // Overdue submittals where this user is the assignee — the closest
    // user-FK proxy for "the ball is in your court". (`ballInCourt`
    // is free-text on Submittal so we use `assignedToId` instead.)
    prisma.submittal.count({
      where: {
        project: { organizationId: currentUser.organizationId },
        assignedToId: currentUser.id,
        responseDate: null,
        dueDate: { lt: new Date() },
      },
    }),
  ]);

  const user = {
    fullName: currentUser.fullName,
    email: currentUser.email,
    role: currentUser.role,
    photoUrl: currentUser.photoUrl,
    organization: currentUser.organization
      ? { name: currentUser.organization.name }
      : null,
  };

  return (
    <div className="flex h-screen bg-[#F7F9F7]">
      {/* MobileSidebar handles both the mobile hamburger + drawer AND
          the desktop always-visible sidebar, using lg: breakpoint. */}
      <MobileSidebar
        user={user}
        notifications={{
          pendingApprovals,
          draftInvoices,
          overdueSubmittals,
        }}
      />

      {/* Main content — add top padding on mobile so content doesn't
          hide behind the fixed mobile top bar (h-14 = 56px). On
          desktop the sidebar is always visible so no top padding. */}
      <main className="flex-1 overflow-auto bg-[#F7F9F7] pt-14 lg:pt-0">
        {children}
      </main>
    </div>
  );
}
