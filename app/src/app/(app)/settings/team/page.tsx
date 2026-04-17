import { getCurrentUser } from "@/lib/supabase/auth";
import { prisma } from "@/lib/prisma";
import TeamMembersClient from "./TeamMembersClient";
import TeamRoleClient from "./TeamRoleClient";
import TeamBillingClient from "./TeamBillingClient";

export const dynamic = "force-dynamic";

export default async function TeamSettingsPage() {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return (
      <div className="p-8">
        <div className="rounded-3xl border border-[#E2EBE4] bg-white p-8 text-[#1A2E22]">
          <h1 className="font-serif text-2xl">Team settings</h1>
          <p className="mt-3 text-sm text-[#6B8C74]">Please sign in to manage the team.</p>
        </div>
      </div>
    );
  }

  const canManageBilling =
    currentUser.role === "OWNER" || currentUser.role === "ADMIN";

  const canSeeBillingRate =
    canManageBilling || currentUser.role === "SUPERVISOR" || currentUser.role === "PM";

  // Query pending invitations so we can show "Copy invite link" for members who haven't joined yet
  const pendingInvites = canManageBilling
    ? await prisma.invitation.findMany({
        where: {
          organizationId: currentUser.organizationId,
          acceptedAt: null,
          expiresAt: { gt: new Date() },
        },
        select: { email: true, token: true },
      })
    : [];
  const inviteByEmail = new Map(pendingInvites.map((inv) => [inv.email, inv.token]));

  // Query all users with billing info appropriate to the current user's access level
  const users = await prisma.user.findMany({
    where: { organizationId: currentUser.organizationId },
    orderBy: [{ isActive: "desc" }, { fullName: "asc" }],
    select: {
      id: true,
      fullName: true,
      email: true,
      role: true,
      title: true,
      isActive: true,
      photoUrl: true,
      billingRate: canSeeBillingRate,
      salary: canManageBilling, // Only OWNER/ADMIN see salary
      costRate: canManageBilling,
    },
  });

  // Transform Decimal fields to numbers for client serialization
  const usersForClient = users.map((u) => ({
    id: u.id,
    fullName: u.fullName,
    email: u.email,
    role: u.role,
    title: u.title,
    isActive: u.isActive,
    photoUrl: u.photoUrl,
    billingRate: canSeeBillingRate && "billingRate" in u ? Number(u.billingRate ?? 0) : null,
    salary: canManageBilling && "salary" in u ? Number(u.salary ?? 0) : null,
    costRate: canManageBilling && "costRate" in u ? Number(u.costRate ?? 0) : null,
    inviteToken: inviteByEmail.get(u.email) || null,
  }));

  return (
    <div className="p-6 sm:p-8 max-w-5xl">
      <div className="mb-8">
        <h1 className="font-serif text-3xl text-[#1A2E22]">Team</h1>
        <p className="mt-2 text-sm text-[#6B8C74]">
          Manage staff roles{canManageBilling ? ", billing rates, and salary information" : " and team assignments"}.
        </p>
      </div>

      {/* Team members: add, view, deactivate */}
      <TeamMembersClient users={usersForClient} canManage={canManageBilling} />

      {/* Role management */}
      <div className="mb-10">
        <h2 className="text-lg font-semibold text-[#1A2E22] mb-4">Roles</h2>
        <TeamRoleClient currentUser={currentUser} users={usersForClient} />
      </div>

      {/* Billing rates & salary — only OWNER/ADMIN + SUPERVISOR/PM can see this */}
      {canSeeBillingRate && (
        <div>
          <h2 className="text-lg font-semibold text-[#1A2E22] mb-2">Billing Rates</h2>
          <p className="text-sm text-[#6B8C74] mb-4">
            {canManageBilling
              ? "Set billing rates and salary for each team member. Staff members can only see their own rate."
              : "Billing rates for team members. Contact your firm owner to make changes."}
          </p>
          <TeamBillingClient
            users={usersForClient}
            canManage={canManageBilling}
            canSeeSalary={canManageBilling}
            currentUserId={currentUser.id}
          />
        </div>
      )}
    </div>
  );
}
