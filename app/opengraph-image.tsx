import { ImageResponse } from "next/og";

export const alt = "Aadil | Web Developer Portfolio";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "center",
          padding: 90, color: "#f4f4fb",
          background: "radial-gradient(circle at 80% 20%, #4c2a99, #07070d 60%)",
        }}
      >
        <div style={{ display: "flex", fontSize: 30, color: "#22d3ee", letterSpacing: 6 }}>WEB DEVELOPER PORTFOLIO</div>
        <div style={{ display: "flex", fontSize: 120, fontWeight: 700, marginTop: 20 }}>Aadil</div>
        <div style={{ display: "flex", fontSize: 40, color: "#a9a9c4", marginTop: 10 }}>
          React · Next.js · Node.js · Express · Razorpay · AWS
        </div>
      </div>
    ),
    size,
  );
}
