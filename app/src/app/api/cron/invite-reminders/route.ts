import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendTransactional, LOOPS_TEMPLATES } from "@/lib/loops";

export const dynamic = "force-dynamic";

/**
 * GET /api/cron/invite-reminders
 *
 * Scans for unaccepted invitations that will expire in the next 1–3
 * days and sends one reminder email to each active OWNER of the
 * inviting organization. Each invitation gets exactly one reminder
 * (guaranteed by the `Invitation.reminderSentAt` stamp).
 *
 * Runs daily via Vercel Cron. The window is deliberately 1–3 days
 * (not exactly T-2) so a single skipped cron day doesn't leave an
 * invite un-reminded before it expires.
 *
 * Security: same Bearer-token pattern as the other cron endpoints.
 * Set CRON_SECRET in env vars.
 */
export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const now = new Date();
    const oneDay = 24 * 60 * 60 * 1000;
    const windowStart = new Date(now.getTime() + 1 * oneDay);
    const windowEnd = new Date(now.getTime() + 3 * oneDay);

    // Invitations expiring in [now+1d, now+3d] that haven't been
    // accepted AND haven't had a reminder sent yet.
    const invites = await prisma.invitation.findMany({
      where: {
        acceptedAt: null,
        reminderSentAt: null,
        expiresAt: {
          gt: windowStart,
          lte: windowEnd,
        },
      },
      include: {
        organization: {
          include: {
            users: {
              where: {
                role: "OWNER",
                isActive: true,
                // Skip pending_* placeholder authIds — those users have
                // not yet accepted their own invite and can't receive
                // meaningful email.
                authId: { not: { startsWith: "pending_" } },
              },
              orderBy: { createdAt: "asc" },
            },
          },
        },
      },
    });

    if (invites.length === 0) {
      return NextResponse.json({
        success: true,
        message: "No invitations in reminder window.",
        remindersScanned: 0,
        remindersSent: 0,
        ownersNotified: 0,
      });
    }

    // Skip the entire batch cleanly when the Loops template isn't
    // configured yet (env var missing). Mirrors the submittal-reminders
    // guard — better to skip than send through an unrelated template.
    if (!LOOPS_TEMPLATES.INVITE_EXPIRING) {
      console.warn(
        "Invite reminders cron: LOOPS_TEMPLATE_INVITE_EXPIRING not set — skipping all sends.",
      );
      return NextResponse.json({
        success: true,
        message: "Loops template not configured — skipped.",
        remindersScanned: invites.length,
        remindersSent: 0,
        ownersNotified: 0,
      });
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || new URL(request.url).origin;
    const teamPageUrl = `${appUrl}/team`;

    let ownersNotified = 0;
    let remindersSent = 0;

    for (const inv of invites) {
      const owners = inv.organization.users;
      if (owners.length === 0) {
        // No real active OWNER to notify — still stamp reminderSentAt
        // so we don't re-scan this invite every day. The org has bigger
        // problems (no owner) that a reminder email won't solve.
        await prisma.invitation.update({
          where: { id: inv.id },
          data: { reminderSentAt: now },
        });
        continue;
      }

      // Look up the pending User record created alongside the invitation
      // to surface a human name in the email (falls back to "your
      // teammate" if the lookup misses).
      const pendingUser = await prisma.user.findFirst({
        where: {
          email: inv.email,
          organizationId: inv.organizationId,
        },
        select: { fullName: true },
      });
      const inviteeName = pendingUser?.fullName?.trim() || "your teammate";
      const inviteeRole = inv.role.charAt(0) + inv.role.slice(1).toLowerCase();

      const msRemaining = inv.expiresAt.getTime() - now.getTime();
      const expiresInDays = Math.max(1, Math.ceil(msRemaining / oneDay));
      const expiresOnDate = new Intl.DateTimeFormat("en-US", {
        month: "long",
        day: "numeric",
      }).format(inv.expiresAt);

      // Send to every OWNER (usually just one). Use Promise.allSettled so
      // one Loops failure doesn't block sends to the other owners AND
      // doesn't prevent the reminderSentAt stamp. Any thrown errors get
      // captured by sendTransactional -> Sentry via the loops_operation
      // tag (see commit 1556636).
      const sends = await Promise.allSettled(
        owners.map((owner) => {
          const firstName = owner.fullName.trim().split(/\s+/)[0] || "there";
          return sendTransactional({
            email: owner.email,
            transactionalId: LOOPS_TEMPLATES.INVITE_EXPIRING,
            dataVariables: {
              recipientName: firstName,
              firmName: inv.organization.name,
              inviteeName,
              inviteeEmail: inv.email,
              inviteeRole,
              expiresInDays: String(expiresInDays),
              expiresOnDate,
              teamPageUrl,
            },
          });
        }),
      );

      // Count successful sends (fulfilled AND success:true). Fulfilled
      // rejections still count as ownersNotified conceptually — we
      // tried; the stamp goes on regardless.
      for (const s of sends) {
        ownersNotified++;
        if (s.status === "fulfilled" && s.value.success) remindersSent++;
      }

      // Always stamp reminderSentAt AFTER the send loop — even if every
      // send failed. Otherwise a persistently failing Loops account
      // would re-scan the same invite daily and spam Sentry with
      // duplicate timeout events. Sentry alert covers the visibility;
      // the stamp keeps the queue draining.
      await prisma.invitation.update({
        where: { id: inv.id },
        data: { reminderSentAt: now },
      });
    }

    return NextResponse.json({
      success: true,
      message: `Sent ${remindersSent} reminder${remindersSent === 1 ? "" : "s"} across ${invites.length} invitation${invites.length === 1 ? "" : "s"}.`,
      remindersScanned: invites.length,
      remindersSent,
      ownersNotified,
    });
  } catch (error) {
    console.error("Invite reminders cron error:", error);
    return NextResponse.json(
      { error: "Failed to process invite reminders." },
      { status: 500 },
    );
  }
}
