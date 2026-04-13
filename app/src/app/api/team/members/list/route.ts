import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/supabase/auth";

export const dynamic = "force-dynamic";

/**
 * GET /api/team/members/list
 *
 * Returns all active team members for the current user's organization
 * with their billing rates. Used by the Work Plan editor to populate
 * staff dropdowns.
 */
export async function GET() {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
    }

    const members = await prisma.user.findMany({
      where: {
        organizationId: currentUser.organizationId,
        isActive: true,
      },
      select: {
        id: true,
        fullName: true,
        billingRate: true,
      },
      orderBy: { fullName: "asc" },
    });

    return NextResponse.json({
      members: members.map((m) => ({
        id: m.id,
        fullName: m.fullName,
        billingRate: Number(m.billingRate ?? 0),
      })),
    });
  } catch (error) {
    console.error("List team members error:", error);
    return NextResponse.json(
      { error: "Failed to load team members." },
      { status: 500 }
    );
  }
}
