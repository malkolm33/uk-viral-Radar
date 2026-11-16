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
          background: "linear-gradient(135deg, #E0F2FE 0%, #CCFBF1 100%)",
          border: "10px solid #14B8A6",
        }}
      >
        <div
          style={{
            display: "flex",
            width: 150,
            height: 150,
            borderRadius: "50%",
            border: "3px solid rgba(20,184,166,0.45)",
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
        <div style={{ display: "flex", fontSize: 68, fontWeight: 800, color: "#0F172A" }}>
          UK Viral Radar
        </div>
        <div style={{ display: "flex", fontSize: 30, color: "#0F766E", marginTop: 18 }}>
          Spot Trending Products Before Your Competitors
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}