import { NextResponse } from "next/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

/**
 * GET /api/invitations/[token]
 *
 * Public endpoint — verifies an invitation token and returns the org name,
 * role, and email so the invite page can render the acceptance form.
 */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params;

  const invitation = await prisma.invitation.findUnique({
    where: { token },
    include: { organization: { select: { name: true } } },
  });

  if (!invitation) {
    return NextResponse.json({ error: "Invitation not found" }, { status: 404 });
  }

  if (invitation.acceptedAt) {
    return NextResponse.json({ error: "Invitation already accepted" }, { status: 409 });
  }

  if (invitation.expiresAt < new Date()) {
    return NextResponse.json({ error: "Invitation has expired" }, { status: 410 });
  }

  return NextResponse.json({
    email: invitation.email,
    role: invitation.role,
    organizationName: invitation.organization.name,
    expiresAt: invitation.expiresAt.toISOString(),
  });
}

/**
 * POST /api/invitations/[token]
 *
 * Public endpoint — accepts an invitation by creating a Supabase auth
 * account, linking the pending User row, and signing the user in.
 *
 * Body: { password: string }
 */
export async function POST(
  request: Request,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params;

    const body = await request.json();
    const { password } = body as { password?: string };

    if (!password || password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters." },
        { status: 400 }
      );
    }

    const invitation = await prisma.invitation.findUnique({
      where: { token },
      include: { organization: { select: { name: true } } },
    });

    if (!invitation) {
      return NextResponse.json({ error: "Invitation not found" }, { status: 404 });
    }

    if (invitation.acceptedAt) {
      return NextResponse.json({ error: "Invitation already accepted" }, { status: 409 });
    }

    if (invitation.expiresAt < new Date()) {
      return NextResponse.json({ error: "Invitation has expired" }, { status: 410 });
    }

    // Create the Supabase auth user via admin API (skips email verification
    // since they proved email ownership by having the invite token)
    const supabaseAdmin = createAdminClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: invitation.email,
      password,
      email_confirm: true,
    });

    if (authError || !authData.user) {
      console.error("[invite] Supabase auth error:", authError);
      const message = authError?.message || "Failed to create account";
      // If user already has an account, give a helpful message
      if (message.includes("already been registered") || message.includes("already exists")) {
        return NextResponse.json(
          { error: "This email already has an account. Please log in instead." },
          { status: 409 }
        );
      }
      return NextResponse.json({ error: message }, { status: 500 });
    }

    // Link the pending User row to the real Supabase auth ID + mark invitation accepted
    await prisma.$transaction([
      prisma.user.updateMany({
        where: {
          email: invitation.email,
          organizationId: invitation.organizationId,
          authId: { startsWith: "pending_" },
        },
        data: { authId: authData.user.id },
      }),
      prisma.invitation.update({
        where: { token },
        data: { acceptedAt: new Date() },
      }),
    ]);

    // Sign the user in so they land on /dashboard already authenticated
    const supabase = await createClient();
    await supabase.auth.signInWithPassword({
      email: invitation.email,
      password,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[invite] Accept invitation error:", error);
    return NextResponse.json(
      { error: "Failed to accept invitation." },
      { status: 500 }
    );
  }
}
