import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

// iOS home screen icon. iOS automatically applies a rounded-corner mask
// (about 22px on a 180px icon), so we keep the design centered and use
// the brand's deep forest green as a solid background.
export default function AppleIcon() {
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
          <div style={{ width: 110, height: 18, borderRadius: 9, background: "#52B788" }} />
          <div style={{ width: 80, height: 18, borderRadius: 9, background: "#40916C" }} />
          <div style={{ width: 56, height: 18, borderRadius: 9, background: "#2D6A4F" }} />
          <div style={{ width: 94, height: 18, borderRadius: 9, background: "rgba(82, 183, 136, 0.55)" }} />
        </div>
      </div>
    ),
    { ...size }
  );
}
