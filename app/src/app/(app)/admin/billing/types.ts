// Shared types for the AdminBilling surface and its extracted child
// components (SendInvoiceModal, PaymentUpdateModal, NewInvoiceForm).
// Single source of truth so a schema change to Invoice doesn't drift
// between files.

export type LineItem = {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  amount: number;
};

export type Invoice = {
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
  clientEmail: string | null;
  lineItems: LineItem[];
};

// Status options used by the payment update modal + the inline status
// dropdown on each invoice row. Kept here so a new status (e.g.
// "PARTIALLY_PAID") only needs adding in one place.
export const STATUS_OPTIONS = [
  { value: "DRAFT", label: "Draft" },
  { value: "SENT", label: "Sent" },
  { value: "PAID", label: "Paid" },
  { value: "PARTIALLY_PAID", label: "Partially Paid" },
  { value: "OVERDUE", label: "Overdue" },
  { value: "VOID", label: "Void" },
];
