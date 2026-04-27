import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/supabase/auth";
import { sendTransactional, LOOPS_TEMPLATES } from "@/lib/loops";

export const dynamic = "force-dynamic";

/**
 * POST /api/user/password-changed
 *
 * Fire-and-forget notification that the current user just changed their
 * password. We send a confirmation email so an unauthorized password change
 * (e.g., via a stolen reset link) is visible to the legitimate account owner
 * — they can react before the attacker locks them out.
 *
 * Requires LOOPS_TEMPLATE_PASSWORD_CHANGED env var. Without it we log and
 * skip rather than send via the wrong template.
 */
export async function POST(request: Request) {
  const currentUser = await getCurrentUser();
  if (!currentUser) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  if (!LOOPS_TEMPLATES.PASSWORD_CHANGED) {
    console.warn(
      "[password-changed] LOOPS_TEMPLATE_PASSWORD_CHANGED not set — skipping confirmation email"
    );
    return NextResponse.json({ success: true, emailSent: false });
  }

  // X-Forwarded-For has the chain (client, proxy1, proxy2, …); take the first.
  const xff = request.headers.get("x-forwarded-for");
  const ip = xff?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "unknown";
  const userAgent = request.headers.get("user-agent") || "unknown";
  const firstName = currentUser.fullName.split(/\s+/)[0] || "there";
  const when = new Date().toLocaleString("en-US", {
    dateStyle: "long",
    timeStyle: "short",
  });

  await sendTransactional({
    email: currentUser.email,
    transactionalId: LOOPS_TEMPLATES.PASSWORD_CHANGED,
    dataVariables: {
      recipientName: firstName,
      changedAt: when,
      ipAddress: ip,
      userAgent: userAgent.slice(0, 200),
    },
  });

  return NextResponse.json({ success: true, emailSent: true });
}
