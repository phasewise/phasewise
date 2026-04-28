import { ImageResponse } from "next/og";

// Auto-generated Open Graph image for the home page. Next.js ships this
// at /opengraph-image and surfaces the URL in og:image / twitter:image
// metadata for any page that doesn't override it.
export const alt =
  "Phasewise — Project management built for landscape architects";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 88px",
          background:
            "linear-gradient(135deg, #0D2218 0%, #1A2E22 60%, #2D6A4F 100%)",
          color: "white",
          fontFamily: "system-ui, -apple-system, sans-serif",
        }}
      >
        {/* Brand mark */}
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
            <div style={{ width: 44, height: 8, borderRadius: 2, background: "#52B788" }} />
            <div style={{ width: 32, height: 8, borderRadius: 2, background: "#40916C" }} />
            <div style={{ width: 40, height: 8, borderRadius: 2, background: "#2D6A4F" }} />
          </div>
          <div style={{ display: "flex", fontSize: 40, fontWeight: 600, letterSpacing: -1 }}>
            <span>phase</span>
            <span style={{ fontWeight: 300, color: "#52B788" }}>wise</span>
          </div>
        </div>

        {/* Headline */}
        <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              fontSize: 72,
              fontWeight: 400,
              lineHeight: 1.05,
              letterSpacing: -2,
              maxWidth: 920,
            }}
          >
            <span>Focus on the design.</span>
            <span style={{ color: "#52B788" }}>We&apos;ll handle everything else.</span>
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 28,
              color: "rgba(255,255,255,0.6)",
              lineHeight: 1.4,
              maxWidth: 880,
            }}
          >
            Project management, budgets, time tracking, submittals, MWELO &amp; profitability — built for landscape architecture firms.
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: 22,
            color: "rgba(255,255,255,0.45)",
          }}
        >
          <span>phasewise.io</span>
          <span style={{ color: "#52B788", fontWeight: 600 }}>14-day free trial</span>
        </div>
      </div>
    ),
    { ...size }
  );
}
