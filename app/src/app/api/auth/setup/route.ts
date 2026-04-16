import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { upsertContact, sendTransactional, LOOPS_TEMPLATES } from "@/lib/loops";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const { authId, fullName, firmName, email } = await request.json();

    if (!authId || !fullName || !firmName || !email) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Generate slug from firm name
    const slug = firmName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

    // Check if slug already exists
    const existing = await prisma.organization.findUnique({ where: { slug } });
    const finalSlug = existing ? `${slug}-${Date.now()}` : slug;

    // Create organization and user in a transaction
    const result = await prisma.$transaction(async (tx) => {
      const org = await tx.organization.create({
        data: {
          name: firmName,
          slug: finalSlug,
          plan: "TRIAL",
          trialEndsAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days
        },
      });

      const user = await tx.user.create({
        data: {
          authId,
          organizationId: org.id,
          fullName,
          email,
          role: "OWNER",
        },
      });

      return { org, user };
    });

    // Email + audience sync — fire-and-forget, never blocks the response.
    // Loops failures must not prevent the user from completing signup.
    const [firstName, ...lastNameParts] = fullName.trim().split(/\s+/);
    const lastName = lastNameParts.join(" ");

    void Promise.all([
      upsertContact({
        email,
        firstName,
        lastName: lastName || undefined,
        userId: result.user.id,
        source: "Phasewise signup",
        userGroup: "trial",
      }),
      sendTransactional({
        email,
        transactionalId: LOOPS_TEMPLATES.WELCOME,
        dataVariables: {
          // recipientName / firmName avoid Loops' built-in contact
          // property names (firstName, lastName, email) so they can
          // be used safely as data variables in MJML templates.
          recipientName: firstName || "there",
          firmName,
        },
      }),
    ]).catch((err) => {
      console.error("[loops] Post-signup email/contact sync failed:", err);
    });

    return NextResponse.json({
      organizationId: result.org.id,
      userId: result.user.id,
    });
  } catch (error) {
    console.error("Setup error:", error);
    return NextResponse.json(
      { error: "Failed to create account" },
      { status: 500 }
    );
  }
}
