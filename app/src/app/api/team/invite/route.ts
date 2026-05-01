import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/supabase/auth";
import { sendTransactional, LOOPS_TEMPLATES } from "@/lib/loops";
import type { UserRole } from "@prisma/client";

export const dynamic = "force-dynamic";

/**
 * POST /api/team/invite
 *
 * Create (or refresh) an invitation for an existing team member.
 * Used for members added before the invite system existed, or to
 * resend an expired invitation.
 *
 * Body: { email, role }
 */
export async function POST(request: Request) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
    }

    if (currentUser.role !== "OWNER" && currentUser.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Only owners and admins can send invites." },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { email, role } = body as { email?: string; role?: string };

    if (!email) {
      return NextResponse.json({ error: "Email is required." }, { status: 400 });
    }

    const cleanEmail = email.toLowerCase().trim();
    const userRole = (role as UserRole) || "STAFF";

    // Verify this email belongs to a user in the same org
    const targetUser = await prisma.user.findFirst({
      where: {
        email: cleanEmail,
        organizationId: currentUser.organizationId,
      },
    });

    if (!targetUser) {
      return NextResponse.json({ error: "User not found in this organization." }, { status: 404 });
    }

    // Check if there's already a valid pending invitation
    const existing = await prisma.invitation.findFirst({
      where: {
        email: cleanEmail,
        organizationId: currentUser.organizationId,
        acceptedAt: null,
        expiresAt: { gt: new Date() },
      },
    });

    if (existing) {
      // Return the existing token instead of creating a duplicate
      return NextResponse.json({ success: true, token: existing.token });
    }

    // Create a new invitation
    const invitation = await prisma.invitation.create({
      data: {
        organizationId: currentUser.organizationId,
        email: cleanEmail,
        role: userRole,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      },
    });

    // Fire-and-forget invite email
    const orgName = currentUser.organization?.name ?? "your firm";
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || new URL(request.url).origin;
    const inviteUrl = `${appUrl}/invite/${invitation.token}`;
    const [firstName] = targetUser.fullName.trim().split(/\s+/);

    void sendTransactional({
      email: cleanEmail,
      transactionalId: LOOPS_TEMPLATES.INVITE,
      dataVariables: {
        recipientName: firstName || "there",
        recipientFullName: targetUser.fullName.trim(),
        orgName,
        role: userRole,
        title: targetUser.title || "",
        inviteUrl,
      },
    }).catch((err) => {
      console.error("[loops] Invite email failed:", err);
    });

    return NextResponse.json({ success: true, token: invitation.token });
  } catch (error) {
    console.error("Send invite error:", error);
    return NextResponse.json(
      { error: "Failed to send invite." },
      { status: 500 }
    );
  }
}
