import { ImageResponse } from "next/og";

// PWA icon at the standard "large" size required by Web App Manifest spec.
// Used for splash screens and high-DPI displays. Some browsers also use
// it as the source for the home screen icon when 192 isn't enough.
export const size = { width: 512, height: 512 };
export const contentType = "image/png";

export default function Icon512() {
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
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 38,
          }}
        >
          <div style={{ width: 310, height: 50, borderRadius: 25, background: "#52B788" }} />
          <div style={{ width: 224, height: 50, borderRadius: 25, background: "#40916C" }} />
          <div style={{ width: 160, height: 50, borderRadius: 25, background: "#2D6A4F" }} />
          <div style={{ width: 268, height: 50, borderRadius: 25, background: "rgba(82, 183, 136, 0.55)" }} />
        </div>
      </div>
    ),
    { ...size }
  );
}
