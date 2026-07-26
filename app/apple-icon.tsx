import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

/**
 * Apple touch icon — generated as a teal rounded square with a white "V".
 *
 * TODO (brand): replace with the real Vantage symbol SVG when supplied.
 * See app/icon.tsx for the replacement plan.
 */
export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#007d8a",
          borderRadius: 40,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
          fontSize: 120,
          fontWeight: 700,
          fontFamily: "Inter, system-ui, sans-serif",
        }}
      >
        V
      </div>
    ),
    { ...size }
  );
}
