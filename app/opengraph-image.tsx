import { ImageResponse } from "next/og";
import { site } from "@/content/site";

export const alt = site.name;
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "linear-gradient(135deg, #007d8a 0%, #005b7a 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: 64,
          color: "white",
          fontFamily: "Inter, system-ui, sans-serif",
        }}
      >
        <div
          style={{
            width: 80,
            height: 80,
            borderRadius: 16,
            background: "white",
            color: "#007d8a",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 48,
            fontWeight: 700,
          }}
        >
          V
        </div>
        <h1 style={{ fontSize: 64, fontWeight: 700, marginTop: 32, textAlign: "center" }}>
          {site.name}
        </h1>
        <p style={{ fontSize: 32, marginTop: 16, textAlign: "center", opacity: 0.9 }}>
          {site.tagline}
        </p>
      </div>
    ),
    {
      ...size,
    }
  );
}
