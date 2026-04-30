import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  renderToBuffer,
} from "@react-pdf/renderer";

export type MweloPdfInput = {
  itemName: string;
  projectName: string;
  projectNumber: string | null;
  organizationName: string;
  region: string;
  eto: number;
  totalLandscapeArea: number;
  specialLandscapeArea: number;
  mawa: number;
  etwu: number;
  passes: boolean;
  hydrozones: Array<{
    name: string;
    area: number;
    plantFactor: string;
    irrigationEfficiency: string;
    etwu: number;
  }>;
  generatedAt: Date;
};

const BRAND_GREEN = "#2D6A4F";
const BRAND_GREEN_MID = "#40916C";
const BRAND_GREEN_LIGHT = "#52B788";
const INK_900 = "#1A2E22";
const INK_700 = "#3D5C48";
const INK_500 = "#6B8C74";
const INK_300 = "#A3BEA9";
const BORDER = "#E2EBE4";
const SURFACE = "#F7F9F7";
const PASS_BG = "#F0FAF4";
const FAIL_BG = "#FEF2F2";
const FAIL_TEXT = "#B91C1C";
const FAIL_BORDER = "#FECACA";
const BLUE_BG = "#EFF6FF";
const BLUE_TEXT = "#1E40AF";
const BLUE_BORDER = "#BFDBFE";

const styles = StyleSheet.create({
  page: {
    paddingTop: 44,
    paddingBottom: 56,
    paddingHorizontal: 44,
    fontSize: 10,
    fontFamily: "Helvetica",
    color: INK_900,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    paddingBottom: 10,
    marginBottom: 18,
    borderBottomWidth: 2,
    borderBottomColor: BRAND_GREEN,
  },
  brandRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  // Stacked phase bars (decreasing widths) acting as the logomark.
  phaseBar1: {
    width: 16,
    height: 3,
    backgroundColor: BRAND_GREEN_LIGHT,
    marginBottom: 2,
    borderRadius: 1,
  },
  phaseBar2: {
    width: 12,
    height: 3,
    backgroundColor: BRAND_GREEN_MID,
    marginBottom: 2,
    borderRadius: 1,
  },
  phaseBar3: {
    width: 14,
    height: 3,
    backgroundColor: BRAND_GREEN,
    borderRadius: 1,
  },
  brandWordmark: {
    fontSize: 18,
    fontFamily: "Helvetica-Bold",
    color: INK_900,
    letterSpacing: -0.3,
  },
  brandWordmarkLight: {
    fontFamily: "Helvetica",
    color: BRAND_GREEN,
  },
  reportLabel: {
    fontSize: 7,
    textTransform: "uppercase",
    letterSpacing: 1.5,
    fontFamily: "Helvetica-Bold",
    color: BRAND_GREEN_MID,
    textAlign: "right",
    marginBottom: 2,
  },
  reportSub: {
    fontSize: 8,
    color: INK_500,
    textAlign: "right",
  },
  metaGrid: {
    flexDirection: "row",
    gap: 24,
    marginBottom: 18,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: BORDER,
  },
  metaBlock: { flex: 1 },
  metaLabel: {
    fontSize: 7,
    textTransform: "uppercase",
    letterSpacing: 1.2,
    color: INK_500,
    marginBottom: 3,
  },
  metaValue: { fontSize: 10, fontFamily: "Helvetica-Bold", color: INK_900 },
  itemTitle: {
    fontSize: 14,
    fontFamily: "Helvetica-Bold",
    color: INK_900,
    marginBottom: 14,
  },
  cardsRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 16,
  },
  card: {
    flex: 1,
    padding: 8,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: BORDER,
    backgroundColor: SURFACE,
  },
  cardLabel: {
    fontSize: 7,
    textTransform: "uppercase",
    letterSpacing: 1,
    fontFamily: "Helvetica-Bold",
    color: INK_500,
    marginBottom: 3,
  },
  cardValue: {
    fontSize: 12,
    fontFamily: "Helvetica-Bold",
    color: INK_900,
  },
  cardSub: {
    fontSize: 7,
    color: INK_300,
    marginTop: 1,
  },
  cardBlue: {
    backgroundColor: BLUE_BG,
    borderColor: BLUE_BORDER,
  },
  cardBlueLabel: { color: BLUE_TEXT },
  cardBlueValue: { color: BLUE_TEXT },
  cardPass: {
    backgroundColor: PASS_BG,
    borderColor: BRAND_GREEN_LIGHT,
  },
  cardPassLabel: { color: BRAND_GREEN },
  cardPassValue: { color: BRAND_GREEN },
  cardFail: {
    backgroundColor: FAIL_BG,
    borderColor: FAIL_BORDER,
  },
  cardFailLabel: { color: FAIL_TEXT },
  cardFailValue: { color: FAIL_TEXT },
  resultBanner: {
    padding: 10,
    borderRadius: 4,
    borderWidth: 1,
    marginBottom: 16,
  },
  resultBannerPass: {
    backgroundColor: PASS_BG,
    borderColor: BRAND_GREEN_LIGHT,
  },
  resultBannerFail: {
    backgroundColor: FAIL_BG,
    borderColor: FAIL_BORDER,
  },
  resultText: {
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
  },
  resultTextPass: { color: BRAND_GREEN },
  resultTextFail: { color: FAIL_TEXT },
  resultDetail: {
    fontSize: 9,
    marginTop: 3,
  },
  resultDetailPass: { color: INK_500 },
  resultDetailFail: { color: FAIL_TEXT },
  sectionTitle: {
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    color: INK_900,
    marginBottom: 6,
  },
  table: {
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 4,
    overflow: "hidden",
    marginBottom: 16,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: SURFACE,
    paddingVertical: 6,
    paddingHorizontal: 6,
    borderBottomWidth: 1,
    borderBottomColor: BORDER,
  },
  tableRow: {
    flexDirection: "row",
    paddingVertical: 6,
    paddingHorizontal: 6,
    borderBottomWidth: 0.5,
    borderBottomColor: BORDER,
  },
  tableFooter: {
    flexDirection: "row",
    paddingVertical: 6,
    paddingHorizontal: 6,
    backgroundColor: SURFACE,
    borderTopWidth: 1,
    borderTopColor: BORDER,
  },
  th: {
    fontSize: 7,
    fontFamily: "Helvetica-Bold",
    textTransform: "uppercase",
    letterSpacing: 0.8,
    color: INK_500,
  },
  td: { fontSize: 9, color: INK_900 },
  tdMuted: { fontSize: 9, color: INK_500 },
  colZone: { flex: 2 },
  colArea: { flex: 1, textAlign: "right" },
  colPf: { flex: 1.4, textAlign: "right" },
  colIe: { flex: 1.6, textAlign: "right" },
  colEtwu: { flex: 1.4, textAlign: "right" },
  formulasBox: {
    padding: 10,
    backgroundColor: SURFACE,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: BORDER,
  },
  formulasTitle: {
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    color: INK_700,
    marginBottom: 4,
  },
  formulasLine: {
    fontSize: 8,
    color: INK_500,
    marginBottom: 2,
  },
  formulasFootnote: {
    fontSize: 7,
    color: INK_300,
    marginTop: 4,
  },
  disclaimer: {
    marginTop: 12,
    fontSize: 7,
    color: INK_300,
    lineHeight: 1.4,
  },
  footer: {
    position: "absolute",
    bottom: 22,
    left: 44,
    right: 44,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: BORDER,
    flexDirection: "row",
    justifyContent: "space-between",
    fontSize: 7,
    color: INK_500,
  },
});

function fmtNum(n: number) {
  return Math.round(n).toLocaleString("en-US");
}

function fmtDate(d: Date) {
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function MweloDocument({ data }: { data: MweloPdfInput }) {
  const ratio = data.mawa > 0 ? (data.etwu / data.mawa) * 100 : 0;

  return (
    <Document>
      <Page size="LETTER" style={styles.page}>
        {/* Branded letterhead */}
        <View style={styles.header}>
          <View style={styles.brandRow}>
            <View>
              <View style={styles.phaseBar1} />
              <View style={styles.phaseBar2} />
              <View style={styles.phaseBar3} />
            </View>
            <Text style={styles.brandWordmark}>
              phase<Text style={styles.brandWordmarkLight}>wise</Text>
            </Text>
          </View>
          <View>
            <Text style={styles.reportLabel}>MWELO Compliance Report</Text>
            <Text style={styles.reportSub}>{data.organizationName} · phasewise.io</Text>
          </View>
        </View>

        {/* Project / region / date row */}
        <View style={styles.metaGrid}>
          <View style={styles.metaBlock}>
            <Text style={styles.metaLabel}>Project</Text>
            <Text style={styles.metaValue}>{data.projectName}</Text>
            {data.projectNumber ? (
              <Text style={{ fontSize: 8, color: INK_500, marginTop: 2 }}>
                {data.projectNumber}
              </Text>
            ) : null}
          </View>
          <View style={styles.metaBlock}>
            <Text style={styles.metaLabel}>Climate Region</Text>
            <Text style={styles.metaValue}>{data.region}</Text>
            <Text style={{ fontSize: 8, color: INK_500, marginTop: 2 }}>
              ETo {data.eto} in/yr
            </Text>
          </View>
          <View style={styles.metaBlock}>
            <Text style={styles.metaLabel}>Report Date</Text>
            <Text style={styles.metaValue}>{fmtDate(data.generatedAt)}</Text>
          </View>
        </View>

        <Text style={styles.itemTitle}>{data.itemName}</Text>

        {/* Summary cards */}
        <View style={styles.cardsRow}>
          <View style={styles.card}>
            <Text style={styles.cardLabel}>ETo</Text>
            <Text style={styles.cardValue}>{data.eto} in/yr</Text>
            <Text style={styles.cardSub}>{data.region}</Text>
          </View>
          <View style={styles.card}>
            <Text style={styles.cardLabel}>Total Area</Text>
            <Text style={styles.cardValue}>{fmtNum(data.totalLandscapeArea)} sf</Text>
            {data.specialLandscapeArea > 0 ? (
              <Text style={styles.cardSub}>SLA: {fmtNum(data.specialLandscapeArea)} sf</Text>
            ) : null}
          </View>
          <View style={[styles.card, styles.cardBlue]}>
            <Text style={[styles.cardLabel, styles.cardBlueLabel]}>MAWA</Text>
            <Text style={[styles.cardValue, styles.cardBlueValue]}>
              {fmtNum(data.mawa)} gal/yr
            </Text>
            <Text style={styles.cardSub}>Maximum allowable</Text>
          </View>
          <View style={[styles.card, data.passes ? styles.cardPass : styles.cardFail]}>
            <Text
              style={[
                styles.cardLabel,
                data.passes ? styles.cardPassLabel : styles.cardFailLabel,
              ]}
            >
              ETWU
            </Text>
            <Text
              style={[
                styles.cardValue,
                data.passes ? styles.cardPassValue : styles.cardFailValue,
              ]}
            >
              {fmtNum(data.etwu)} gal/yr
            </Text>
            <Text style={styles.cardSub}>
              {data.passes ? "Within MAWA" : "Exceeds MAWA"}
            </Text>
          </View>
        </View>

        {/* Pass/fail banner */}
        <View
          style={[
            styles.resultBanner,
            data.passes ? styles.resultBannerPass : styles.resultBannerFail,
          ]}
        >
          <Text
            style={[
              styles.resultText,
              data.passes ? styles.resultTextPass : styles.resultTextFail,
            ]}
          >
            {data.passes
              ? "Compliant — ETWU is within MAWA"
              : "Non-compliant — ETWU exceeds MAWA"}
          </Text>
          <Text
            style={[
              styles.resultDetail,
              data.passes ? styles.resultDetailPass : styles.resultDetailFail,
            ]}
          >
            ETWU is {ratio.toFixed(0)}% of MAWA.
            {!data.passes
              ? " Reduce plant factors, increase irrigation efficiency, or reduce landscape area."
              : ""}
          </Text>
        </View>

        {/* Hydrozone breakdown */}
        <Text style={styles.sectionTitle}>Hydrozone Breakdown</Text>
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={[styles.th, styles.colZone]}>Zone</Text>
            <Text style={[styles.th, styles.colArea]}>Area (sf)</Text>
            <Text style={[styles.th, styles.colPf]}>Plant Factor</Text>
            <Text style={[styles.th, styles.colIe]}>Irrigation</Text>
            <Text style={[styles.th, styles.colEtwu]}>ETWU (gal/yr)</Text>
          </View>
          {data.hydrozones.map((z, i) => (
            <View style={styles.tableRow} key={i}>
              <Text style={[styles.td, styles.colZone]}>{z.name}</Text>
              <Text style={[styles.tdMuted, styles.colArea]}>{fmtNum(z.area)}</Text>
              <Text style={[styles.tdMuted, styles.colPf]}>{z.plantFactor}</Text>
              <Text style={[styles.tdMuted, styles.colIe]}>{z.irrigationEfficiency}</Text>
              <Text style={[styles.td, styles.colEtwu]}>{fmtNum(z.etwu)}</Text>
            </View>
          ))}
          <View style={styles.tableFooter}>
            <Text
              style={[
                { fontSize: 9, fontFamily: "Helvetica-Bold", color: INK_900 },
                styles.colZone,
              ]}
            >
              Total
            </Text>
            <Text
              style={[
                { fontSize: 9, fontFamily: "Helvetica-Bold", color: INK_900 },
                styles.colArea,
              ]}
            >
              {fmtNum(data.totalLandscapeArea)}
            </Text>
            <Text style={[styles.tdMuted, styles.colPf]} />
            <Text style={[styles.tdMuted, styles.colIe]} />
            <Text
              style={[
                { fontSize: 9, fontFamily: "Helvetica-Bold", color: INK_900 },
                styles.colEtwu,
              ]}
            >
              {fmtNum(data.etwu)}
            </Text>
          </View>
        </View>

        {/* Formulas */}
        <View style={styles.formulasBox}>
          <Text style={styles.formulasTitle}>Formulas (per MWELO, Title 23 CCR)</Text>
          <Text style={styles.formulasLine}>
            MAWA = (ETo × ETAF × LA × 0.62) + (ETo × SLA × 0.62)
          </Text>
          <Text style={styles.formulasLine}>
            ETWU = sum of [(ETo × PF × HA × 0.62) / IE] for each hydrozone
          </Text>
          <Text style={styles.formulasFootnote}>
            ETo = Reference Evapotranspiration ({data.eto} in/yr for {data.region}) ·
            ETAF = 0.55 (residential) · PF = Plant Factor (WUCOLS) ·
            IE = Irrigation Efficiency · HA = Hydrozone Area · SLA = Special Landscape Area ·
            0.62 = in/sf to gal/sf conversion
          </Text>
        </View>

        <Text style={styles.disclaimer}>
          Generated by Phasewise MWELO Calculator on {fmtDate(data.generatedAt)}.
          Computed per 23 CCR Div 2 Ch 2.7 §§ 490–495 (2015 MWELO update). For reference only —
          review by a licensed landscape architect required before submission.
        </Text>

        <View style={styles.footer} fixed>
          <Text>phasewise.io · Project management for landscape architecture firms</Text>
          <Text>{fmtDate(data.generatedAt)}</Text>
        </View>
      </Page>
    </Document>
  );
}

export async function renderMweloPdf(data: MweloPdfInput): Promise<Buffer> {
  return await renderToBuffer(<MweloDocument data={data} />);
}
