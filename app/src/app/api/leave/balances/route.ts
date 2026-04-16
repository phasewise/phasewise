import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/supabase/auth";
import { computeUserLeaveBalances } from "@/lib/leave";

export const dynamic = "force-dynamic";

// GET /api/leave/balances           -> own balances
// GET /api/leave/balances?all=1     -> all users (admin/owner)
// GET /api/leave/balances?userId=x  -> specific user (admin/owner)
export async function GET(request: Request) {
  const currentUser = await getCurrentUser();
  if (!currentUser) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const all = searchParams.get("all") === "1";
  const userIdParam = searchParams.get("userId");

  const isAdmin = currentUser.role === "OWNER" || currentUser.role === "ADMIN";

  if (all) {
    if (!isAdmin) {
      return NextResponse.json({ error: "Insufficient permissions." }, { status: 403 });
    }
    const users = await prisma.user.findMany({
      where: { organizationId: currentUser.organizationId, isActive: true },
      select: { id: true, fullName: true, role: true },
      orderBy: { fullName: "asc" },
    });
    const results = await Promise.all(
      users.map(async (u) => ({
        user: u,
        balances: await computeUserLeaveBalances(u.id),
      }))
    );
    return NextResponse.json({ results });
  }

  const targetUserId = userIdParam ?? currentUser.id;
  if (targetUserId !== currentUser.id && !isAdmin) {
    return NextResponse.json({ error: "Insufficient permissions." }, { status: 403 });
  }

  const balances = await computeUserLeaveBalances(targetUserId);
  return NextResponse.json({ balances });
}
