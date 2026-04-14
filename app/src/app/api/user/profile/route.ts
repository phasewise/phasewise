import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/supabase/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const currentUser = await getCurrentUser();
  if (!currentUser) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.json({
    id: currentUser.id,
    fullName: currentUser.fullName,
    email: currentUser.email,
    title: currentUser.title,
    phone: currentUser.phone,
    photoUrl: currentUser.photoUrl,
    role: currentUser.role,
  });
}

export async function PATCH(request: NextRequest) {
  const currentUser = await getCurrentUser();
  if (!currentUser) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { fullName, title, phone, photoUrl } = body;

  const data: Record<string, string | null> = {};
  if (fullName !== undefined) data.fullName = fullName;
  if (title !== undefined) data.title = title || null;
  if (phone !== undefined) data.phone = phone || null;
  if (photoUrl !== undefined) data.photoUrl = photoUrl || null;

  const updated = await prisma.user.update({
    where: { id: currentUser.id },
    data,
  });

  return NextResponse.json({
    id: updated.id,
    fullName: updated.fullName,
    email: updated.email,
    title: updated.title,
    phone: updated.phone,
    photoUrl: updated.photoUrl,
    role: updated.role,
  });
}
