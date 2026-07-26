/**
 * Vantage Foundation Uganda — Design Tokens (TypeScript source of truth).
 *
 * Mirrors the CSS custom properties in app/globals.css so that JS-side code
 * (brand-guide page, charts, email templates, OG image generation) can reference
 * the same values without duplicating literals.
 *
 * When updating the palette, update BOTH this file and app/globals.css.
 */

export const brandColors = {
  deepTeal: "#007d8a",
  brightAqua: "#1cc7d6",
  oceanBlue: "#005b7a",
  darkNavy: "#08233a",
  white: "#ffffff",
  charcoal: "#232323",
} as const;

export const semanticColors = {
  background: "#ffffff",
  foreground: "#08233a",
  primary: "#007d8a",
  primaryDark: "#005b7a",
  primaryLight: "#1cc7d6",
  accent: "#f59e0b",
  muted: "#f4f7f9",
  mutedForeground: "#4a6072",
  border: "#dce5ea",
  surface: "#f4f7f9",
  surfaceStrong: "#e8eef2",
} as const;

export const statusColors = {
  success: { fg: "#15803d", bg: "#dcfce7", text: "#166534" },
  warning: { fg: "#b45309", bg: "#fef3c7", text: "#78350f" },
  destructive: { fg: "#b91c1c", bg: "#fee2e2", text: "#7f1d1d" },
  info: { fg: "#005b7a", bg: "#e0f2fe", text: "#0c4a6e" },
} as const;

export type ProgrammeId =
  | "health"
  | "education"
  | "water"
  | "humanitarian"
  | "research"
  | "environment"
  | "youth"
  | "alert";

export interface ProgrammeToken {
  id: ProgrammeId;
  label: string;
  hex: string;
  /** Tailwind utility class token (e.g. "programme-health" → bg-programme-health) */
  token: string;
  /** Accessible text colour to pair on top of the programme colour (white or navy). */
  onColor: string;
}

export const programmeColours: Record<ProgrammeId, ProgrammeToken> = {
  health: { id: "health", label: "Health", hex: "#0f9d58", token: "programme-health", onColor: "#ffffff" },
  education: { id: "education", label: "Education", hex: "#2563eb", token: "programme-education", onColor: "#ffffff" },
  water: { id: "water", label: "Water & WASH", hex: "#38bdf8", token: "programme-water", onColor: "#08233a" },
  humanitarian: { id: "humanitarian", label: "Humanitarian Assistance", hex: "#f97316", token: "programme-humanitarian", onColor: "#ffffff" },
  research: { id: "research", label: "Research", hex: "#7c3aed", token: "programme-research", onColor: "#ffffff" },
  environment: { id: "environment", label: "Environment & Agriculture", hex: "#15803d", token: "programme-environment", onColor: "#ffffff" },
  youth: { id: "youth", label: "Youth Empowerment", hex: "#06b6d4", token: "programme-youth", onColor: "#08233a" },
  alert: { id: "alert", label: "Emergency Alert", hex: "#dc2626", token: "programme-alert", onColor: "#ffffff" },
};

/**
 * Maps an area-of-work id from content/areas.ts to a programme accent token.
 * Falls back to primary teal for unmapped areas.
 */
export function programmeTokenForArea(areaId: string): ProgrammeToken {
  const map: Record<string, ProgrammeId> = {
    health: "health",
    education: "education",
    water: "water",
    humanitarian: "humanitarian",
    "youth-leadership": "youth",
  };
  const id = map[areaId];
  return id ? programmeColours[id] : { ...programmeColours.health, hex: brandColors.deepTeal, token: "primary" };
}

/**
 * Maps a ProjectCategory string (from content/projects.ts) to a programme
 * accent token. Falls back to primary teal for unmapped categories.
 */
export function programmeTokenForCategory(category: string): ProgrammeToken {
  const map: Record<string, ProgrammeId> = {
    Health: "health",
    Education: "education",
    "Water & Sanitation": "water",
    "Humanitarian Aid": "humanitarian",
    "Youth Leadership": "youth",
  };
  const id = map[category];
  return id ? programmeColours[id] : { ...programmeColours.health, hex: brandColors.deepTeal, token: "primary" };
}

export const typography = {
  fontFamily: "var(--font-inter), system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  scale: {
    display: { size: "3.5rem", lineHeight: 1.1, weight: 700, tracking: "-0.02em" },
    h1: { size: "2.5rem", lineHeight: 1.15, weight: 700, tracking: "-0.02em" },
    h2: { size: "1.875rem", lineHeight: 1.2, weight: 600, tracking: "-0.01em" },
    h3: { size: "1.5rem", lineHeight: 1.3, weight: 600, tracking: "0" },
    h4: { size: "1.25rem", lineHeight: 1.4, weight: 600, tracking: "0" },
    bodyLg: { size: "1.125rem", lineHeight: 1.6, weight: 400, tracking: "0" },
    body: { size: "1rem", lineHeight: 1.625, weight: 400, tracking: "0" },
    bodySm: { size: "0.875rem", lineHeight: 1.5, weight: 400, tracking: "0" },
    caption: { size: "0.75rem", lineHeight: 1.4, weight: 400, tracking: "0.02em" },
    overline: { size: "0.75rem", lineHeight: 1.4, weight: 600, tracking: "0.08em" },
  },
} as const;

export const spacing = {
  "1": "0.25rem", "2": "0.5rem", "3": "0.75rem", "4": "1rem",
  "6": "1.5rem", "8": "2rem", "12": "3rem", "16": "4rem",
  "20": "5rem", "24": "6rem", "32": "8rem",
} as const;

export const radii = {
  sm: "0.375rem", md: "0.5rem", lg: "0.75rem", xl: "1rem", "2xl": "1.5rem", full: "9999px",
} as const;

export const shadows = {
  sm: "0 1px 2px 0 rgb(8 35 58 / 0.05)",
  md: "0 4px 6px -1px rgb(8 35 58 / 0.08), 0 2px 4px -2px rgb(8 35 58 / 0.06)",
  lg: "0 10px 15px -3px rgb(8 35 58 / 0.1), 0 4px 6px -4px rgb(8 35 58 / 0.05)",
  xl: "0 20px 25px -5px rgb(8 35 58 / 0.12), 0 8px 10px -6px rgb(8 35 58 / 0.05)",
} as const;

export const breakpoints = {
  sm: 640, md: 768, lg: 1024, xl: 1280, "2xl": 1536,
} as const;

export const imageRatios = {
  hero: "16 / 9",
  feature: "3 / 2",
  card: "4 / 3",
  square: "1 / 1",
  portrait: "4 / 5",
  socialPortrait: "9 / 16",
  socialSquare: "1 / 1",
  socialLandscape: "1.91 / 1",
  thumbnail: "1 / 1",
} as const;

export const zScale = {
  base: 0, dropdown: 1000, sticky: 1020, header: 1030, overlay: 1040, modal: 1050, toast: 1080,
} as const;

/** Approximate WCAG contrast ratio between two hex colours. */
export function contrastRatio(fg: string, bg: string): number {
  const lum = (hex: string) => {
    const m = hex.replace("#", "");
    const r = parseInt(m.slice(0, 2), 16) / 255;
    const g = parseInt(m.slice(2, 4), 16) / 255;
    const b = parseInt(m.slice(4, 6), 16) / 255;
    const lin = (c: number) => (c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4));
    return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
  };
  const l1 = lum(fg);
  const l2 = lum(bg);
  const [hi, lo] = l1 > l2 ? [l1, l2] : [l2, l1];
  return (hi + 0.05) / (lo + 0.05);
}
