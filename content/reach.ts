// Districts where Vantage Foundation Uganda has run programmes, supplied by
// the founder (2026-07-27). Positions are approximate percentage coordinates
// on a simplified schematic (NOT a traced map, NOT exact GPS) — see
// UgandaReachMap's caption and the accessible text list it renders alongside
// the visual.
export interface ReachDistrict {
  name: string;
  /** Approximate horizontal position, 0-100% (west to east). */
  x: number;
  /** Approximate vertical position, 0-100% (north to south). */
  y: number;
}

export const reachDistricts: ReachDistrict[] = [
  { name: "Gulu", x: 51, y: 22 },
  { name: "Kiryandongo", x: 48, y: 38 },
  { name: "Kayunga", x: 61, y: 60 },
  { name: "Kampala", x: 56, y: 67 },
  { name: "Jinja", x: 67, y: 65 },
  { name: "Namutumba", x: 82, y: 58 },
  { name: "Bushenyi", x: 11, y: 83 },
];
