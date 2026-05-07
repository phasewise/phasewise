import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { renderInvoicePdf } from "@/lib/invoice-pdf";
import { PHASE_LABELS } from "@/lib/constants";

export const dynamic = "force-dynamic";
// Same cold-start concern as /api/invoices/[id]/pdf.
export const maxDuration = 30;

// Public PDF endpoint — no auth, identified by the invoice's
// publicToken (cuid) in the URL. Used by clients clicking through
// from the email send. The token is the only credential, so don't
// log it and don't expose other invoices via response leakage.
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params;

  if (!token) {
    return NextResponse.json({ error: "Missing token." }, { status: 400 });
  }

  const invoice = await prisma.invoice.findUnique({
    where: { publicToken: token },
    include: {
      project: {
        select: {
          name: true,
          projectNumber: true,
          contractNumber: true,
          clientName: true,
          clientEmail: true,
          organizationId: true,
          client: { select: { contactPerson: true } },
        },
      },
      organization: {
        select: {
          name: true,
          billingMailingAddress: true,
          billingFedId: true,
          billingAchRouting: true,
          billingAchAccount: true,
          billingWireRouting: true,
          billingWireAccount: true,
          printPaymentDetailsOnInvoice: true,
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

  if (!invoice) {
    return NextResponse.json({ error: "Invoice not found." }, { status: 404 });
  }

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
      contractNumber: invoice.project.contractNumber,
      clientName: invoice.project.clientName,
      clientEmail: invoice.project.clientEmail,
      clientContactName: invoice.project.client?.contactPerson ?? null,
    },
    organization: {
      name: invoice.organization.name,
      billingMailingAddress: invoice.organization.billingMailingAddress,
      billingFedId: invoice.organization.billingFedId,
      billingAchRouting: invoice.organization.billingAchRouting,
      billingAchAccount: invoice.organization.billingAchAccount,
      billingWireRouting: invoice.organization.billingWireRouting,
      billingWireAccount: invoice.organization.billingWireAccount,
      printPaymentDetailsOnInvoice: invoice.organization.printPaymentDetailsOnInvoice,
    },
  });

  return new Response(new Uint8Array(pdfBuffer), {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="invoice-${invoice.invoiceNumber}.pdf"`,
      "Cache-Control": "no-store",
    },
  });
}
