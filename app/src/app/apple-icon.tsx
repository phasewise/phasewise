import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#1A2E22",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "center",
          padding: "32px 38px",
          gap: 14,
        }}
      >
        <div
          style={{
            width: 112,
            height: 16,
            borderRadius: 8,
            background: "#52B788",
          }}
        />
        <div
          style={{
            width: 82,
            height: 16,
            borderRadius: 8,
            background: "#40916C",
          }}
        />
        <div
          style={{
            width: 60,
            height: 16,
            borderRadius: 8,
            background: "#2D6A4F",
          }}
        />
        <div
          style={{
            width: 96,
            height: 16,
            borderRadius: 8,
            background: "rgba(82, 183, 136, 0.6)",
          }}
        />
      </div>
    ),
    { ...size }
  );
}
