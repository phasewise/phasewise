import { NextResponse } from "next/server";
import * as Sentry from "@sentry/nextjs";
import { LOOPS_TEMPLATES, sendTransactional, upsertContact } from "@/lib/loops";

export const dynamic = "force-dynamic";

// Lightweight per-IP rate limit (mirrors the pattern at /api/waitlist)
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000; // 1 hour
const RATE_LIMIT_MAX = 5; // 5 submissions per IP per hour
const ipHits = new Map<string, { count: number; resetAt: number }>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = ipHits.get(ip);
  if (!entry || entry.resetAt < now) {
    ipHits.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }
  entry.count += 1;
  if (entry.count > RATE_LIMIT_MAX) return true;
  return false;
}

type Payload = {
  firmName?: unknown;
  contactName?: unknown;
  email?: unknown;
  currentTool?: unknown;
  projectCount?: unknown;
  staffCount?: unknown;
  clientCount?: unknown;
  formatNotes?: unknown;
};

function isString(v: unknown): v is string {
  return typeof v === "string";
}

export async function POST(request: Request) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown";

  if (isRateLimited(ip)) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  let body: Payload;
  try {
    body = (await request.json()) as Payload;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const firmName = isString(body.firmName) ? body.firmName.trim() : "";
  const email = isString(body.email) ? body.email.trim().toLowerCase() : "";

  if (!firmName || !email) {
    return NextResponse.json({ error: "firmName and email are required" }, { status: 400 });
  }

  // Crude email shape check — server still accepts mail-only delivery if Loops bounces
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "email is not a valid address" }, { status: 400 });
  }

  const contactName = isString(body.contactName) ? body.contactName.trim() : "";
  const currentTool = isString(body.currentTool) ? body.currentTool.trim() : "";
  const projectCount = isString(body.projectCount) ? body.projectCount.trim() : "";
  const staffCount = isString(body.staffCount) ? body.staffCount.trim() : "";
  const clientCount = isString(body.clientCount) ? body.clientCount.trim() : "";
  const formatNotes = isString(body.formatNotes) ? body.formatNotes.trim().slice(0, 5000) : "";

  // 1) Capture as a Loops contact so the request shows up in our audience
  //    with all fields as custom properties — usable regardless of whether
  //    the MIGRATION_REQUEST transactional template is configured.
  await upsertContact({
    email,
    firstName: contactName.split(/\s+/)[0] || undefined,
    lastName: contactName.split(/\s+/).slice(1).join(" ") || undefined,
    source: "migration-request",
    userGroup: "founding-member-candidate",
  });

  // 2) Notify the team via Loops transactional (gracefully no-op if the
  //    template ID isn't set yet — the form still succeeds because the
  //    Loops contact above captures everything).
  const NOTIFY_TO = process.env.MIGRATION_NOTIFY_EMAIL || "hello@phasewise.io";
  if (LOOPS_TEMPLATES.MIGRATION_REQUEST) {
    await sendTransactional({
      email: NOTIFY_TO,
      transactionalId: LOOPS_TEMPLATES.MIGRATION_REQUEST,
      dataVariables: {
        firmName,
        contactName: contactName || "(not provided)",
        contactEmail: email,
        currentTool: currentTool || "(not provided)",
        projectCount: projectCount || "(not provided)",
        staffCount: staffCount || "(not provided)",
        clientCount: clientCount || "(not provided)",
        formatNotes: formatNotes || "(none)",
      },
    });
  }

  // 3) High-visibility Sentry breadcrumb + message so Kevin gets a
  //    realtime alert in case the Loops email path is misconfigured.
  Sentry.captureMessage("Migration request submitted", {
    level: "info",
    tags: { source: "migration-request" },
    extra: { firmName, email, contactName, currentTool, projectCount, staffCount, clientCount, formatNotes },
  });

  return NextResponse.json({ ok: true });
}
