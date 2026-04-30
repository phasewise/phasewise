import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/supabase/auth";
import { renderInvoicePdf } from "@/lib/invoice-pdf";
import { PHASE_LABELS } from "@/lib/constants";

export const dynamic = "force-dynamic";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const currentUser = await getCurrentUser();
  if (!currentUser) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

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
      // Pull source time entries to compute the distinct phase labels
      // for the "Services include" sentence on the PDF.
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

  // Distinct phase labels covered by the invoice's time entries. Empty
  // list when invoice was hand-built without timesheet pull — the PDF
  // gracefully omits the "Services include" sentence in that case.
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
      clientName: invoice.project.clientName,
      clientEmail: invoice.project.clientEmail,
    },
    organization: { name: invoice.organization.name },
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
