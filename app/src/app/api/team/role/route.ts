import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

const validRoles = ["OWNER", "ADMIN", "SUPERVISOR", "PM", "STAFF"] as const;
const roleManagers = ["OWNER", "ADMIN"];

export async function POST(request: Request) {
  const body = await request.json();
  const { userId, role } = body;

  if (!userId || !role) {
    return NextResponse.json({ error: "Missing userId or role." }, { status: 400 });
  }

  if (!validRoles.includes(role)) {
    return NextResponse.json({ error: "Invalid role." }, { status: 400 });
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  const currentUser = await prisma.user.findUnique({
    where: { authId: user.id },
  });

  if (!currentUser) {
    return NextResponse.json({ error: "Current user not found." }, { status: 401 });
  }

  if (!roleManagers.includes(currentUser.role)) {
    return NextResponse.json({ error: "Insufficient permissions." }, { status: 403 });
  }

  const targetUser = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!targetUser || targetUser.organizationId !== currentUser.organizationId) {
    return NextResponse.json({ error: "Target user not found." }, { status: 404 });
  }

  if (role === "OWNER" && currentUser.role !== "OWNER") {
    return NextResponse.json({ error: "Only owners can promote owners." }, { status: 403 });
  }

  const updated = await prisma.user.update({
    where: { id: userId },
    data: { role },
  });

  return NextResponse.json({ user: updated });
}
