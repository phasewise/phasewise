import { ImageResponse } from "next/og";

// Browser tab + small PWA icon (Next.js auto-generates this as a PNG
// at the size we declare). 32x32 is the standard browser tab favicon.
export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
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
            gap: 2,
          }}
        >
          <div style={{ width: 20, height: 3, borderRadius: 1.5, background: "#52B788" }} />
          <div style={{ width: 14, height: 3, borderRadius: 1.5, background: "#40916C" }} />
          <div style={{ width: 10, height: 3, borderRadius: 1.5, background: "#2D6A4F" }} />
          <div style={{ width: 16, height: 3, borderRadius: 1.5, background: "rgba(82, 183, 136, 0.55)" }} />
        </div>
      </div>
    ),
    { ...size }
  );
}
