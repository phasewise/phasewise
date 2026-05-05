import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

// Public client-facing invoice page. Reachable via a unique cuid token
// that gets emailed to the client. No authentication — the token IS
// the credential, like a Stripe hosted invoice page.

function formatDate(d: Date | null): string {
  if (!d) return "—";
  return d.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function formatMoney(n: number): string {
  return n.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  });
}

export default async function PublicInvoicePage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;

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
          city: true,
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
        },
      },
      lineItems: true,
    },
  });

  if (!invoice) {
    notFound();
  }

  // Stamp the first time the client opens the link. Lets the firm see
  // "client viewed at HH:MM" on /admin/billing later. Awaited so the
  // write actually completes before the response streams (fire-and-
  // forget promises don't reliably persist in Next.js server
  // components — they get cancelled when the response closes).
  // Catches errors so a write hiccup doesn't break the render.
  if (!invoice.viewedAt) {
    try {
      await prisma.invoice.update({
        where: { id: invoice.id },
        data: { viewedAt: new Date() },
      });
    } catch {
      // Swallow — the user need is to see the invoice, not to log views.
    }
  }

  const subtotal = Number(invoice.subtotal);
  const tax = Number(invoice.tax);
  const total = Number(invoice.total);
  const paidAmount = Number(invoice.paidAmount);
  const balanceDue = total - paidAmount;

  const isPaid = invoice.status === "PAID" || balanceDue <= 0;

  const org = invoice.organization;
  const hasRemit =
    !!org.billingMailingAddress ||
    !!org.billingAchRouting ||
    !!org.billingAchAccount ||
    !!org.billingWireRouting ||
    !!org.billingWireAccount ||
    !!org.billingFedId;

  return (
    <div className="min-h-screen bg-[#F7F9F7] py-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Brand strip — light, doesn't compete with the firm's name */}
        <div className="text-center mb-6">
          <p className="text-xs uppercase tracking-[0.18em] text-[#6B8C74]">
            Powered by Phasewise
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-[#E2EBE4] p-8 sm:p-12">
          {/* Header */}
          <div className="flex items-start justify-between gap-6 mb-10 pb-6 border-b border-[#E8EDE9]">
            <div>
              <h1 className="font-serif text-3xl text-[#1A2E22] mb-1">
                {invoice.organization.name}
              </h1>
              <p className="text-xs uppercase tracking-[0.18em] text-[#6B8C74]">
                Invoice
              </p>
            </div>
            <div className="text-right">
              <p className="font-mono text-2xl text-[#1A2E22] font-semibold">
                #{invoice.invoiceNumber}
              </p>
              {isPaid ? (
                <span className="inline-block mt-2 px-3 py-1 rounded-full bg-[#F0FAF4] text-[#2D6A4F] border border-[#52B788]/30 text-xs font-semibold uppercase tracking-wide">
                  Paid
                </span>
              ) : invoice.status === "VOID" ? (
                <span className="inline-block mt-2 px-3 py-1 rounded-full bg-[#F7F9F7] text-[#A3BEA9] border border-[#E2EBE4] text-xs font-semibold uppercase tracking-wide">
                  Voided
                </span>
              ) : (
                <span className="inline-block mt-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-xs font-semibold uppercase tracking-wide">
                  {invoice.status}
                </span>
              )}
            </div>
          </div>

          {/* Meta grid */}
          <div className="grid sm:grid-cols-3 gap-6 mb-10">
            <div>
              <p className="text-xs uppercase tracking-[0.12em] text-[#6B8C74] mb-1">
                Bill To
              </p>
              <p className="text-sm text-[#1A2E22] font-medium">
                {invoice.project.clientName ?? "—"}
              </p>
              {invoice.project.client?.contactPerson && (
                <p className="text-xs text-[#6B8C74] mt-0.5">
                  Attn: {invoice.project.client.contactPerson}
                </p>
              )}
              {invoice.project.clientEmail && (
                <p className="text-xs text-[#6B8C74] mt-0.5">
                  {invoice.project.clientEmail}
                </p>
              )}
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.12em] text-[#6B8C74] mb-1">
                Project
              </p>
              <p className="text-sm text-[#1A2E22] font-medium">
                {invoice.project.name}
              </p>
              {invoice.project.projectNumber && (
                <p className="text-xs text-[#6B8C74] mt-0.5 font-mono">
                  {invoice.project.projectNumber}
                </p>
              )}
              {invoice.project.contractNumber && (
                <p className="text-xs text-[#6B8C74] mt-1">
                  Agreement No.{" "}
                  <span className="font-mono text-[#1A2E22]">
                    {invoice.project.contractNumber}
                  </span>
                </p>
              )}
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.12em] text-[#6B8C74] mb-1">
                Issue Date
              </p>
              <p className="text-sm text-[#1A2E22] font-medium">
                {formatDate(invoice.issueDate)}
              </p>
              <p className="text-xs uppercase tracking-[0.12em] text-[#6B8C74] mt-3 mb-1">
                Due Date
              </p>
              <p className="text-sm text-[#1A2E22] font-medium">
                {formatDate(invoice.dueDate)}
              </p>
            </div>
          </div>

          {/* Remit-to block — surfaces how clients can pay without
              having to email and ask. Only renders when the firm has
              configured at least one method in /settings/billing-info. */}
          {hasRemit && (
            <div className="mb-8 rounded-lg bg-[#F7F9F7] border border-[#E8EDE9] px-5 py-4">
              <p className="text-xs uppercase tracking-[0.18em] text-[#6B8C74] mb-3">
                Please remit payment via
              </p>
              <div className="grid sm:grid-cols-3 gap-4 text-sm">
                {org.billingMailingAddress && (
                  <div>
                    <p className="text-xs text-[#6B8C74] mb-1">Mail</p>
                    <p className="text-[#1A2E22] whitespace-pre-line">{org.billingMailingAddress}</p>
                  </div>
                )}
                {(org.billingAchRouting || org.billingAchAccount) && (
                  <div>
                    <p className="text-xs text-[#6B8C74] mb-1">ACH</p>
                    {org.billingAchRouting && (
                      <p className="text-[#1A2E22] font-mono text-xs">
                        Routing: {org.billingAchRouting}
                      </p>
                    )}
                    {org.billingAchAccount && (
                      <p className="text-[#1A2E22] font-mono text-xs">
                        A/C: {org.billingAchAccount}
                      </p>
                    )}
                  </div>
                )}
                {(org.billingWireRouting || org.billingWireAccount) && (
                  <div>
                    <p className="text-xs text-[#6B8C74] mb-1">Wire</p>
                    {org.billingWireRouting && (
                      <p className="text-[#1A2E22] font-mono text-xs">
                        Routing: {org.billingWireRouting}
                      </p>
                    )}
                    {org.billingWireAccount && (
                      <p className="text-[#1A2E22] font-mono text-xs">
                        A/C: {org.billingWireAccount}
                      </p>
                    )}
                  </div>
                )}
              </div>
              {org.billingFedId && (
                <p className="mt-3 pt-3 border-t border-[#E8EDE9] text-xs text-[#6B8C74]">
                  <span className="uppercase tracking-[0.12em]">Fed ID</span>{" "}
                  <span className="font-mono text-[#1A2E22] ml-1">{org.billingFedId}</span>
                </p>
              )}
            </div>
          )}

          {/* Period statement */}
          {invoice.periodStart && invoice.periodEnd && (
            <div className="mb-8 px-4 py-3 rounded-lg bg-[#F0FAF4] border border-[#52B788]/20 text-sm text-[#1A2E22]">
              For Professional Services completed from{" "}
              <strong>{formatDate(invoice.periodStart)}</strong> to{" "}
              <strong>{formatDate(invoice.periodEnd)}</strong>.
            </div>
          )}

          {/* Line items */}
          <div className="mb-8">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#E8EDE9]">
                  <th className="py-3 text-left text-xs uppercase tracking-[0.12em] text-[#6B8C74] font-medium">
                    Description
                  </th>
                  <th className="py-3 text-right text-xs uppercase tracking-[0.12em] text-[#6B8C74] font-medium w-20">
                    Qty
                  </th>
                  <th className="py-3 text-right text-xs uppercase tracking-[0.12em] text-[#6B8C74] font-medium w-28">
                    Rate
                  </th>
                  <th className="py-3 text-right text-xs uppercase tracking-[0.12em] text-[#6B8C74] font-medium w-32">
                    Amount
                  </th>
                </tr>
              </thead>
              <tbody>
                {invoice.lineItems.map((li) => (
                  <tr key={li.id} className="border-b border-[#F0F2F0]">
                    <td className="py-3 text-[#1A2E22]">{li.description}</td>
                    <td className="py-3 text-right text-[#1A2E22]">
                      {Number(li.quantity)}
                    </td>
                    <td className="py-3 text-right text-[#1A2E22]">
                      {formatMoney(Number(li.unitPrice))}
                    </td>
                    <td className="py-3 text-right text-[#1A2E22] font-medium">
                      {formatMoney(Number(li.amount))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals */}
          <div className="flex justify-end">
            <div className="w-full sm:w-72 space-y-2 text-sm">
              <div className="flex justify-between text-[#3D5C48]">
                <span>Subtotal</span>
                <span>{formatMoney(subtotal)}</span>
              </div>
              {tax > 0 && (
                <div className="flex justify-between text-[#3D5C48]">
                  <span>Tax</span>
                  <span>{formatMoney(tax)}</span>
                </div>
              )}
              {paidAmount > 0 && (
                <div className="flex justify-between text-[#3D5C48]">
                  <span>Paid</span>
                  <span>{formatMoney(paidAmount)}</span>
                </div>
              )}
              <div className="flex justify-between pt-2 mt-2 border-t border-[#E8EDE9] text-[#1A2E22] font-semibold text-base">
                <span>{paidAmount > 0 ? "Balance Due" : "Total"}</span>
                <span>{formatMoney(balanceDue > 0 ? balanceDue : total)}</span>
              </div>
            </div>
          </div>

          {/* Notes */}
          {invoice.notes && (
            <div className="mt-8 pt-6 border-t border-[#E8EDE9]">
              <p className="text-xs uppercase tracking-[0.12em] text-[#6B8C74] mb-2">
                Notes
              </p>
              <p className="text-sm text-[#3D5C48] whitespace-pre-wrap">
                {invoice.notes}
              </p>
            </div>
          )}

          {/* Action row */}
          <div className="mt-10 pt-6 border-t border-[#E8EDE9] flex flex-wrap gap-3 justify-end">
            <a
              href={`/api/public/invoices/${token}/pdf`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg text-sm font-semibold border border-[#52B788]/30 bg-[#F0FAF4] text-[#2D6A4F] hover:bg-[#52B788] hover:text-white transition-colors"
            >
              Download PDF
            </a>
            {/* Pay-now button placeholder — wires up to Stripe Payment
                Links in a follow-up. Hidden until integration ships. */}
          </div>
        </div>

        <p className="text-center text-xs text-[#A3BEA9] mt-6">
          Questions about this invoice? Reply to the email it was sent in.
        </p>
      </div>
    </div>
  );
}
