import { randomBytes } from "node:crypto";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/supabase/auth";
import { sendTransactional, LOOPS_TEMPLATES } from "@/lib/loops";
import { PHASE_LABELS } from "@/lib/constants";
import { createPaymentLinkForInvoice } from "@/lib/stripe-payment-link";

export const dynamic = "force-dynamic";

/**
 * POST /api/invoices/[id]/send
 *
 * Email a public viewer link to the project's client via Loops, then
 * mark the invoice as SENT. The link points to /invoice/{publicToken}
 * which renders a hosted invoice page with a "Download PDF" button.
 *
 * Why a link instead of a PDF attachment: Loops free tier rejects
 * attachments, attachments tend to hit spam filters, and a link lets
 * us track viewedAt + later wire up Stripe Payment Links so clients
 * can pay from the same page.
 *
 * Permissions: OWNER and ADMIN only — sending is real external comms.
 *
 * Body (all optional):
 *   - toEmail:    override recipient (defaults to project.clientEmail)
 *   - toName:     override greeting name (defaults to project.clientName)
 *   - bodyMessage: optional custom note to include in the email
 *
 * Returns: { success: true, sentAt, status, recipient, invoiceUrl }
 */
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const currentUser = await getCurrentUser();
  if (!currentUser) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  if (currentUser.role !== "OWNER" && currentUser.role !== "ADMIN") {
    return NextResponse.json(
      { error: "Only owners and admins can send invoices." },
      { status: 403 }
    );
  }

  if (!LOOPS_TEMPLATES.INVOICE_SEND) {
    return NextResponse.json(
      {
        error:
          "Invoice email template is not configured. Set LOOPS_TEMPLATE_INVOICE_SEND in your environment after creating the template in Loops.",
      },
      { status: 500 }
    );
  }

  const body = await request.json().catch(() => ({}));
  const overrideTo = (body.toEmail as string | undefined)?.trim();
  const overrideToName = (body.toName as string | undefined)?.trim();
  const customMessage = (body.bodyMessage as string | undefined)?.trim();

  const invoice = await prisma.invoice.findUnique({
    where: { id },
    include: {
      project: {
        select: {
          name: true,
          projectNumber: true,
          clientName: true,
          clientEmail: true,
          organizationId: true,
        },
      },
      organization: {
        select: {
          name: true,
          stripeConnectedAccountId: true,
          stripeConnectChargesEnabled: true,
        },
      },
      lineItems: true,
      timeEntries: {
        include: {
          phase: { select: { phaseType: true, customName: true } },
        },
      },
    },
  });

  if (!invoice || invoice.project.organizationId !== currentUser.organizationId) {
    return NextResponse.json({ error: "Invoice not found." }, { status: 404 });
  }

  const recipient = overrideTo || invoice.project.clientEmail;
  if (!recipient) {
    return NextResponse.json(
      {
        error:
          "No client email on file. Set the client email on the project, or pass toEmail in the request.",
      },
      { status: 400 }
    );
  }

  // Distinct phase labels for the email body's "phases" variable.
  const phaseLabels = Array.from(
    new Set(
      invoice.timeEntries
        .map((e) =>
          e.phase
            ? e.phase.customName ||
              PHASE_LABELS[e.phase.phaseType as keyof typeof PHASE_LABELS] ||
              e.phase.phaseType
            : null
        )
        .filter((label): label is string => Boolean(label))
    )
  );

  // Lazy-fill the public token if this invoice was created before the
  // public-link migration. Existing invoices have null tokens; first
  // send generates one.
  let publicToken = invoice.publicToken;
  if (!publicToken) {
    publicToken = randomBytes(16).toString("hex");
    await prisma.invoice.update({
      where: { id: invoice.id },
      data: { publicToken },
    });
  }

  const baseUrl = (process.env.NEXT_PUBLIC_APP_URL || "https://phasewise.io").replace(/\/$/, "");
  const invoiceUrl = `${baseUrl}/invoice/${publicToken}`;

  // Lazy-create a Stripe Payment Link if the firm has Connect onboarded
  // and this invoice doesn't have one yet. The link goes on the public
  // viewer + into the email so the client can pay with one click.
  // Skipped silently if Connect isn't ready, charges aren't enabled,
  // or the invoice is already paid/voided — the email still works,
  // it just won't include a Pay-now button.
  let payNowUrl = invoice.stripePaymentLinkUrl ?? "";
  const balanceDueCents = Math.round(
    (Number(invoice.total) - Number(invoice.paidAmount)) * 100
  );
  const canCreatePayLink =
    !payNowUrl &&
    invoice.organization.stripeConnectedAccountId &&
    invoice.organization.stripeConnectChargesEnabled &&
    invoice.status !== "PAID" &&
    invoice.status !== "VOID" &&
    balanceDueCents > 0;

  if (canCreatePayLink) {
    try {
      const link = await createPaymentLinkForInvoice({
        invoiceId: invoice.id,
        invoiceNumber: invoice.invoiceNumber,
        projectName: invoice.project.name,
        amountDueCents: balanceDueCents,
        connectedAccountId: invoice.organization.stripeConnectedAccountId!,
        publicToken,
      });
      await prisma.invoice.update({
        where: { id: invoice.id },
        data: {
          stripePaymentLinkId: link.id,
          stripePaymentLinkUrl: link.url,
        },
      });
      payNowUrl = link.url;
    } catch (err) {
      // Non-fatal — log and continue without a Pay-now button. The
      // email still goes out; the client can still pay via the
      // remit-to block printed on the invoice.
      console.warn("Stripe Payment Link create failed (continuing send):", err);
    }
  }

  // Format dates + total for the email body. Loops dataVariables only
  // accept strings + numbers, so we pre-format here.
  const fmtDate = (d: Date) =>
    d.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  const fmtMoney = (n: number) =>
    `$${Number(n).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  // Loops treats empty-string merge variables as "missing" and rejects
  // the send with a 400. For variables that may legitimately be empty
  // (projectNumber, customMessage, periodStart/End), substitute a
  // single space so Loops sees a value but the email body renders
  // effectively blank.
  const blankSafe = (v: string | null | undefined) => (v && v.trim().length > 0 ? v : " ");

  const sendResult = await sendTransactional({
    email: recipient,
    transactionalId: LOOPS_TEMPLATES.INVOICE_SEND,
    dataVariables: {
      firmName: invoice.organization.name,
      clientName: overrideToName || invoice.project.clientName || "there",
      invoiceNumber: invoice.invoiceNumber,
      projectName: invoice.project.name,
      projectNumber: blankSafe(invoice.project.projectNumber),
      total: fmtMoney(Number(invoice.total)),
      issueDate: fmtDate(invoice.issueDate),
      dueDate: fmtDate(invoice.dueDate),
      periodStart: blankSafe(invoice.periodStart ? fmtDate(invoice.periodStart) : null),
      periodEnd: blankSafe(invoice.periodEnd ? fmtDate(invoice.periodEnd) : null),
      phases: blankSafe(phaseLabels.join(", ")),
      customMessage: blankSafe(customMessage),
      invoiceUrl,
      payNowUrl: blankSafe(payNowUrl),
    },
  });

  if (!sendResult.success) {
    return NextResponse.json(
      { error: `Failed to send invoice email: ${sendResult.error || "unknown"}` },
      { status: 502 }
    );
  }

  // On successful send, flip the invoice to SENT and record sentAt.
  // We don't overwrite a later status (PAID, etc.) — only DRAFT/SENT
  // get bumped, since re-sending an already-paid invoice is a real
  // workflow (e.g. customer asks for another copy).
  const newStatus =
    invoice.status === "DRAFT" || invoice.status === "SENT" ? "SENT" : invoice.status;

  const updated = await prisma.invoice.update({
    where: { id },
    data: {
      status: newStatus,
      sentAt: new Date(),
    },
    select: { sentAt: true, status: true },
  });

  return NextResponse.json({
    success: true,
    sentAt: updated.sentAt?.toISOString() ?? null,
    status: updated.status,
    recipient,
    invoiceUrl,
    payNowUrl: payNowUrl || null,
  });
}
