"use client";

import { useState } from "react";
import { Send, X } from "lucide-react";
import type { Invoice } from "./types";

/**
 * Modal for sending an invoice to its client via Loops. Replaces the
 * back-to-back browser prompts the v1 implementation used. Recipient
 * + optional message + send. Auto-closes ~1.8s after a successful
 * send so the user sees the confirmation rather than an instant
 * disappearance.
 *
 * State ownership is local. Parent only knows "is this open and on
 * which invoice." On success, onSent fires with the API's updated
 * status + sentAt so the parent can patch its invoices list without
 * having to refetch.
 */

type Props = {
  invoice: Invoice;
  onClose: () => void;
  onSent: (update: { status: string; sentAt: string | null }) => void;
};

export default function SendInvoiceModal({ invoice, onClose, onSent }: Props) {
  const [toEmail, setToEmail] = useState(invoice.clientEmail ?? "");
  const [bodyMessage, setBodyMessage] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [sending, setSending] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSending(true);
    try {
      const res = await fetch(`/api/invoices/${invoice.id}/send`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          toEmail: toEmail.trim() || undefined,
          bodyMessage: bodyMessage.trim() || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to send invoice.");
        return;
      }
      onSent({ status: data.status, sentAt: data.sentAt });
      setSuccess(`Sent to ${data.recipient}. Status updated to ${data.status}.`);
      // Auto-close after a moment so the user sees the confirmation.
      setTimeout(() => {
        onClose();
      }, 1800);
    } finally {
      setSending(false);
    }
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
          <h2 className="font-serif text-xl text-[#1A2E22]">Send invoice</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close send invoice modal"
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
              htmlFor="send-to-email"
              className="text-sm text-[#3D5C48] block mb-1.5 font-medium"
            >
              Send to
            </label>
            <input
              id="send-to-email"
              type="email"
              value={toEmail}
              onChange={(e) => setToEmail(e.target.value)}
              placeholder={invoice.clientEmail ?? "client@example.com"}
              className="w-full bg-[#F7F9F7] border border-[#E2EBE4] rounded-lg px-3.5 py-2.5 text-sm text-[#1A2E22] focus:outline-none focus:border-[#52B788]"
            />
            <p className="mt-1 text-xs text-[#A3BEA9]">
              Defaults to the client&apos;s email on the project. Override here for a one-off.
            </p>
          </div>

          <div>
            <label
              htmlFor="send-message"
              className="text-sm text-[#3D5C48] block mb-1.5 font-medium"
            >
              Message <span className="text-[#A3BEA9] font-normal">(optional)</span>
            </label>
            <textarea
              id="send-message"
              rows={3}
              value={bodyMessage}
              onChange={(e) => setBodyMessage(e.target.value)}
              placeholder="Hi — your invoice is ready for review. Click the link in the email to view, download, or pay online."
              className="w-full bg-[#F7F9F7] border border-[#E2EBE4] rounded-lg px-3.5 py-2.5 text-sm text-[#1A2E22] focus:outline-none focus:border-[#52B788]"
            />
          </div>

          {error && (
            <div className="rounded-lg bg-rose-50 border border-rose-200 px-3 py-2 text-xs text-rose-700">
              {error}
            </div>
          )}
          {success && (
            <div className="rounded-lg bg-[#F0FAF4] border border-[#52B788]/40 px-3 py-2 text-xs text-[#2D6A4F]">
              {success}
            </div>
          )}

          <div className="flex items-center gap-3 pt-2">
            <button
              type="submit"
              disabled={sending || !!success}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold bg-[#2D6A4F] text-white hover:bg-[#40916C] transition-colors disabled:opacity-60"
            >
              <Send className="w-4 h-4" />
              {sending ? "Sending..." : success ? "Sent ✓" : "Send invoice"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-lg text-sm font-medium text-[#6B8C74] hover:text-[#1A2E22] transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
