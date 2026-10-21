import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: 72,
          background: "#EEF1F6",
          color: "#14161C",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ fontSize: 42, fontWeight: 800 }}>P.</div>
        <div style={{ fontSize: 64, fontWeight: 800, letterSpacing: -2, marginTop: 18 }}>
          Code by day. Light by dusk.
        </div>
        <div style={{ fontSize: 28, marginTop: 24, color: "#5D6472" }}>
          CODE × CAPTURE · Pun
        </div>
      </div>
    ),
    { ...size }
  );
}
