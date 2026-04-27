import { NextResponse } from "next/server";
import { upsertContact } from "@/lib/loops";
import { rateLimit, clientIp } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";

// Simple email regex — we don't try to be exhaustive here, just catch
// obviously malformed input. Real validation happens at delivery time.
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  try {
    const ip = clientIp(request);
    const { allowed } = rateLimit(`waitlist:${ip}`, 5, 60);
    if (!allowed) {
      return NextResponse.json(
        { error: "Too many requests. Please try again in a minute." },
        { status: 429 }
      );
    }

    const body = await request.json().catch(() => ({}));
    const { email, firstName, firmName } = body as {
      email?: string;
      firstName?: string;
      firmName?: string;
    };

    if (!email || typeof email !== "string" || !EMAIL_REGEX.test(email)) {
      return NextResponse.json(
        { error: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    const result = await upsertContact({
      email: email.trim().toLowerCase(),
      firstName: typeof firstName === "string" && firstName.trim() ? firstName.trim() : undefined,
      // We map firmName to userGroup so it's queryable in Loops without
      // needing a custom contact property.
      userGroup: typeof firmName === "string" && firmName.trim() ? firmName.trim() : "waitlist",
      source: "Phasewise landing page",
    });

    if (!result.success) {
      console.error("[waitlist] upsertContact failed:", result.error);
      // Don't leak Loops errors to the user. We've captured the email
      // intent in logs and can backfill manually if needed.
      return NextResponse.json(
        { error: "Could not save your spot. Please try again in a moment." },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Waitlist signup error:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
