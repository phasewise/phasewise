import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/supabase/auth";

export const dynamic = "force-dynamic";

/**
 * GET /api/invoices/next-number
 *
 * Returns the next auto-generated invoice number (e.g. INV-001) for the
 * current user's organization. Used by the new-invoice form to pre-fill
 * the input. The counter is NOT consumed here — it only increments on
 * actual create inside the POST /api/invoices transaction.
 */
export async function GET() {
  const currentUser = await getCurrentUser();
  if (!currentUser) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  const org = await prisma.organization.findUnique({
    where: { id: currentUser.organizationId },
    select: {
      autoNumberInvoices: true,
      invoiceNumberPrefix: true,
      invoiceNumberNext: true,
    },
  });

  if (!org || !org.autoNumberInvoices) {
    return NextResponse.json({ nextNumber: null });
  }

  const nextNumber = `${org.invoiceNumberPrefix}-${String(org.invoiceNumberNext).padStart(3, "0")}`;
  return NextResponse.json({ nextNumber });
}
