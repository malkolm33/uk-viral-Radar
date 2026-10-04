import { ImageResponse } from "next/og";


export const alt = "UK Viral Radar - Spot Trending Products Before Your Competitors";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#0B1220",
        }}
      >
        <div
          style={{
            display: "flex",
            width: 150,
            height: 150,
            borderRadius: "50%",
            border: "2px solid rgba(56,189,248,0.35)",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 36,
          }}
        >
          <div
            style={{
              display: "flex",
              width: 80,
              height: 80,
              borderRadius: "50%",
              background: "linear-gradient(135deg, #2563EB, #38BDF8)",
            }}
          />
        </div>
        <div style={{ display: "flex", fontSize: 68, fontWeight: 800, color: "#FFFFFF" }}>
          UK Viral Radar
        </div>
        <div style={{ display: "flex", fontSize: 30, color: "#93A3B8", marginTop: 18 }}>
          Spot Trending Products Before Your Competitors
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}