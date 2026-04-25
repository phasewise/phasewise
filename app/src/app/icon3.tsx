import { ImageResponse } from "next/og";

// Maskable PWA icon — Android adaptive icons crop the outer ~10% on each side.
// The logo is centered within the safe zone (inner 80%).
export const size = { width: 512, height: 512 };
export const contentType = "image/png";

export default function IconMaskable() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#1A2E22",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* Scale down the bars to fit safely within the ~80% safe zone */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 28,
          }}
        >
          <div style={{ width: 220, height: 36, borderRadius: 18, background: "#52B788" }} />
          <div style={{ width: 160, height: 36, borderRadius: 18, background: "#40916C" }} />
          <div style={{ width: 114, height: 36, borderRadius: 18, background: "#2D6A4F" }} />
          <div style={{ width: 190, height: 36, borderRadius: 18, background: "rgba(82, 183, 136, 0.55)" }} />
        </div>
      </div>
    ),
    { ...size }
  );
}
