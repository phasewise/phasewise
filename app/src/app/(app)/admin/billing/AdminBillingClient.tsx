"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Calendar,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  DollarSign,
  FileText,
  Plus,
  Send,
  Sparkles,
  X,
} from "lucide-react";

type LineItem = {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  amount: number;
};

type Invoice = {
  id: string;
  invoiceNumber: string;
  status: string;
  issueDate: string;
  dueDate: string;
  periodStart: string | null;
  periodEnd: string | null;
  subtotal: number;
  tax: number;
  total: number;
  paidAmount: number;
  paidDate: string | null;
  paymentReference: string | null;
  paymentMethod: string | null;
  sentAt: string | null;
  notes: string | null;
  projectName: string;
  projectNumber: string | null;
  projectId: string;
  lineItems: LineItem[];
};

type Props = {
  invoices: Invoice[];
  projects: Array<{ id: string; name: string; projectNumber: string | null }>;
};

const STATUS_COLORS: Record<string, string> = {
  DRAFT: "bg-[#F7F9F7] text-[#6B8C74] border-[#E2EBE4]",
  SENT: "bg-blue-50 text-blue-700 border-blue-200",
  PAID: "bg-[#F0FAF4] text-[#2D6A4F] border-[#52B788]/30",
  PARTIALLY_PAID: "bg-amber-50 text-amber-700 border-amber-200",
  OVERDUE: "bg-rose-50 text-rose-700 border-rose-200",
  VOID: "bg-[#F7F9F7] text-[#A3BEA9] border-[#E2EBE4]",
};

const STATUS_OPTIONS = [
  { value: "DRAFT", label: "Draft" },
  { value: "SENT", label: "Sent" },
  { value: "PAID", label: "Paid" },
  { value: "PARTIALLY_PAID", label: "Partially Paid" },
  { value: "OVERDUE", label: "Overdue" },
  { value: "VOID", label: "Void" },
];

// Section order — attention items first, then current work, then
// historical. Matches the pattern used on the Projects list page.
type SectionKey = "OVERDUE" | "SENT" | "PARTIALLY_PAID" | "DRAFT" | "PAID" | "VOID";

const SECTION_ORDER: Array<{
  key: SectionKey;
  label: string;
  description: string;
  defaultCollapsed: boolean;
}> = [
  { key: "OVERDUE", label: "Overdue", description: "Past due — chase payment.", defaultCollapsed: false },
  { key: "SENT", label: "Sent", description: "Awaiting payment.", defaultCollapsed: false },
  { key: "PARTIALLY_PAID", label: "Partially paid", description: "Need follow-up for the balance.", defaultCollapsed: false },
  { key: "DRAFT", label: "Draft", description: "In progress; not yet sent.", defaultCollapsed: false },
  { key: "PAID", label: "Paid", description: "Closed; kept for reference.", defaultCollapsed: true },
  { key: "VOID", label: "Voided", description: "Cancelled invoices.", defaultCollapsed: true },
];

// "Overdue" isn't a stored status in most cases — it's derived from the
// due date when the invoice is still SENT or DRAFT. We compute it here.
function deriveSectionKey(inv: Invoice): SectionKey {
  if (inv.status === "PAID") return "PAID";
  if (inv.status === "VOID") return "VOID";
  if (inv.status === "PARTIALLY_PAID") return "PARTIALLY_PAID";
  // Anything otherwise unpaid is OVERDUE if past due, else its own status.
  const due = new Date(inv.dueDate);
  if (due < new Date()) return "OVERDUE";
  if (inv.status === "SENT") return "SENT";
  return "DRAFT";
}

export default function AdminBillingClient({ invoices: initialInvoices, projects }: Props) {
  const [invoices, setInvoices] = useState(initialInvoices);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editingInvoice, setEditingInvoice] = useState<Invoice | null>(null);

  // Per-section collapse state. Mirrors the Projects list pattern.
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>(() =>
    SECTION_ORDER.reduce(
      (acc, s) => ({ ...acc, [s.key]: s.defaultCollapsed }),
      {} as Record<string, boolean>
    )
  );
  function toggleSection(key: string) {
    setCollapsed((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  // Create form state
  const [formProjectId, setFormProjectId] = useState("");
  const [formInvoiceNumber, setFormInvoiceNumber] = useState("");
  const [formIssueDate, setFormIssueDate] = useState(new Date().toISOString().split("T")[0]);
  const [formDueDate, setFormDueDate] = useState("");
  // Period dates drive the PDF letterhead statement and (when set together
  // with project) enable the "Pull from timesheets" action.
  const [formPeriodStart, setFormPeriodStart] = useState("");
  const [formPeriodEnd, setFormPeriodEnd] = useState("");
  const [formNotes, setFormNotes] = useState("");
  const [formLines, setFormLines] = useState<
    Array<{
      description: string;
      quantity: string;
      unitPrice: string;
      // Source TimeEntry IDs when the line came from the timesheet preview.
      // Submitted to the API so those entries get tagged invoiced.
      sourceEntryIds?: string[];
    }>
  >([{ description: "", quantity: "1", unitPrice: "" }]);
  const [pulling, setPulling] = useState(false);
  const [pullSummary, setPullSummary] = useState<string | null>(null);

  // Edit modal state
  const [editStatus, setEditStatus] = useState("");
  const [editPaidAmount, setEditPaidAmount] = useState("");
  const [editPaidDate, setEditPaidDate] = useState("");
  const [editPaymentReference, setEditPaymentReference] = useState("");
  const [editPaymentMethod, setEditPaymentMethod] = useState("");

  // Auto-fetch next invoice number whenever the form opens. The counter
  // doesn't increment until the user actually creates the invoice.
  useEffect(() => {
    if (!showForm) return;
    if (formInvoiceNumber) return; // Don't clobber a value the user typed.
    fetch("/api/invoices/next-number")
      .then((r) => r.json())
      .then((d) => {
        if (d.nextNumber) setFormInvoiceNumber(d.nextNumber);
      })
      .catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showForm]);

  function addLine() {
    setFormLines((prev) => [...prev, { description: "", quantity: "1", unitPrice: "" }]);
  }
  function removeLine(index: number) {
    setFormLines((prev) => prev.filter((_, i) => i !== index));
  }
  function updateLine(index: number, field: string, value: string) {
    setFormLines((prev) =>
      prev.map((l, i) =>
        i === index ? { ...l, [field]: value, sourceEntryIds: undefined } : l
      )
    );
  }

  const formTotal = formLines.reduce(
    (sum, l) => sum + (Number(l.quantity) || 0) * (Number(l.unitPrice) || 0),
    0
  );

  // Pull approved billable timesheet entries for the selected project +
  // period and replace the line items with one row per (phase, person).
  // Existing user-typed lines are dropped because the action implies
  // "use the timesheet as the source of truth."
  async function pullFromTimesheets() {
    setError(null);
    setPullSummary(null);
    if (!formProjectId) {
      setError("Pick a project first.");
      return;
    }
    if (!formPeriodStart || !formPeriodEnd) {
      setError("Set the billing period (Period start + Period end) first.");
      return;
    }
    setPulling(true);
    try {
      const res = await fetch(
        `/api/invoices/timesheet-preview?projectId=${formProjectId}&from=${formPeriodStart}&to=${formPeriodEnd}`
      );
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to pull timesheet entries.");
        setPulling(false);
        return;
      }
      const items = (data.lineItems ?? []) as Array<{
        description: string;
        quantity: number;
        unitPrice: number;
        sourceEntryIds: string[];
      }>;
      if (items.length === 0) {
        setPullSummary(
          data.summary?.skippedNotApproved
            ? `No approved billable hours in this period. ${data.summary.skippedNotApproved} entries skipped because their week isn't approved yet.`
            : "No billable hours found in this period."
        );
        setPulling(false);
        return;
      }
      setFormLines(
        items.map((item) => ({
          description: item.description,
          quantity: String(item.quantity),
          unitPrice: String(item.unitPrice),
          sourceEntryIds: item.sourceEntryIds,
        }))
      );
      setPullSummary(
        `Pulled ${data.summary?.totalEntries ?? items.length} time entries (${data.summary?.totalHours ?? "?"} hours) into ${items.length} line items. Edit before saving.`
      );
    } catch {
      setError("Network error pulling timesheet entries.");
    } finally {
      setPulling(false);
    }
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSaving(true);

    const res = await fetch("/api/invoices", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        projectId: formProjectId,
        invoiceNumber: formInvoiceNumber || undefined,
        issueDate: formIssueDate,
        dueDate: formDueDate,
        periodStart: formPeriodStart || undefined,
        periodEnd: formPeriodEnd || undefined,
        notes: formNotes || undefined,
        lineItems: formLines
          .filter((l) => l.description && Number(l.unitPrice) > 0)
          .map((l) => ({
            description: l.description,
            quantity: Number(l.quantity) || 1,
            unitPrice: Number(l.unitPrice),
            sourceEntryIds: l.sourceEntryIds,
          })),
      }),
    });

    const data = await res.json();
    setSaving(false);

    if (!res.ok) {
      setError(data.error || "Failed to create invoice.");
      return;
    }

    const inv = data.invoice;
    setInvoices((prev) => [
      {
        id: inv.id,
        invoiceNumber: inv.invoiceNumber,
        status: inv.status,
        issueDate: inv.issueDate,
        dueDate: inv.dueDate,
        periodStart: inv.periodStart,
        periodEnd: inv.periodEnd,
        subtotal: Number(inv.subtotal),
        tax: Number(inv.tax),
        total: Number(inv.total),
        paidAmount: Number(inv.paidAmount),
        paidDate: inv.paidDate,
        paymentReference: inv.paymentReference,
        paymentMethod: inv.paymentMethod,
        sentAt: inv.sentAt,
        notes: inv.notes,
        projectName: inv.project.name,
        projectNumber: inv.project.projectNumber,
        projectId: inv.projectId,
        lineItems: inv.lineItems.map(
          (li: { id: string; description: string; quantity: string; unitPrice: string; amount: string }) => ({
            id: li.id,
            description: li.description,
            quantity: Number(li.quantity),
            unitPrice: Number(li.unitPrice),
            amount: Number(li.amount),
          })
        ),
      },
      ...prev,
    ]);

    setShowForm(false);
    setFormProjectId("");
    setFormInvoiceNumber("");
    setFormDueDate("");
    setFormPeriodStart("");
    setFormPeriodEnd("");
    setFormNotes("");
    setFormLines([{ description: "", quantity: "1", unitPrice: "" }]);
    setPullSummary(null);
  }

  function openPayment(invoice: Invoice) {
    setEditingInvoice(invoice);
    setEditStatus(invoice.status);
    setEditPaidAmount(String(invoice.paidAmount));
    setEditPaidDate(invoice.paidDate ? invoice.paidDate.split("T")[0] : "");
    setEditPaymentReference(invoice.paymentReference ?? "");
    setEditPaymentMethod(invoice.paymentMethod ?? "");
    setError(null);
  }

  // Pre-fill the payment modal as a "Mark as Paid" shortcut: status PAID,
  // paid in full, today's date. User can still tweak before saving.
  function quickMarkAsPaid(invoice: Invoice) {
    openPayment(invoice);
    setEditStatus("PAID");
    setEditPaidAmount(String(invoice.total));
    setEditPaidDate(new Date().toISOString().split("T")[0]);
  }

  // One-click "Mark as Sent" — records sentAt + flips DRAFT to SENT.
  // No modal because there's nothing to ask the user about.
  async function quickMarkAsSent(invoice: Invoice) {
    if (!confirm(`Mark ${invoice.invoiceNumber} as sent? This records today as the send date and changes status to SENT.`)) {
      return;
    }
    const res = await fetch("/api/invoices", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: invoice.id,
        status: "SENT",
        sentAt: new Date().toISOString(),
      }),
    });
    if (!res.ok) {
      const data = await res.json();
      setError(data.error || "Failed to mark as sent.");
      return;
    }
    const updated = (await res.json()).invoice;
    setInvoices((prev) =>
      prev.map((inv) =>
        inv.id === invoice.id
          ? { ...inv, status: updated.status, sentAt: updated.sentAt }
          : inv
      )
    );
  }

  async function handleUpdatePayment(e: React.FormEvent) {
    e.preventDefault();
    if (!editingInvoice) return;
    setError(null);
    setSaving(true);

    const res = await fetch("/api/invoices", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: editingInvoice.id,
        status: editStatus,
        paidAmount: Number(editPaidAmount) || 0,
        paidDate: editPaidDate || null,
        paymentReference: editPaymentReference || null,
        paymentMethod: editPaymentMethod || null,
      }),
    });

    const data = await res.json();
    setSaving(false);

    if (!res.ok) {
      setError(data.error || "Failed to update.");
      return;
    }

    const updated = data.invoice;
    setInvoices((prev) =>
      prev.map((inv) =>
        inv.id === editingInvoice.id
          ? {
              ...inv,
              status: updated.status,
              paidAmount: Number(updated.paidAmount),
              paidDate: updated.paidDate,
              paymentReference: updated.paymentReference,
              paymentMethod: updated.paymentMethod,
            }
          : inv
      )
    );
    setEditingInvoice(null);
  }

  // Group invoices by section for the rendered tables.
  const grouped: Record<SectionKey, Invoice[]> = {
    OVERDUE: [],
    SENT: [],
    PARTIALLY_PAID: [],
    DRAFT: [],
    PAID: [],
    VOID: [],
  };
  for (const inv of invoices) {
    grouped[deriveSectionKey(inv)].push(inv);
  }

  // Summary calculations
  const totalInvoiced = invoices.reduce((s, inv) => s + inv.total, 0);
  const totalPaid = invoices.reduce((s, inv) => s + inv.paidAmount, 0);
  const totalOutstanding = totalInvoiced - totalPaid;
  const overdueCount = grouped.OVERDUE.length;

  return (
    <div>
      <Link
        href="/admin"
        className="inline-flex items-center gap-1.5 text-sm text-[#6B8C74] hover:text-[#2D6A4F] mb-6 transition-colors"
      >
        <ArrowLeft size={14} /> Admin
      </Link>

      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="font-serif text-3xl text-[#1A2E22]">Project Billing</h1>
          <p className="mt-1 text-sm text-[#6B8C74]">
            Track invoices, payments, and outstanding balances.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowForm(!showForm)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium bg-[#2D6A4F] text-white hover:bg-[#40916C] transition-colors"
        >
          <Plus className="w-4 h-4" />
          New Invoice
        </button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <div className="rounded-2xl border border-[#E2EBE4] bg-white p-5 shadow-sm">
          <div className="text-xs font-semibold uppercase tracking-[0.24em] text-[#6B8C74] mb-2">
            Total Invoiced
          </div>
          <div className="text-2xl font-semibold text-[#1A2E22]">
            ${totalInvoiced.toLocaleString()}
          </div>
        </div>
        <div className="rounded-2xl border border-[#E2EBE4] bg-white p-5 shadow-sm">
          <div className="text-xs font-semibold uppercase tracking-[0.24em] text-[#6B8C74] mb-2">
            Total Paid
          </div>
          <div className="text-2xl font-semibold text-[#2D6A4F]">
            ${totalPaid.toLocaleString()}
          </div>
        </div>
        <div className="rounded-2xl border border-[#E2EBE4] bg-white p-5 shadow-sm">
          <div className="text-xs font-semibold uppercase tracking-[0.24em] text-[#6B8C74] mb-2">
            Outstanding
          </div>
          <div
            className={`text-2xl font-semibold ${
              totalOutstanding > 0 ? "text-amber-600" : "text-[#2D6A4F]"
            }`}
          >
            ${totalOutstanding.toLocaleString()}
          </div>
        </div>
        <div className="rounded-2xl border border-[#E2EBE4] bg-white p-5 shadow-sm">
          <div className="text-xs font-semibold uppercase tracking-[0.24em] text-[#6B8C74] mb-2">
            Overdue
          </div>
          <div
            className={`text-2xl font-semibold ${
              overdueCount > 0 ? "text-rose-600" : "text-[#2D6A4F]"
            }`}
          >
            {overdueCount}
          </div>
        </div>
      </div>

      {error && (
        <div className="mb-4 bg-rose-50 border border-rose-200 rounded-xl p-3 text-sm text-rose-700">
          {error}
        </div>
      )}

      {/* Create form */}
      {showForm && (
        <form
          onSubmit={handleCreate}
          className="mb-8 bg-[#F0FAF4] border border-[#52B788]/30 rounded-2xl p-6"
        >
          <div className="flex items-center gap-2 mb-4 text-[#2D6A4F]">
            <FileText className="w-5 h-5" />
            <h3 className="text-sm font-semibold">New Invoice</h3>
          </div>

          <div className="grid sm:grid-cols-4 gap-4 mb-4">
            <div>
              <label htmlFor="inv-project" className="text-sm text-[#3D5C48] block mb-1.5 font-medium">
                Project *
              </label>
              <select
                id="inv-project"
                value={formProjectId}
                onChange={(e) => setFormProjectId(e.target.value)}
                required
                className="w-full bg-white border border-[#E2EBE4] rounded-lg px-3.5 py-2.5 text-sm text-[#1A2E22] focus:outline-none focus:border-[#52B788]"
              >
                <option value="">Select project</option>
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="inv-number" className="text-sm text-[#3D5C48] block mb-1.5 font-medium">
                Invoice # *
              </label>
              <input
                id="inv-number"
                value={formInvoiceNumber}
                onChange={(e) => setFormInvoiceNumber(e.target.value)}
                required
                placeholder="INV-001"
                className="w-full bg-white border border-[#E2EBE4] rounded-lg px-3.5 py-2.5 text-sm text-[#1A2E22] focus:outline-none focus:border-[#52B788]"
              />
              <p className="mt-1 text-[10px] text-[#6B8C74]">
                Auto-numbered. Edit if you need a custom value.
              </p>
            </div>
            <div>
              <label htmlFor="inv-issue-date" className="text-sm text-[#3D5C48] block mb-1.5 font-medium">
                Issue date *
              </label>
              <input
                id="inv-issue-date"
                type="date"
                value={formIssueDate}
                onChange={(e) => setFormIssueDate(e.target.value)}
                required
                className="w-full bg-white border border-[#E2EBE4] rounded-lg px-3.5 py-2.5 text-sm text-[#1A2E22] focus:outline-none focus:border-[#52B788]"
              />
            </div>
            <div>
              <label htmlFor="inv-due-date" className="text-sm text-[#3D5C48] block mb-1.5 font-medium">
                Due date *
              </label>
              <input
                id="inv-due-date"
                type="date"
                value={formDueDate}
                onChange={(e) => setFormDueDate(e.target.value)}
                required
                className="w-full bg-white border border-[#E2EBE4] rounded-lg px-3.5 py-2.5 text-sm text-[#1A2E22] focus:outline-none focus:border-[#52B788]"
              />
            </div>
          </div>

          {/* Billing period — drives PDF letterhead + the timesheet pull */}
          <div className="grid sm:grid-cols-[1fr_1fr_auto] gap-4 mb-4 items-end">
            <div>
              <label htmlFor="inv-period-start" className="text-sm text-[#3D5C48] block mb-1.5 font-medium">
                <Calendar className="inline w-3.5 h-3.5 mr-1 -mt-0.5" />
                Period start
              </label>
              <input
                id="inv-period-start"
                type="date"
                value={formPeriodStart}
                onChange={(e) => setFormPeriodStart(e.target.value)}
                className="w-full bg-white border border-[#E2EBE4] rounded-lg px-3.5 py-2.5 text-sm text-[#1A2E22] focus:outline-none focus:border-[#52B788]"
              />
            </div>
            <div>
              <label htmlFor="inv-period-end" className="text-sm text-[#3D5C48] block mb-1.5 font-medium">
                Period end
              </label>
              <input
                id="inv-period-end"
                type="date"
                value={formPeriodEnd}
                onChange={(e) => setFormPeriodEnd(e.target.value)}
                className="w-full bg-white border border-[#E2EBE4] rounded-lg px-3.5 py-2.5 text-sm text-[#1A2E22] focus:outline-none focus:border-[#52B788]"
              />
            </div>
            <button
              type="button"
              onClick={pullFromTimesheets}
              disabled={pulling || !formProjectId || !formPeriodStart || !formPeriodEnd}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium bg-blue-600 text-white hover:bg-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              title="Replace line items with approved billable time entries from this period"
            >
              <Sparkles className="w-4 h-4" />
              {pulling ? "Pulling..." : "Pull from timesheets"}
            </button>
          </div>
          {pullSummary && (
            <div className="mb-4 rounded-lg bg-blue-50 border border-blue-200/40 p-3 text-xs text-blue-900">
              {pullSummary}
            </div>
          )}

          {/* Line items */}
          <div className="mb-4">
            <label className="text-sm text-[#3D5C48] block mb-2 font-medium">Line Items</label>
            {formLines.map((line, i) => (
              <div key={i} className="grid grid-cols-[1fr_80px_100px_32px] gap-2 mb-2 items-end">
                <input
                  id={`inv-line-description-${i}`}
                  aria-label="Line item description"
                  value={line.description}
                  onChange={(e) => updateLine(i, "description", e.target.value)}
                  placeholder="Description"
                  className="bg-white border border-[#E2EBE4] rounded-lg px-3 py-2 text-sm text-[#1A2E22] focus:outline-none focus:border-[#52B788]"
                />
                <input
                  id={`inv-line-quantity-${i}`}
                  aria-label="Line item quantity"
                  type="number"
                  min="1"
                  step="0.01"
                  value={line.quantity}
                  onChange={(e) => updateLine(i, "quantity", e.target.value)}
                  placeholder="Qty"
                  className="bg-white border border-[#E2EBE4] rounded-lg px-3 py-2 text-sm text-[#1A2E22] focus:outline-none focus:border-[#52B788]"
                />
                <div className="relative">
                  <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#A3BEA9] text-sm">$</span>
                  <input
                    id={`inv-line-unit-price-${i}`}
                    aria-label="Line item unit price"
                    type="number"
                    step="0.01"
                    min="0"
                    value={line.unitPrice}
                    onChange={(e) => updateLine(i, "unitPrice", e.target.value)}
                    placeholder="0.00"
                    className="w-full bg-white border border-[#E2EBE4] rounded-lg pl-6 pr-2 py-2 text-sm text-[#1A2E22] focus:outline-none focus:border-[#52B788]"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeLine(i)}
                  aria-label="Remove line item"
                  className="text-[#A3BEA9] hover:text-rose-500 transition-colors p-1"
                  disabled={formLines.length === 1}
                >
                  <X size={14} />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addLine}
              className="text-xs text-[#2D6A4F] hover:text-[#40916C] font-medium mt-1"
            >
              + Add line
            </button>
            <div className="mt-2 text-sm font-semibold text-[#1A2E22] text-right">
              Total: ${formTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </div>
          </div>

          <div className="mb-4">
            <label htmlFor="inv-notes" className="text-sm text-[#3D5C48] block mb-1.5 font-medium">
              Notes
            </label>
            <input
              id="inv-notes"
              value={formNotes}
              onChange={(e) => setFormNotes(e.target.value)}
              placeholder="Payment terms, etc."
              className="w-full bg-white border border-[#E2EBE4] rounded-lg px-3.5 py-2.5 text-sm text-[#1A2E22] focus:outline-none focus:border-[#52B788]"
            />
          </div>
          <div className="flex gap-3">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-[#2D6A4F] text-white hover:bg-[#40916C] transition-colors disabled:opacity-50"
            >
              {saving ? "Creating..." : "Create invoice"}
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-4 py-2 rounded-lg text-sm text-[#6B8C74] hover:text-[#1A2E22]"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Status sections — same pattern as Projects list. Sections with
          zero invoices are hidden so the page stays compact. */}
      {invoices.length === 0 ? (
        <div className="rounded-2xl border border-[#E2EBE4] bg-white shadow-sm px-6 py-12 text-center">
          <DollarSign className="w-10 h-10 text-[#A3BEA9] mx-auto mb-3" />
          <h3 className="font-semibold text-[#1A2E22] mb-1">No invoices yet</h3>
          <p className="text-sm text-[#6B8C74]">
            Create your first invoice to start tracking project billing.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {SECTION_ORDER.map((section) => {
            const sectionInvoices = grouped[section.key];
            if (sectionInvoices.length === 0) return null;
            const isCollapsed = collapsed[section.key];
            return (
              <div
                key={section.key}
                className="rounded-2xl border border-[#E2EBE4] bg-white shadow-sm overflow-hidden"
              >
                <button
                  type="button"
                  onClick={() => toggleSection(section.key)}
                  className="w-full flex items-center justify-between border-b border-[#E2EBE4] px-6 py-4 text-left hover:bg-[#F7F9F7] transition-colors"
                  aria-expanded={!isCollapsed}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    {isCollapsed ? (
                      <ChevronRight className="w-4 h-4 text-[#6B8C74] flex-shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-[#6B8C74] flex-shrink-0" />
                    )}
                    <h2
                      className={`text-base font-semibold ${
                        section.key === "OVERDUE"
                          ? "text-rose-700"
                          : section.key === "PAID"
                          ? "text-[#3D5C48]"
                          : "text-[#1A2E22]"
                      }`}
                    >
                      {section.label}
                    </h2>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full ${
                        section.key === "OVERDUE"
                          ? "bg-rose-50 text-rose-700"
                          : "bg-[#F7F9F7] text-[#6B8C74]"
                      }`}
                    >
                      {sectionInvoices.length}
                    </span>
                    <span className="hidden sm:inline text-xs text-[#6B8C74] truncate">
                      · {section.description}
                    </span>
                  </div>
                  <span className="text-xs text-[#6B8C74]">
                    {isCollapsed ? "Show" : "Hide"}
                  </span>
                </button>

                {!isCollapsed && (
                  <div className="overflow-x-auto">
                    <table className="min-w-full text-left text-sm">
                      <thead className="border-b border-[#E2EBE4] bg-[#F7F9F7] text-[#6B8C74]">
                        <tr>
                          <th className="px-4 sm:px-6 py-3 font-medium">Invoice #</th>
                          <th className="px-4 sm:px-6 py-3 font-medium">Project</th>
                          <th className="px-4 sm:px-6 py-3 font-medium">Issued</th>
                          <th className="px-4 sm:px-6 py-3 font-medium">Due</th>
                          <th className="px-4 sm:px-6 py-3 font-medium text-right">Total</th>
                          <th className="px-4 sm:px-6 py-3 font-medium text-right">Paid</th>
                          <th className="px-4 sm:px-6 py-3 font-medium text-right">Balance</th>
                          <th className="px-4 sm:px-6 py-3 font-medium">Status</th>
                          <th className="px-4 sm:px-6 py-3 font-medium text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {sectionInvoices.map((inv) => {
                          const balance = inv.total - inv.paidAmount;
                          const isHistorical = section.key === "PAID" || section.key === "VOID";
                          return (
                            <tr
                              key={inv.id}
                              onClick={() => openPayment(inv)}
                              className={`border-b border-[#E8EDE9] last:border-0 hover:bg-[#F7F9F7]/50 transition-colors cursor-pointer ${
                                isHistorical ? "opacity-80" : ""
                              }`}
                            >
                              <td className="px-4 sm:px-6 py-4 font-mono text-xs font-semibold text-[#2D6A4F]">
                                {inv.invoiceNumber}
                              </td>
                              <td className="px-4 sm:px-6 py-4">
                                <div className="font-medium text-[#1A2E22]">{inv.projectName}</div>
                                {inv.projectNumber && (
                                  <div className="text-xs text-[#A3BEA9]">{inv.projectNumber}</div>
                                )}
                              </td>
                              <td className="px-4 sm:px-6 py-4 text-[#6B8C74]">
                                {new Date(inv.issueDate).toLocaleDateString()}
                              </td>
                              <td className="px-4 sm:px-6 py-4">
                                <span
                                  className={
                                    section.key === "OVERDUE" ? "text-rose-600 font-semibold" : "text-[#6B8C74]"
                                  }
                                >
                                  {new Date(inv.dueDate).toLocaleDateString()}
                                </span>
                              </td>
                              <td className="px-4 sm:px-6 py-4 text-right font-medium text-[#1A2E22]">
                                ${inv.total.toLocaleString()}
                              </td>
                              <td className="px-4 sm:px-6 py-4 text-right text-[#2D6A4F]">
                                ${inv.paidAmount.toLocaleString()}
                              </td>
                              <td className="px-4 sm:px-6 py-4 text-right">
                                <span
                                  className={
                                    balance > 0 ? "font-semibold text-amber-600" : "text-[#2D6A4F]"
                                  }
                                >
                                  ${balance.toLocaleString()}
                                </span>
                              </td>
                              <td className="px-4 sm:px-6 py-4" onClick={(e) => e.stopPropagation()}>
                                <span
                                  className={`text-xs font-semibold px-2 py-1 rounded-full border ${
                                    STATUS_COLORS[inv.status] ?? ""
                                  }`}
                                >
                                  {inv.status.replace("_", " ")}
                                </span>
                              </td>
                              <td className="px-4 sm:px-6 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                                <div className="inline-flex items-center gap-2">
                                  {inv.status === "DRAFT" && (
                                    <button
                                      type="button"
                                      onClick={() => quickMarkAsSent(inv)}
                                      className="inline-flex items-center gap-1 text-[11px] font-medium text-blue-700 hover:text-blue-800 hover:underline"
                                      title="Mark as sent"
                                    >
                                      <Send className="w-3 h-3" />
                                      Mark sent
                                    </button>
                                  )}
                                  {inv.status !== "PAID" && inv.status !== "VOID" && (
                                    <button
                                      type="button"
                                      onClick={() => quickMarkAsPaid(inv)}
                                      className="inline-flex items-center gap-1 text-[11px] font-medium text-[#2D6A4F] hover:text-[#40916C] hover:underline"
                                      title="Mark as paid"
                                    >
                                      <CheckCircle2 className="w-3 h-3" />
                                      Mark paid
                                    </button>
                                  )}
                                  <a
                                    href={`/api/invoices/${inv.id}/pdf`}
                                    target="_blank"
                                    rel="noopener"
                                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#2D6A4F] hover:text-[#40916C] transition-colors"
                                    title="Open PDF in new tab"
                                  >
                                    PDF
                                  </a>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Payment update modal */}
      {editingInvoice && (
        <div
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setEditingInvoice(null)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-6 pb-0">
              <h2 className="font-serif text-xl text-[#1A2E22]">Update Payment</h2>
              <button
                type="button"
                onClick={() => setEditingInvoice(null)}
                aria-label="Close payment update modal"
                className="text-[#A3BEA9] hover:text-[#1A2E22] transition-colors"
              >
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleUpdatePayment} className="p-6 space-y-4">
              <div className="bg-[#F7F9F7] rounded-xl p-4 space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-[#6B8C74]">Invoice</span>
                  <span className="font-mono font-semibold text-[#1A2E22]">
                    {editingInvoice.invoiceNumber}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6B8C74]">Project</span>
                  <span className="text-[#1A2E22]">{editingInvoice.projectName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6B8C74]">Total</span>
                  <span className="font-semibold text-[#1A2E22]">
                    ${editingInvoice.total.toLocaleString()}
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
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value)}
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
                      value={editPaidAmount}
                      onChange={(e) => setEditPaidAmount(e.target.value)}
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
                    value={editPaidDate}
                    onChange={(e) => setEditPaidDate(e.target.value)}
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
                    value={editPaymentMethod}
                    onChange={(e) => setEditPaymentMethod(e.target.value)}
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
                    value={editPaymentReference}
                    onChange={(e) => setEditPaymentReference(e.target.value)}
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
                  onClick={() => setEditingInvoice(null)}
                  className="px-4 py-2.5 rounded-lg text-sm text-[#6B8C74] hover:text-[#1A2E22]"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
