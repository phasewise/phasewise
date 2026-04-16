import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

const allowedRoles = ["OWNER", "ADMIN", "PM", "SUPERVISOR"];

export async function POST(request: Request, { params }: { params: Promise<{ projectId: string }> }) {
  const { projectId } = await params;
  const body = await request.json();
  const { name, description, dueDate, assignedToId } = body;

  if (!name) {
    return NextResponse.json({ error: "Task name is required." }, { status: 400 });
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

  const project = await prisma.project.findUnique({ where: { id: projectId } });
  if (!project || project.organizationId !== currentUser.organizationId) {
    return NextResponse.json({ error: "Project not found." }, { status: 404 });
  }

  if (!allowedRoles.includes(currentUser.role)) {
    return NextResponse.json({ error: "Insufficient permissions." }, { status: 403 });
  }

  if (assignedToId) {
    const assignedUser = await prisma.user.findUnique({ where: { id: assignedToId } });
    if (!assignedUser || assignedUser.organizationId !== currentUser.organizationId) {
      return NextResponse.json({ error: "Assigned user not found." }, { status: 404 });
    }
  }

  const dueDateValue = dueDate ? new Date(dueDate) : undefined;
  if (dueDateValue && Number.isNaN(dueDateValue.getTime())) {
    return NextResponse.json({ error: "Invalid due date." }, { status: 400 });
  }

  const task = await prisma.projectTask.create({
    data: {
      projectId,
      name,
      description: description || undefined,
      dueDate: dueDateValue,
      assignedToId: assignedToId || undefined,
    },
  });

  return NextResponse.json({ success: true, task });
}

export async function PATCH(request: Request, { params }: { params: Promise<{ projectId: string }> }) {
  await params;
  const body = await request.json();
  const { taskId, status, assignedToId, name, description, dueDate } = body;

  if (!taskId) {
    return NextResponse.json({ error: "taskId is required." }, { status: 400 });
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

  const task = await prisma.projectTask.findUnique({
    where: { id: taskId },
    include: { project: true },
  });

  if (!task || task.project.organizationId !== currentUser.organizationId) {
    return NextResponse.json({ error: "Task not found." }, { status: 404 });
  }

  if (!allowedRoles.includes(currentUser.role) && currentUser.id !== task.assignedToId) {
    return NextResponse.json({ error: "Insufficient permissions." }, { status: 403 });
  }

  const data: any = {};
  if (status) {
    data.status = status;
    if (status === "COMPLETE") {
      data.completedAt = new Date();
    } else {
      data.completedAt = null;
    }
  }
  if (assignedToId !== undefined) {
    if (assignedToId) {
      const assignedUser = await prisma.user.findUnique({ where: { id: assignedToId } });
      if (!assignedUser || assignedUser.organizationId !== currentUser.organizationId) {
        return NextResponse.json({ error: "Assigned user not found." }, { status: 404 });
      }
    }
    data.assignedToId = assignedToId || null;
  }
  if (name !== undefined) data.name = name;
  if (description !== undefined) data.description = description;
  if (dueDate !== undefined) {
    data.dueDate = dueDate ? new Date(dueDate) : null;
  }

  const updated = await prisma.projectTask.update({
    where: { id: taskId },
    data,
    include: { assignedTo: true },
  });

  return NextResponse.json({ success: true, task: updated });
}

export async function DELETE(request: Request, { params }: { params: Promise<{ projectId: string }> }) {
  await params;
  const { searchParams } = new URL(request.url);
  const taskId = searchParams.get("taskId");

  if (!taskId) {
    return NextResponse.json({ error: "taskId is required." }, { status: 400 });
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

  const task = await prisma.projectTask.findUnique({
    where: { id: taskId },
    include: { project: true },
  });

  if (!task || task.project.organizationId !== currentUser.organizationId) {
    return NextResponse.json({ error: "Task not found." }, { status: 404 });
  }

  if (!allowedRoles.includes(currentUser.role)) {
    return NextResponse.json({ error: "Insufficient permissions." }, { status: 403 });
  }

  await prisma.projectTask.delete({ where: { id: taskId } });
  return NextResponse.json({ success: true });
}
