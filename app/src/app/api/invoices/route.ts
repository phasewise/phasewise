import { NextRequest, NextResponse } from "next/server";
import { InvoiceStatus, Prisma } from "@prisma/client";
import { getCurrentUser } from "@/lib/supabase/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

/**
 * GET /api/invoices — list all invoices for the organization
 */
export async function GET() {
  const currentUser = await getCurrentUser();
  if (!currentUser) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  const invoices = await prisma.invoice.findMany({
    where: { organizationId: currentUser.organizationId },
    include: {
      project: { select: { name: true, projectNumber: true } },
      lineItems: true,
    },
    orderBy: { issueDate: "desc" },
    take: 500,
  });

  return NextResponse.json({ invoices });
}

/**
 * POST /api/invoices — create a new invoice
 */
export async function POST(request: NextRequest) {
  const currentUser = await getCurrentUser();
  if (!currentUser) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  if (currentUser.role !== "OWNER" && currentUser.role !== "ADMIN") {
    return NextResponse.json({ error: "Only owners and admins can create invoices." }, { status: 403 });
  }

  const body = await request.json();
  const {
    projectId,
    invoiceNumber,
    issueDate,
    dueDate,
    periodStart,
    periodEnd,
    notes,
    lineItems,
  } = body as {
    projectId: string;
    // Optional — if omitted, server auto-generates from the org's counter.
    invoiceNumber?: string;
    issueDate: string;
    dueDate: string;
    periodStart?: string;
    periodEnd?: string;
    notes?: string;
    lineItems: Array<{
      description: string;
      quantity: number;
      unitPrice: number;
      // When provided, these TimeEntry IDs get tagged with the new
      // invoice's id so they can't be billed again on a future invoice.
      sourceEntryIds?: string[];
    }>;
  };

  if (!projectId || !issueDate || !dueDate) {
    return NextResponse.json({ error: "projectId, issueDate, and dueDate are required." }, { status: 400 });
  }

  // Verify project belongs to org
  const project = await prisma.project.findUnique({
    where: { id: projectId },
    select: { organizationId: true },
  });
  if (!project || project.organizationId !== currentUser.organizationId) {
    return NextResponse.json({ error: "Project not found." }, { status: 404 });
  }

  const items = (lineItems ?? []).map((item) => ({
    description: item.description,
    quantity: new Prisma.Decimal(item.quantity),
    unitPrice: new Prisma.Decimal(item.unitPrice),
    amount: new Prisma.Decimal(item.quantity * item.unitPrice),
  }));

  // Collect all source entry IDs across line items. We mark them as
  // invoiced AFTER the invoice is created (need its id), but inside the
  // same transaction so partial failure is impossible.
  const sourceEntryIds = (lineItems ?? [])
    .flatMap((li) => li.sourceEntryIds ?? [])
    .filter(Boolean);

  const subtotal = items.reduce((sum, item) => sum + Number(item.amount), 0);

  const invoice = await prisma.$transaction(async (tx) => {
    // Resolve invoice number — auto-generate when client didn't pass one
    // OR matched the auto-suggested value, then increment the counter.
    // Mirrors the project-numbering pattern in /api/projects/route.ts.
    const org = await tx.organization.findUnique({
      where: { id: currentUser.organizationId },
      select: {
        autoNumberInvoices: true,
        invoiceNumberPrefix: true,
      },
    });

    let resolvedNumber = invoiceNumber || undefined;
    if (org?.autoNumberInvoices && !invoiceNumber) {
      const updated = await tx.organization.update({
        where: { id: currentUser.organizationId },
        data: { invoiceNumberNext: { increment: 1 } },
        select: { invoiceNumberNext: true, invoiceNumberPrefix: true },
      });
      const used = updated.invoiceNumberNext - 1;
      resolvedNumber = `${updated.invoiceNumberPrefix}-${String(used).padStart(3, "0")}`;
    } else if (org?.autoNumberInvoices && invoiceNumber) {
      // Client passed a value — only consume a counter slot if the value
      // matches what the counter would have produced. Preserves the
      // existing UX where the form pre-fills the auto-suggested number.
      const updated = await tx.organization.update({
        where: { id: currentUser.organizationId },
        data: { invoiceNumberNext: { increment: 1 } },
        select: { invoiceNumberNext: true, invoiceNumberPrefix: true },
      });
      const used = updated.invoiceNumberNext - 1;
      const expected = `${updated.invoiceNumberPrefix}-${String(used).padStart(3, "0")}`;
      if (invoiceNumber !== expected) {
        await tx.organization.update({
          where: { id: currentUser.organizationId },
          data: { invoiceNumberNext: { decrement: 1 } },
        });
      }
    }

    if (!resolvedNumber) {
      throw new Error("Invoice number is required.");
    }

    const created = await tx.invoice.create({
      data: {
        organizationId: currentUser.organizationId,
        projectId,
        invoiceNumber: resolvedNumber,
        issueDate: new Date(issueDate),
        dueDate: new Date(dueDate),
        periodStart: periodStart ? new Date(periodStart) : null,
        periodEnd: periodEnd ? new Date(periodEnd) : null,
        subtotal: new Prisma.Decimal(subtotal),
        total: new Prisma.Decimal(subtotal),
        notes: notes || null,
        lineItems: {
          create: items,
        },
      },
      include: {
        project: { select: { name: true, projectNumber: true } },
        lineItems: true,
      },
    });

    // Tag the source time entries so they can't be re-invoiced. Restrict
    // to the org + currently-uninvoiced state to avoid stomping on entries
    // that another concurrent invoice grabbed first.
    if (sourceEntryIds.length > 0) {
      await tx.timeEntry.updateMany({
        where: {
          id: { in: sourceEntryIds },
          organizationId: currentUser.organizationId,
          invoiceId: null,
        },
        data: {
          invoiceId: created.id,
          invoicedAt: new Date(),
        },
      });
    }

    return created;
  });

  return NextResponse.json({ invoice }, { status: 201 });
}

/**
 * PATCH /api/invoices — update invoice status or payment info
 */
export async function PATCH(request: NextRequest) {
  const currentUser = await getCurrentUser();
  if (!currentUser) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  if (currentUser.role !== "OWNER" && currentUser.role !== "ADMIN") {
    return NextResponse.json({ error: "Only owners and admins can update invoices." }, { status: 403 });
  }

  const body = await request.json();
  const {
    id,
    status,
    paidAmount,
    paidDate,
    paymentReference,
    paymentMethod,
    sentAt,
    periodStart,
    periodEnd,
    notes,
  } = body as {
    id: string;
    status?: string;
    paidAmount?: number;
    paidDate?: string | null;
    paymentReference?: string | null;
    paymentMethod?: string | null;
    sentAt?: string | null;
    periodStart?: string | null;
    periodEnd?: string | null;
    notes?: string | null;
  };

  if (!id) {
    return NextResponse.json({ error: "id is required." }, { status: 400 });
  }

  const existing = await prisma.invoice.findUnique({
    where: { id },
    select: { organizationId: true, total: true },
  });
  if (!existing || existing.organizationId !== currentUser.organizationId) {
    return NextResponse.json({ error: "Invoice not found." }, { status: 404 });
  }

  const data: Record<string, unknown> = {};
  if (status !== undefined) data.status = status as InvoiceStatus;
  if (paidAmount !== undefined) {
    data.paidAmount = new Prisma.Decimal(paidAmount);
    // Auto-promote status when payment is recorded so the user doesn't
    // have to set it twice. PARTIALLY_PAID < total ; PAID >= total.
    if (status === undefined) {
      const total = Number(existing.total);
      if (paidAmount >= total) data.status = "PAID" as InvoiceStatus;
      else if (paidAmount > 0) data.status = "PARTIALLY_PAID" as InvoiceStatus;
    }
  }
  if (paidDate !== undefined) data.paidDate = paidDate ? new Date(paidDate) : null;
  if (paymentReference !== undefined) data.paymentReference = paymentReference || null;
  if (paymentMethod !== undefined) data.paymentMethod = paymentMethod || null;
  if (sentAt !== undefined) data.sentAt = sentAt ? new Date(sentAt) : null;
  if (periodStart !== undefined) data.periodStart = periodStart ? new Date(periodStart) : null;
  if (periodEnd !== undefined) data.periodEnd = periodEnd ? new Date(periodEnd) : null;
  if (notes !== undefined) data.notes = notes;

  const updated = await prisma.invoice.update({
    where: { id },
    data,
    include: {
      project: { select: { name: true, projectNumber: true } },
      lineItems: true,
    },
  });

  return NextResponse.json({ invoice: updated });
}

/**
 * DELETE /api/invoices?id=xxx
 *
 * Permanently removes an invoice and its line items. Source TimeEntries
 * that were tagged to this invoice get untagged so they can be billed
 * on a future invoice — otherwise deleting an invoice would silently
 * lock those hours away.
 *
 * Permissions: OWNER and ADMIN only. PMs intentionally can't delete
 * invoices because PAID ones are a real accounting action.
 */
export async function DELETE(request: NextRequest) {
  const currentUser = await getCurrentUser();
  if (!currentUser) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  if (currentUser.role !== "OWNER" && currentUser.role !== "ADMIN") {
    return NextResponse.json(
      { error: "Only owners and admins can delete invoices." },
      { status: 403 }
    );
  }

  const url = new URL(request.url);
  const id = url.searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "id is required." }, { status: 400 });
  }

  const existing = await prisma.invoice.findUnique({
    where: { id },
    select: { organizationId: true, status: true },
  });
  if (!existing || existing.organizationId !== currentUser.organizationId) {
    return NextResponse.json({ error: "Invoice not found." }, { status: 404 });
  }

  // Un-tag all source TimeEntries first so they're available for future
  // invoices. Then delete the invoice (cascades line items via Prisma
  // schema). Both inside a transaction so a partial failure can't
  // orphan tagged entries.
  await prisma.$transaction(async (tx) => {
    await tx.timeEntry.updateMany({
      where: { invoiceId: id },
      data: { invoiceId: null, invoicedAt: null },
    });
    await tx.invoice.delete({ where: { id } });
  });

  return NextResponse.json({ success: true });
}
