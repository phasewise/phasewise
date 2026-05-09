"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { type Invoice, STATUS_OPTIONS } from "./types";

/**
 * Modal for editing an invoice's payment record. Used both for "Mark
 * paid" (status → PAID, fill in amount/date/method/reference) and for
 * editing an already-paid invoice (e.g. fixing a typo'd reference
 * number, recording a refund).
 *
 * Initialized from the invoice prop. Owns its own form state. On
 * successful save, onSaved fires with the updated invoice fields so
 * the parent can patch its invoices list without refetching.
 */

export type PaymentUpdate = {
  status: string;
  paidAmount: number;
  paidDate: string | null;
  paymentReference: string | null;
  paymentMethod: string | null;
};

type Props = {
  invoice: Invoice;
  // Pre-fill defaults — used to differentiate "mark as paid"
  // (status defaults to PAID, today's date) from "edit existing
  // payment" (status defaults to invoice.status, paidDate to
  // invoice.paidDate). Optional; if omitted, edits use the invoice's
  // current values.
  initialStatus?: string;
  initialPaidAmount?: string;
  initialPaidDate?: string;
  onClose: () => void;
  onSaved: (update: PaymentUpdate) => void;
};

export default function PaymentUpdateModal({
  invoice,
  initialStatus,
  initialPaidAmount,
  initialPaidDate,
  onClose,
  onSaved,
}: Props) {
  const [status, setStatus] = useState(initialStatus ?? invoice.status);
  const [paidAmount, setPaidAmount] = useState(
    initialPaidAmount ?? String(invoice.paidAmount ?? "")
  );
  const [paidDate, setPaidDate] = useState(
    initialPaidDate ?? (invoice.paidDate ? invoice.paidDate.split("T")[0] : "")
  );
  const [paymentMethod, setPaymentMethod] = useState(invoice.paymentMethod ?? "");
  const [paymentReference, setPaymentReference] = useState(
    invoice.paymentReference ?? ""
  );
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSaving(true);

    const res = await fetch("/api/invoices", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: invoice.id,
        status,
        paidAmount: Number(paidAmount) || 0,
        paidDate: paidDate || null,
        paymentReference: paymentReference || null,
        paymentMethod: paymentMethod || null,
      }),
    });

    const data = await res.json();
    setSaving(false);

    if (!res.ok) {
      setError(data.error || "Failed to update.");
      return;
    }

    const updated = data.invoice;
    onSaved({
      status: updated.status,
      paidAmount: Number(updated.paidAmount),
      paidDate: updated.paidDate,
      paymentReference: updated.paymentReference,
      paymentMethod: updated.paymentMethod,
    });
    onClose();
  }

  return (
    <div
      className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-6 pb-0">
          <h2 className="font-serif text-xl text-[#1A2E22]">Update Payment</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close payment update modal"
            className="text-[#A3BEA9] hover:text-[#1A2E22] transition-colors"
          >
            <X size={18} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="bg-[#F7F9F7] rounded-xl p-4 space-y-1 text-sm">
            <div className="flex justify-between">
              <span className="text-[#6B8C74]">Invoice</span>
              <span className="font-mono font-semibold text-[#1A2E22]">
                {invoice.invoiceNumber}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#6B8C74]">Project</span>
              <span className="text-[#1A2E22]">{invoice.projectName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#6B8C74]">Total</span>
              <span className="font-semibold text-[#1A2E22]">
                ${invoice.total.toLocaleString()}
              </span>
            </div>
          </div>

          <div>
            <label
              htmlFor="inv-edit-status"
              className="text-sm text-[#3D5C48] block mb-1.5 font-medium"
            >
              Status
            </label>
            <select
              id="inv-edit-status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full bg-[#F7F9F7] border border-[#E2EBE4] rounded-lg px-3.5 py-2.5 text-sm text-[#1A2E22] focus:outline-none focus:border-[#52B788]"
            >
              {STATUS_OPTIONS.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="inv-edit-paid-amount"
                className="text-sm text-[#3D5C48] block mb-1.5 font-medium"
              >
                Amount paid
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A3BEA9] text-sm">
                  $
                </span>
                <input
                  id="inv-edit-paid-amount"
                  type="number"
                  step="0.01"
                  min="0"
                  value={paidAmount}
                  onChange={(e) => setPaidAmount(e.target.value)}
                  className="w-full bg-[#F7F9F7] border border-[#E2EBE4] rounded-lg pl-7 pr-3.5 py-2.5 text-sm text-[#1A2E22] focus:outline-none focus:border-[#52B788]"
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="inv-edit-paid-date"
                className="text-sm text-[#3D5C48] block mb-1.5 font-medium"
              >
                Paid date
              </label>
              <input
                id="inv-edit-paid-date"
                type="date"
                value={paidDate}
                onChange={(e) => setPaidDate(e.target.value)}
                className="w-full bg-[#F7F9F7] border border-[#E2EBE4] rounded-lg px-3.5 py-2.5 text-sm text-[#1A2E22] focus:outline-none focus:border-[#52B788]"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="inv-edit-payment-method"
                className="text-sm text-[#3D5C48] block mb-1.5 font-medium"
              >
                Payment method
              </label>
              <input
                id="inv-edit-payment-method"
                list="inv-payment-methods"
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                placeholder="Check / ACH / Wire / Card"
                className="w-full bg-[#F7F9F7] border border-[#E2EBE4] rounded-lg px-3.5 py-2.5 text-sm text-[#1A2E22] focus:outline-none focus:border-[#52B788]"
              />
              <datalist id="inv-payment-methods">
                <option value="Check" />
                <option value="ACH" />
                <option value="Wire" />
                <option value="Credit Card" />
                <option value="Cash" />
                <option value="Other" />
              </datalist>
            </div>
            <div>
              <label
                htmlFor="inv-edit-payment-reference"
                className="text-sm text-[#3D5C48] block mb-1.5 font-medium"
              >
                Reference / check #
              </label>
              <input
                id="inv-edit-payment-reference"
                value={paymentReference}
                onChange={(e) => setPaymentReference(e.target.value)}
                placeholder="Check #, ACH ref, transaction ID…"
                className="w-full bg-[#F7F9F7] border border-[#E2EBE4] rounded-lg px-3.5 py-2.5 text-sm text-[#1A2E22] focus:outline-none focus:border-[#52B788]"
              />
            </div>
          </div>
          {error && <p className="text-[#B04030] text-sm">{error}</p>}
          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium bg-[#2D6A4F] text-white hover:bg-[#40916C] transition-colors disabled:opacity-50"
            >
              {saving ? "Saving..." : "Update payment"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-lg text-sm text-[#6B8C74] hover:text-[#1A2E22]"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
