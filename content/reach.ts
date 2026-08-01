// Districts where Vantage Foundation Uganda has run programmes, supplied by
// the founder (2026-07-27). Positions are approximate percentage coordinates
// on a simplified schematic (NOT a traced map, NOT exact GPS) — see
// UgandaReachMap's caption and the accessible text list it renders alongside
// the visual.
//
// `projectSlugs` links a district to real, published projects (content/projects.ts)
// with confirmed activity there — curated by hand rather than string-matched
// against each project's free-text `location` field, since those don't map
// cleanly to district names (e.g. "Kasaale, Uganda" isn't one of the districts
// below). An empty/omitted list means the area is reached but has no single
// dedicated project page yet — render that honestly, don't force a link.
//
// Kalangala was added 2026-07-31: it's the location of the published
// "orphanage-relief" project and appears in content/impact.ts's `regions`,
// but was missing from this file. Flagged for founder confirmation in case
// its absence here was deliberate — its x/y position is an estimate (south
// of Kampala, in Lake Victoria) rather than a founder-supplied coordinate
// like the other seven.
export interface ReachDistrict {
  name: string;
  /** Approximate horizontal position, 0-100% (west to east). */
  x: number;
  /** Approximate vertical position, 0-100% (north to south). */
  y: number;
  /** Published project slugs with confirmed activity in this district. */
  projectSlugs?: string[];
}

// x/y refined 2026-07-31 from real district coordinates (WGS84, sourced and
// verified against gazetteer data) projected equirectangularly onto the same
// 0-100 frame as the traced outline in UgandaReachMap.tsx — chosen because it
// lines up almost exactly with the founder-supplied estimates above (all
// within a few percentage points), so the refinement doesn't relocate any
// district, just lets the pins sit precisely on the new outline.
export const reachDistricts: ReachDistrict[] = [
  { name: "Gulu", x: 49.9, y: 28.4 },
  { name: "Kiryandongo", x: 47.3, y: 41.4 },
  { name: "Kayunga", x: 59.7, y: 61.0 },
  { name: "Kampala", x: 54.5, y: 66.5, projectSlugs: ["mental-health-financial-literacy-workshops"] },
  { name: "Jinja", x: 64.6, y: 65.3, projectSlugs: ["orphanage-relief"] },
  { name: "Namutumba", x: 72.4, y: 58.9 },
  { name: "Bushenyi", x: 15.6, y: 80.4, projectSlugs: ["mental-health-financial-literacy-workshops"] },
  { name: "Kalangala", x: 49.8, y: 77.0, projectSlugs: ["orphanage-relief"] },
];
