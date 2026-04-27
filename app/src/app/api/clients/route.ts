import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/supabase/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
    }

    const clients = await prisma.client.findMany({
      where: { organizationId: currentUser.organizationId },
      orderBy: { name: "asc" },
      take: 500,
    });

    return NextResponse.json({ clients });
  } catch (error) {
    console.error("List clients error:", error);
    return NextResponse.json({ error: "Failed to load clients." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
    }

    const body = await request.json();
    const { name, contactPerson, email, phone, address, city, state, zip, notes } = body;

    if (!name) {
      return NextResponse.json({ error: "Client name is required." }, { status: 400 });
    }

    const client = await prisma.client.create({
      data: {
        organizationId: currentUser.organizationId,
        name,
        contactPerson: contactPerson || undefined,
        email: email || undefined,
        phone: phone || undefined,
        address: address || undefined,
        city: city || undefined,
        state: state || undefined,
        zip: zip || undefined,
        notes: notes || undefined,
      },
    });

    return NextResponse.json({ success: true, client });
  } catch (error) {
    console.error("Create client error:", error);
    return NextResponse.json({ error: "Failed to create client." }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
    }

    const body = await request.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json({ error: "Client ID is required." }, { status: 400 });
    }

    const existing = await prisma.client.findUnique({
      where: { id },
      select: { organizationId: true },
    });

    if (!existing || existing.organizationId !== currentUser.organizationId) {
      return NextResponse.json({ error: "Client not found." }, { status: 404 });
    }

    const client = await prisma.client.update({
      where: { id },
      data: updates,
    });

    return NextResponse.json({ success: true, client });
  } catch (error) {
    console.error("Update client error:", error);
    return NextResponse.json({ error: "Failed to update client." }, { status: 500 });
  }
}
