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
        project: { select: { name: true, projectNumber: true } },
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

  const serialized = invoices.map((inv) => ({
    id: inv.id,
    invoiceNumber: inv.invoiceNumber,
    status: inv.status,
    issueDate: inv.issueDate.toISOString(),
    dueDate: inv.dueDate.toISOString(),
    subtotal: Number(inv.subtotal),
    tax: Number(inv.tax),
    total: Number(inv.total),
    paidAmount: Number(inv.paidAmount),
    paidDate: inv.paidDate?.toISOString() ?? null,
    notes: inv.notes,
    projectName: inv.project.name,
    projectNumber: inv.project.projectNumber,
    projectId: inv.projectId,
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
      <AdminBillingClient invoices={serialized} projects={projects} />
    </div>
  );
}
