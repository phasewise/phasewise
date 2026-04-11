import { ImageResponse } from "next/og";

// PWA icon at the standard "small" size required by Web App Manifest spec.
// Brave/Chrome use this size when installing the app on Android home screens.
export const size = { width: 192, height: 192 };
export const contentType = "image/png";

export default function Icon192() {
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
            gap: 14,
          }}
        >
          <div style={{ width: 116, height: 18, borderRadius: 9, background: "#52B788" }} />
          <div style={{ width: 84, height: 18, borderRadius: 9, background: "#40916C" }} />
          <div style={{ width: 60, height: 18, borderRadius: 9, background: "#2D6A4F" }} />
          <div style={{ width: 100, height: 18, borderRadius: 9, background: "rgba(82, 183, 136, 0.55)" }} />
        </div>
      </div>
    ),
    { ...size }
  );
}
