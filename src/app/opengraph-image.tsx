import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "The Falcon — Rishabh Kumar, Front-End Technical Lead";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#1b2333",
          padding: "64px 80px",
          fontFamily: "monospace",
        }}
      >
        {/* Top row */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <span
            style={{
              color: "#e2e8f0",
              fontSize: "16px",
              letterSpacing: "4px",
              fontWeight: "bold",
            }}
          >
            THEFALCON.DEV
          </span>
          <span style={{ color: "#3d5166", fontSize: "16px", letterSpacing: "2px" }}>
            // REV. 2026
          </span>
        </div>

        {/* Main content */}
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          <span
            style={{
              color: "#6b8faa",
              fontSize: "14px",
              letterSpacing: "4px",
            }}
          >
            FRONTEND TECHNICAL LEAD // PRODUCT, PLATFORM, DELIVERY
          </span>
          <div
            style={{
              color: "#e2e8f0",
              fontSize: "72px",
              fontWeight: "bold",
              lineHeight: 1.05,
              letterSpacing: "-2px",
              fontFamily: "sans-serif",
            }}
          >
            Leading teams
            <br />
            at scale.
          </div>
          <div
            style={{
              color: "#8aa6be",
              fontSize: "22px",
              lineHeight: 1.5,
              maxWidth: "680px",
            }}
          >
            Rishabh Kumar — 8+ years orchestrating cross-functional teams to deliver
            high-performance applications.
          </div>
        </div>

        {/* Bottom row */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", gap: "32px" }}>
            {["9+ YRS EXP", "40% PERF GAIN", "35% FASTER DELIVERY"].map((stat) => (
              <span
                key={stat}
                style={{
                  color: "#4a6275",
                  fontSize: "12px",
                  letterSpacing: "3px",
                }}
              >
                {stat}
              </span>
            ))}
          </div>
          <div
            style={{
              backgroundColor: "#e2e8f0",
              color: "#1b2333",
              padding: "10px 20px",
              fontSize: "12px",
              letterSpacing: "3px",
              fontWeight: "bold",
            }}
          >
            OPEN TO NEW OPPORTUNITIES
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    },
  );
}
