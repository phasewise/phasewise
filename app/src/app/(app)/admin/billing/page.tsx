import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/supabase/auth";
import { prisma } from "@/lib/prisma";
import AdminBillingClient from "./AdminBillingClient";

export default async function AdminBillingPage() {
  const currentUser = await getCurrentUser();

  if (!currentUser) redirect("/login");
  if (currentUser.role !== "OWNER" && currentUser.role !== "ADMIN") redirect("/dashboard");

  const [invoices, projects] = await Promise.all([
    prisma.invoice.findMany({
      where: { organizationId: currentUser.organizationId },
      include: {
        project: { select: { name: true, projectNumber: true, clientEmail: true } },
        lineItems: true,
      },
      orderBy: { issueDate: "desc" },
    }),
    prisma.project.findMany({
      where: { organizationId: currentUser.organizationId, status: { not: "ARCHIVED" } },
      select: { id: true, name: true, projectNumber: true },
      orderBy: { name: "asc" },
    }),
  ]);

  // Auto-invoicing surface — surfaces what the monthly cron has done so
  // operators can see "X drafts ready" rather than having to know the
  // job runs invisibly. Cron fires on the 5th of every month against
  // the prior calendar month.
  // Server-format the date as a string to avoid timezone shifting on
  // the client. `new Date(year, month, day)` creates a Date in the
  // server's local TZ (UTC on Vercel), which when sent over the wire
  // and re-parsed in Pacific renders as the previous day.
  const today = new Date();
  const day = today.getDate();
  const nextRunYear =
    day < 5 ? today.getFullYear() : today.getMonth() === 11 ? today.getFullYear() + 1 : today.getFullYear();
  const nextRunMonthIdx =
    day < 5 ? today.getMonth() : (today.getMonth() + 1) % 12;
  const nextRunLabel = new Date(nextRunYear, nextRunMonthIdx, 5).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
  // Drafts created from the most recent run — anything currently DRAFT
  // is awaiting operator review either way.
  const draftCount = invoices.filter((inv) => inv.status === "DRAFT").length;
  const autoInvoicing = {
    nextRunLabel,
    draftCount,
  };

  const serialized = invoices.map((inv) => ({
    id: inv.id,
    invoiceNumber: inv.invoiceNumber,
    status: inv.status,
    issueDate: inv.issueDate.toISOString(),
    dueDate: inv.dueDate.toISOString(),
    periodStart: inv.periodStart?.toISOString() ?? null,
    periodEnd: inv.periodEnd?.toISOString() ?? null,
    subtotal: Number(inv.subtotal),
    tax: Number(inv.tax),
    total: Number(inv.total),
    paidAmount: Number(inv.paidAmount),
    paidDate: inv.paidDate?.toISOString() ?? null,
    paymentReference: inv.paymentReference,
    paymentMethod: inv.paymentMethod,
    sentAt: inv.sentAt?.toISOString() ?? null,
    notes: inv.notes,
    projectName: inv.project.name,
    projectNumber: inv.project.projectNumber,
    projectId: inv.projectId,
    clientEmail: inv.project.clientEmail,
    lineItems: inv.lineItems.map((li) => ({
      id: li.id,
      description: li.description,
      quantity: Number(li.quantity),
      unitPrice: Number(li.unitPrice),
      amount: Number(li.amount),
    })),
  }));

  return (
    <div className="p-6 lg:p-10 max-w-7xl">
      <AdminBillingClient invoices={serialized} projects={projects} autoInvoicing={autoInvoicing} />
    </div>
  );
}
