"use client";

import { CheckCircle2, ExternalLink, Send, X } from "lucide-react";
import { type Invoice, STATUS_OPTIONS } from "./types";

/**
 * Read-only review surface for a single invoice. Opens when a DRAFT
 * row is clicked (or via the explicit "Review" action). Surfaces
 * everything the operator needs to verify before clicking "Send to
 * client": billing period, line items, totals, notes.
 *
 * Editing is intentionally out of scope here — line items and totals
 * are produced upstream by the "Pull from timesheets" flow in the
 * New Invoice form, and the source of truth for any correction is to
 * delete + recreate. Keeping this surface read-only avoids two
 * divergent paths into the same data.
 *
 * Action buttons at the bottom mirror the row-level actions so the
 * operator doesn't have to close the modal to send, mark sent, or
 * open the PDF.
 */

type Props = {
  invoice: Invoice;
  onClose: () => void;
  onSend: () => void;
  onMarkSent: () => void;
};

export default function InvoiceReviewModal({ invoice, onClose, onSend, onMarkSent }: Props) {
  const statusLabel =
    STATUS_OPTIONS.find((s) => s.value === invoice.status)?.label ?? invoice.status;
  const periodLabel =
    invoice.periodStart && invoice.periodEnd
      ? `${new Date(invoice.periodStart).toLocaleDateString(undefined, {
          month: "short",
          day: "numeric",
          year: "numeric",
          timeZone: "UTC",
        })} – ${new Date(invoice.periodEnd).toLocaleDateString(undefined, {
          month: "short",
          day: "numeric",
          year: "numeric",
          timeZone: "UTC",
        })}`
      : null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-6 pb-4 border-b border-[#E8EDE9]">
          <div>
            <h2 className="font-serif text-xl text-[#1A2E22]">
              Review invoice {invoice.invoiceNumber}
            </h2>
            <p className="text-xs text-[#6B8C74] mt-0.5">
              Read-only preview. Verify line items + period before sending.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close invoice review"
            className="text-[#A3BEA9] hover:text-[#1A2E22] transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Header block: project, status, dates */}
          <div className="bg-[#F7F9F7] rounded-xl p-4 grid sm:grid-cols-2 gap-3 text-sm">
            <div>
              <div className="text-[10px] uppercase tracking-wide text-[#6B8C74] font-semibold mb-1">
                Project
              </div>
              <div className="text-[#1A2E22] font-medium">{invoice.projectName}</div>
              {invoice.projectNumber && (
                <div className="text-xs text-[#A3BEA9]">{invoice.projectNumber}</div>
              )}
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-wide text-[#6B8C74] font-semibold mb-1">
                Status
              </div>
              <div className="text-[#1A2E22]">{statusLabel}</div>
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-wide text-[#6B8C74] font-semibold mb-1">
                Issued
              </div>
              <div className="text-[#1A2E22]">
                {new Date(invoice.issueDate).toLocaleDateString(undefined, {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </div>
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-wide text-[#6B8C74] font-semibold mb-1">
                Due
              </div>
              <div className="text-[#1A2E22]">
                {new Date(invoice.dueDate).toLocaleDateString(undefined, {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </div>
            </div>
            {periodLabel && (
              <div className="sm:col-span-2">
                <div className="text-[10px] uppercase tracking-wide text-[#6B8C74] font-semibold mb-1">
                  Billing period
                </div>
                <div className="text-[#1A2E22]">{periodLabel}</div>
              </div>
            )}
            {invoice.clientEmail && (
              <div className="sm:col-span-2">
                <div className="text-[10px] uppercase tracking-wide text-[#6B8C74] font-semibold mb-1">
                  Client email on file
                </div>
                <div className="text-[#1A2E22] font-mono text-xs">{invoice.clientEmail}</div>
              </div>
            )}
          </div>

          {/* Line items */}
          <div>
            <h3 className="text-sm font-semibold text-[#1A2E22] mb-2">Line items</h3>
            {invoice.lineItems.length === 0 ? (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800">
                No line items on this invoice. This usually means the auto-pull found no billable
                hours for the period — consider deleting and recreating with a different period or
                project.
              </div>
            ) : (
              <div className="border border-[#E8EDE9] rounded-xl overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-[#F7F9F7] text-[#6B8C74] text-[11px] uppercase tracking-wide">
                    <tr>
                      <th className="px-4 py-2.5 text-left font-medium">Description</th>
                      <th className="px-4 py-2.5 text-right font-medium w-24">Qty</th>
                      <th className="px-4 py-2.5 text-right font-medium w-28">Rate</th>
                      <th className="px-4 py-2.5 text-right font-medium w-28">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoice.lineItems.map((li) => (
                      <tr key={li.id} className="border-t border-[#E8EDE9]">
                        <td className="px-4 py-3 text-[#1A2E22]">{li.description}</td>
                        <td className="px-4 py-3 text-right text-[#3D5C48]">
                          {li.quantity.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                        </td>
                        <td className="px-4 py-3 text-right text-[#3D5C48]">
                          ${li.unitPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </td>
                        <td className="px-4 py-3 text-right font-medium text-[#1A2E22]">
                          ${li.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Totals */}
          <div className="flex justify-end">
            <div className="w-full sm:w-72 space-y-1.5 text-sm">
              <div className="flex justify-between">
                <span className="text-[#6B8C74]">Subtotal</span>
                <span className="text-[#1A2E22] font-medium">
                  ${invoice.subtotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
              {invoice.tax > 0 && (
                <div className="flex justify-between">
                  <span className="text-[#6B8C74]">Tax</span>
                  <span className="text-[#1A2E22] font-medium">
                    ${invoice.tax.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
              )}
              <div className="flex justify-between pt-2 border-t border-[#E8EDE9]">
                <span className="text-[#1A2E22] font-semibold">Total</span>
                <span className="text-[#1A2E22] font-semibold text-base">
                  ${invoice.total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
            </div>
          </div>

          {/* Notes */}
          {invoice.notes && (
            <div>
              <h3 className="text-sm font-semibold text-[#1A2E22] mb-2">Notes</h3>
              <div className="bg-[#F7F9F7] rounded-xl p-4 text-sm text-[#3D5C48] whitespace-pre-wrap">
                {invoice.notes}
              </div>
            </div>
          )}
        </div>

        {/* Sticky action bar */}
        <div className="border-t border-[#E8EDE9] p-4 sm:p-6 flex flex-wrap items-center gap-2 sm:gap-3 bg-[#F7F9F7]/40">
          {invoice.status === "DRAFT" && (
            <>
              <button
                type="button"
                onClick={onSend}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium bg-[#2D6A4F] text-white hover:bg-[#40916C] transition-colors"
              >
                <Send className="w-4 h-4" />
                Send to client
              </button>
              <button
                type="button"
                onClick={onMarkSent}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium border border-[#E2EBE4] text-[#1A2E22] hover:bg-white transition-colors"
              >
                <CheckCircle2 className="w-4 h-4" />
                Mark sent
              </button>
            </>
          )}
          <a
            href={`/api/invoices/${invoice.id}/pdf`}
            target="_blank"
            rel="noopener"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium border border-[#E2EBE4] text-[#2D6A4F] hover:bg-white transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
            Open PDF
          </a>
          <div className="ml-auto">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-lg text-sm text-[#6B8C74] hover:text-[#1A2E22] transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
