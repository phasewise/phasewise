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
  const { projectId, invoiceNumber, issueDate, dueDate, notes, lineItems } = body as {
    projectId: string;
    invoiceNumber: string;
    issueDate: string;
    dueDate: string;
    notes?: string;
    lineItems: Array<{
      description: string;
      quantity: number;
      unitPrice: number;
    }>;
  };

  if (!projectId || !invoiceNumber || !issueDate || !dueDate) {
    return NextResponse.json({ error: "projectId, invoiceNumber, issueDate, and dueDate are required." }, { status: 400 });
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

  const subtotal = items.reduce((sum, item) => sum + Number(item.amount), 0);

  const invoice = await prisma.invoice.create({
    data: {
      organizationId: currentUser.organizationId,
      projectId,
      invoiceNumber,
      issueDate: new Date(issueDate),
      dueDate: new Date(dueDate),
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
  const { id, status, paidAmount, paidDate, notes } = body as {
    id: string;
    status?: string;
    paidAmount?: number;
    paidDate?: string | null;
    notes?: string | null;
  };

  if (!id) {
    return NextResponse.json({ error: "id is required." }, { status: 400 });
  }

  const existing = await prisma.invoice.findUnique({
    where: { id },
    select: { organizationId: true },
  });
  if (!existing || existing.organizationId !== currentUser.organizationId) {
    return NextResponse.json({ error: "Invoice not found." }, { status: 404 });
  }

  const data: Record<string, unknown> = {};
  if (status !== undefined) data.status = status as InvoiceStatus;
  if (paidAmount !== undefined) data.paidAmount = new Prisma.Decimal(paidAmount);
  if (paidDate !== undefined) data.paidDate = paidDate ? new Date(paidDate) : null;
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
