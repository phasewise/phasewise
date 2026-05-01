import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/supabase/auth";
import { renderInvoicePdf } from "@/lib/invoice-pdf";
import { sendTransactional, LOOPS_TEMPLATES } from "@/lib/loops";
import { PHASE_LABELS } from "@/lib/constants";

export const dynamic = "force-dynamic";

/**
 * POST /api/invoices/[id]/send
 *
 * Email the invoice PDF to the project's client via Loops, then mark
 * the invoice as SENT (with sentAt timestamp). The recipient address
 * comes from project.clientEmail; a custom override can be passed in
 * the body to send to a different address (e.g. a billing contact).
 *
 * Permissions: OWNER and ADMIN only — sending an invoice is a real
 * external communication, not a routine read.
 *
 * Body (all optional):
 *   - toEmail:    override recipient (defaults to project.clientEmail)
 *   - toName:     override greeting name (defaults to project.clientName)
 *   - bodyMessage: optional custom note to include in the email
 *
 * Returns: { success: true, sentAt }
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
      organization: { select: { name: true } },
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

  // Distinct phase labels for both the PDF "Services include..." line
  // and the email body's "phases" variable.
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

  // Render the PDF the same way the inline /pdf route does.
  const pdfBuffer = await renderInvoicePdf({
    invoiceNumber: invoice.invoiceNumber,
    status: invoice.status,
    issueDate: invoice.issueDate,
    dueDate: invoice.dueDate,
    periodStart: invoice.periodStart,
    periodEnd: invoice.periodEnd,
    phaseLabels,
    subtotal: Number(invoice.subtotal),
    tax: Number(invoice.tax),
    total: Number(invoice.total),
    paidAmount: Number(invoice.paidAmount),
    notes: invoice.notes,
    lineItems: invoice.lineItems.map((li) => ({
      description: li.description,
      quantity: Number(li.quantity),
      unitPrice: Number(li.unitPrice),
      amount: Number(li.amount),
    })),
    project: {
      name: invoice.project.name,
      projectNumber: invoice.project.projectNumber,
      clientName: invoice.project.clientName,
      clientEmail: invoice.project.clientEmail,
    },
    organization: { name: invoice.organization.name },
  });

  const slug = invoice.invoiceNumber.replace(/[^A-Za-z0-9-]/g, "_");
  const filename = `invoice-${slug}.pdf`;

  // Format dates + total for the email body. Loops dataVariables only
  // accept strings + numbers, so we pre-format here.
  const fmtDate = (d: Date) =>
    d.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  const fmtMoney = (n: number) =>
    `$${Number(n).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  const sendResult = await sendTransactional({
    email: recipient,
    transactionalId: LOOPS_TEMPLATES.INVOICE_SEND,
    dataVariables: {
      firmName: invoice.organization.name,
      clientName: overrideToName || invoice.project.clientName || "there",
      invoiceNumber: invoice.invoiceNumber,
      projectName: invoice.project.name,
      projectNumber: invoice.project.projectNumber || "",
      total: fmtMoney(Number(invoice.total)),
      issueDate: fmtDate(invoice.issueDate),
      dueDate: fmtDate(invoice.dueDate),
      periodStart: invoice.periodStart ? fmtDate(invoice.periodStart) : "",
      periodEnd: invoice.periodEnd ? fmtDate(invoice.periodEnd) : "",
      phases: phaseLabels.join(", "),
      customMessage: customMessage || "",
    },
    attachments: [
      {
        filename,
        contentType: "application/pdf",
        data: pdfBuffer.toString("base64"),
      },
    ],
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
  });
}
