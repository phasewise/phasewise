import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

const allowedRoles = ["OWNER", "ADMIN", "PM"];

export async function POST(request: Request, { params }: { params: Promise<{ projectId: string }> }) {
  const { projectId } = await params;
  const body = await request.json();
  const { userId, action } = body;

  if (!userId || !action) {
    return NextResponse.json({ error: "userId and action are required." }, { status: 400 });
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  const currentUser = await prisma.user.findUnique({ where: { authId: user.id } });

  if (!currentUser) {
    return NextResponse.json({ error: "Current user not found." }, { status: 401 });
  }

  if (!allowedRoles.includes(currentUser.role)) {
    return NextResponse.json({ error: "Insufficient permissions." }, { status: 403 });
  }

  const project = await prisma.project.findUnique({
    where: { id: projectId },
  });

  if (!project || project.organizationId !== currentUser.organizationId) {
    return NextResponse.json({ error: "Project not found." }, { status: 404 });
  }

  const targetUser = await prisma.user.findUnique({ where: { id: userId } });

  if (!targetUser || targetUser.organizationId !== currentUser.organizationId) {
    return NextResponse.json({ error: "User not found." }, { status: 404 });
  }

  if (action === "assign") {
    const assignment = await prisma.projectAssignment.upsert({
      where: {
        projectId_userId: {
          projectId,
          userId,
        },
      },
      update: {},
      create: {
        projectId,
        userId,
      },
    });

    return NextResponse.json({ success: true, assignment });
  }

  if (action === "remove") {
    await prisma.projectAssignment.deleteMany({
      where: { projectId, userId },
    });

    return NextResponse.json({ success: true });
  }

  return NextResponse.json({ error: "Unsupported action." }, { status: 400 });
}
