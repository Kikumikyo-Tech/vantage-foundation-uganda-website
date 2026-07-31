import { readFileSync } from "fs";
import { join } from "path";
import { ImageResponse } from "next/og";
import { site } from "@/content/site";

export const alt = site.name;
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

const iconBase64 = readFileSync(
  join(process.cwd(), "public/images/brand/vantage-icon-512.png")
).toString("base64");

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "linear-gradient(135deg, #000000 0%, #0d7280 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: 64,
          color: "white",
          fontFamily: "Fira Sans, system-ui, sans-serif",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element -- next/og requires a plain <img>, not next/image */}
        <img
          src={`data:image/png;base64,${iconBase64}`}
          width={112}
          height={112}
          alt=""
        />
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
