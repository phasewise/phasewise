import { getCurrentUser } from "@/lib/supabase/auth";
import { prisma } from "@/lib/prisma";
import TeamRoleClient from "./TeamRoleClient";

export const dynamic = "force-dynamic";

export default async function TeamSettingsPage() {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return (
      <div className="p-8">
        <div className="rounded-3xl border border-slate-200 bg-white p-8 text-slate-700">
          <h1 className="text-2xl font-semibold">Team settings</h1>
          <p className="mt-3 text-sm text-slate-500">Please sign in to manage the team.</p>
        </div>
      </div>
    );
  }

  const users = await prisma.user.findMany({
    where: { organizationId: currentUser.organizationId },
    orderBy: { fullName: "asc" },
    select: {
      id: true,
      fullName: true,
      email: true,
      role: true,
    },
  });

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Team</h1>
        <p className="mt-2 text-sm text-slate-500">Invite supervisors and manage staff role assignments.</p>
      </div>

      <TeamRoleClient currentUser={currentUser} users={users} />
    </div>
  );
}
