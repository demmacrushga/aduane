import { ImageResponse } from "next/og";

export const alt = "Aduane — a daily Ghanaian meal plan that fits your budget";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: 80,
          background: "#0f7a3d",
          color: "#fff8ef",
        }}
      >
        <div style={{ display: "flex", width: 120, height: 12, background: "#fcd116", marginBottom: 40 }} />
        <div style={{ fontSize: 120, fontWeight: 700, display: "flex" }}>Aduane</div>
        <div style={{ fontSize: 54, marginTop: 24, display: "flex" }}>What should I eat today?</div>
        <div style={{ fontSize: 34, marginTop: 40, color: "#fcd116", display: "flex" }}>
          Daily Ghanaian meal plans that fit your budget
        </div>
      </div>
    ),
    size,
  );
}
