import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  renderToBuffer,
} from "@react-pdf/renderer";

type InvoicePdfInput = {
  invoiceNumber: string;
  status: string;
  issueDate: Date;
  dueDate: Date;
  subtotal: number;
  tax: number;
  total: number;
  paidAmount: number;
  notes: string | null;
  lineItems: Array<{
    description: string;
    quantity: number;
    unitPrice: number;
    amount: number;
  }>;
  project: {
    name: string;
    projectNumber: string | null;
    clientName: string | null;
    clientEmail: string | null;
  };
  organization: {
    name: string;
  };
};

const BRAND_GREEN = "#2D6A4F";
const INK_900 = "#1A2E22";
const INK_700 = "#3D5C48";
const INK_500 = "#6B8C74";
const INK_300 = "#A3BEA9";
const BORDER = "#E2EBE4";
const SURFACE = "#F7F9F7";

const styles = StyleSheet.create({
  page: {
    paddingTop: 48,
    paddingBottom: 56,
    paddingHorizontal: 48,
    fontSize: 10,
    fontFamily: "Helvetica",
    color: INK_900,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 28,
  },
  firmName: {
    fontSize: 18,
    fontFamily: "Helvetica-Bold",
    color: BRAND_GREEN,
  },
  title: {
    fontSize: 26,
    fontFamily: "Helvetica-Bold",
    color: INK_900,
  },
  subtle: {
    color: INK_500,
    fontSize: 9,
  },
  metaGrid: {
    flexDirection: "row",
    gap: 24,
    marginBottom: 24,
  },
  metaBlock: { flex: 1 },
  metaLabel: {
    fontSize: 8,
    textTransform: "uppercase",
    letterSpacing: 1.2,
    color: INK_500,
    marginBottom: 4,
  },
  metaValue: { fontSize: 11, color: INK_900 },
  sectionDivider: {
    borderBottomWidth: 1,
    borderBottomColor: BORDER,
    marginVertical: 12,
  },
  table: {
    borderTopWidth: 1,
    borderTopColor: BORDER,
    marginTop: 8,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: SURFACE,
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: BORDER,
  },
  tableRow: {
    flexDirection: "row",
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderBottomWidth: 0.5,
    borderBottomColor: BORDER,
  },
  th: {
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    textTransform: "uppercase",
    letterSpacing: 1,
    color: INK_500,
  },
  td: { fontSize: 10, color: INK_900 },
  colDesc: { flex: 3 },
  colQty: { flex: 1, textAlign: "right" },
  colRate: { flex: 1, textAlign: "right" },
  colAmount: { flex: 1, textAlign: "right" },
  totals: {
    marginTop: 18,
    alignSelf: "flex-end",
    width: 240,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 4,
  },
  totalLabel: { color: INK_700, fontSize: 10 },
  totalValue: { color: INK_900, fontSize: 10 },
  grandTotalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: BORDER,
    marginTop: 4,
  },
  grandTotalLabel: {
    color: INK_900,
    fontSize: 12,
    fontFamily: "Helvetica-Bold",
  },
  grandTotalValue: {
    color: BRAND_GREEN,
    fontSize: 14,
    fontFamily: "Helvetica-Bold",
  },
  notesBlock: {
    marginTop: 30,
    padding: 12,
    backgroundColor: SURFACE,
    borderRadius: 4,
  },
  notesLabel: {
    fontSize: 8,
    textTransform: "uppercase",
    letterSpacing: 1.2,
    color: INK_500,
    marginBottom: 4,
  },
  notesText: { fontSize: 10, color: INK_700, lineHeight: 1.5 },
  footer: {
    position: "absolute",
    bottom: 28,
    left: 48,
    right: 48,
    textAlign: "center",
    fontSize: 8,
    color: INK_300,
  },
  statusPill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    fontSize: 8,
    textTransform: "uppercase",
    letterSpacing: 1,
    color: BRAND_GREEN,
    backgroundColor: "#F0FAF4",
    alignSelf: "flex-start",
    marginTop: 4,
  },
});

function money(n: number) {
  return `$${n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function formatDate(d: Date) {
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function InvoiceDocument({ data }: { data: InvoicePdfInput }) {
  const balanceDue = Math.max(0, data.total - data.paidAmount);

  return (
    <Document>
      <Page size="LETTER" style={styles.page}>
        <View style={styles.header}>
          <View>
            <Text style={styles.firmName}>{data.organization.name}</Text>
            <Text style={styles.subtle}>Powered by Phasewise</Text>
          </View>
          <View style={{ alignItems: "flex-end" }}>
            <Text style={styles.title}>INVOICE</Text>
            <Text style={styles.subtle}>#{data.invoiceNumber}</Text>
            <Text style={styles.statusPill}>{data.status.replace("_", " ")}</Text>
          </View>
        </View>

        <View style={styles.metaGrid}>
          <View style={styles.metaBlock}>
            <Text style={styles.metaLabel}>Bill to</Text>
            <Text style={styles.metaValue}>
              {data.project.clientName || "—"}
            </Text>
            {data.project.clientEmail ? (
              <Text style={styles.subtle}>{data.project.clientEmail}</Text>
            ) : null}
          </View>
          <View style={styles.metaBlock}>
            <Text style={styles.metaLabel}>Project</Text>
            <Text style={styles.metaValue}>{data.project.name}</Text>
            {data.project.projectNumber ? (
              <Text style={styles.subtle}>{data.project.projectNumber}</Text>
            ) : null}
          </View>
          <View style={styles.metaBlock}>
            <Text style={styles.metaLabel}>Issue date</Text>
            <Text style={styles.metaValue}>{formatDate(data.issueDate)}</Text>
            <Text style={{ ...styles.metaLabel, marginTop: 8 }}>Due date</Text>
            <Text style={styles.metaValue}>{formatDate(data.dueDate)}</Text>
          </View>
        </View>

        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={[styles.th, styles.colDesc]}>Description</Text>
            <Text style={[styles.th, styles.colQty]}>Qty</Text>
            <Text style={[styles.th, styles.colRate]}>Rate</Text>
            <Text style={[styles.th, styles.colAmount]}>Amount</Text>
          </View>
          {data.lineItems.map((item, i) => (
            <View style={styles.tableRow} key={i}>
              <Text style={[styles.td, styles.colDesc]}>{item.description}</Text>
              <Text style={[styles.td, styles.colQty]}>
                {item.quantity.toLocaleString()}
              </Text>
              <Text style={[styles.td, styles.colRate]}>{money(item.unitPrice)}</Text>
              <Text style={[styles.td, styles.colAmount]}>{money(item.amount)}</Text>
            </View>
          ))}
        </View>

        <View style={styles.totals}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Subtotal</Text>
            <Text style={styles.totalValue}>{money(data.subtotal)}</Text>
          </View>
          {data.tax > 0 ? (
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Tax</Text>
              <Text style={styles.totalValue}>{money(data.tax)}</Text>
            </View>
          ) : null}
          {data.paidAmount > 0 ? (
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Paid</Text>
              <Text style={styles.totalValue}>−{money(data.paidAmount)}</Text>
            </View>
          ) : null}
          <View style={styles.grandTotalRow}>
            <Text style={styles.grandTotalLabel}>
              {data.paidAmount > 0 ? "Balance due" : "Total"}
            </Text>
            <Text style={styles.grandTotalValue}>{money(balanceDue)}</Text>
          </View>
        </View>

        {data.notes ? (
          <View style={styles.notesBlock}>
            <Text style={styles.notesLabel}>Notes</Text>
            <Text style={styles.notesText}>{data.notes}</Text>
          </View>
        ) : null}

        <Text style={styles.footer}>
          Questions about this invoice? Reply to the email it was sent with. Generated by Phasewise.
        </Text>
      </Page>
    </Document>
  );
}

export async function renderInvoicePdf(data: InvoicePdfInput): Promise<Buffer> {
  return await renderToBuffer(<InvoiceDocument data={data} />);
}
