import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/supabase/auth";
import { prisma } from "@/lib/prisma";
import {
  DEFAULT_LEAVE_POLICY,
  computeUserLeaveBalances,
  LeavePolicy,
} from "@/lib/leave";
import LeaveAdminClient from "./LeaveAdminClient";

export const dynamic = "force-dynamic";

export default async function LeaveAdminPage() {
  const currentUser = await getCurrentUser();
  if (!currentUser) redirect("/login");
  if (currentUser.role !== "OWNER" && currentUser.role !== "ADMIN") {
    redirect("/dashboard");
  }

  const org = await prisma.organization.findUnique({
    where: { id: currentUser.organizationId },
    select: { leavePolicy: true },
  });

  const users = await prisma.user.findMany({
    where: { organizationId: currentUser.organizationId, isActive: true },
    select: {
      id: true,
      fullName: true,
      role: true,
      leavePolicyOverride: true,
    },
    orderBy: { fullName: "asc" },
  });

  const balances = await Promise.all(
    users.map(async (u) => ({
      userId: u.id,
      balances: await computeUserLeaveBalances(u.id),
    }))
  );

  return (
    <LeaveAdminClient
      orgPolicy={(org?.leavePolicy as LeavePolicy | null) ?? DEFAULT_LEAVE_POLICY}
      users={users.map((u) => ({
        id: u.id,
        fullName: u.fullName,
        role: u.role,
        override: (u.leavePolicyOverride as LeavePolicy | null) ?? null,
      }))}
      balancesByUser={balances}
    />
  );
}
