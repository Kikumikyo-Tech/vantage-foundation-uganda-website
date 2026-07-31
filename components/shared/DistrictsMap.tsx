import { districts } from "@/content/impact";

// Simplified Uganda national border, traced from public-domain geographic
// boundary data (Natural Earth via johan/world.geo.json) and projected
// below with the same equirectangular transform used for the district pins,
// so everything stays in one consistent coordinate space.
const UGANDA_OUTLINE =
  "M 342.62,731.44 L 200.16,729.77 L 154.59,745.39 L 76.93,785.51 L 45.48,772.25 L 46.57,674.25 L 76.67,624.59 L 83.98,520.25 L 111.32,459.82 L 161.01,392.04 L 210.92,357.51 L 252.7,311.36 L 200.61,293.76 L 208.48,141.77 L 261.98,106.32 L 344.61,135.39 L 449.21,104.97 L 540.63,105.27 L 620.55,45.49 L 682.16,135.74 L 697.36,200.97 L 754.52,350.18 L 707.23,444.92 L 643.29,530.96 L 606.07,583.63 L 607.39,721.38 L 342.62,731.44 Z";

const VB_WIDTH = 800;
const VB_HEIGHT = 831;

// Geographic bounding box (degrees) the outline + pins were projected
// against — must match the projection used to trace UGANDA_OUTLINE above.
const BOUNDS = { minLon: 29.229466, maxLon: 35.38599, minLat: -1.793322, maxLat: 4.599885 };

function project(lat: number, lon: number): [number, number] {
  const x = ((lon - BOUNDS.minLon) / (BOUNDS.maxLon - BOUNDS.minLon)) * VB_WIDTH;
  const y = ((BOUNDS.maxLat - lat) / (BOUNDS.maxLat - BOUNDS.minLat)) * VB_HEIGHT;
  return [x, y];
}

const neighbourLabels = [
  { label: "SOUTH SUDAN", x: VB_WIDTH * 0.42, y: 24 },
  { label: "DR CONGO", x: 30, y: VB_HEIGHT * 0.42 },
  { label: "KENYA", x: VB_WIDTH - 30, y: VB_HEIGHT * 0.42 },
  { label: "RWANDA", x: 130, y: VB_HEIGHT - 20 },
  { label: "TANZANIA", x: VB_WIDTH * 0.55, y: VB_HEIGHT - 12 },
];

export function DistrictsMap() {
  return (
    <div className="grid gap-10 lg:grid-cols-[360px_1fr] lg:gap-16">
      <ul className="divide-y divide-border">
        {districts.map((district) => (
          <li key={district.name} className="flex gap-3 py-4 first:pt-0">
            <span className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-primary" aria-hidden="true" />
            <div>
              <p className="font-semibold text-foreground">{district.name}</p>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                {district.description}
              </p>
            </div>
          </li>
        ))}
      </ul>

      <div className="relative overflow-hidden rounded-2xl border border-border bg-muted">
        <svg
          viewBox={`0 0 ${VB_WIDTH} ${VB_HEIGHT}`}
          role="img"
          aria-label="Map of Uganda showing the districts where Vantage Foundation Uganda works"
          className="h-full w-full"
        >
          {neighbourLabels.map((n) => (
            <text
              key={n.label}
              x={n.x}
              y={n.y}
              textAnchor="middle"
              className="fill-muted-foreground"
              style={{ fontSize: 13, fontWeight: 600, letterSpacing: "0.08em" }}
            >
              {n.label}
            </text>
          ))}

          <path
            d={UGANDA_OUTLINE}
            className="fill-white stroke-primary/40"
            strokeWidth={2}
          />

          <text
            x={VB_WIDTH / 2}
            y={VB_HEIGHT * 0.46}
            textAnchor="middle"
            className="fill-primary/25"
            style={{ fontSize: 56, fontWeight: 700, letterSpacing: "0.15em" }}
          >
            UGANDA
          </text>

          {/* Stylised Lake Victoria — Uganda's share of the lake shore, approximate. */}
          <ellipse
            cx={470}
            cy={660}
            rx={130}
            ry={150}
            className="fill-primary/20"
            transform="rotate(-15 470 660)"
          />
          <text
            x={475}
            y={655}
            textAnchor="middle"
            className="fill-primary"
            fontStyle="italic"
            style={{ fontSize: 15 }}
          >
            Lake Victoria
          </text>

          {districts.map((district) => {
            const [x, y] = project(district.lat, district.lon);
            return (
              <g key={district.name}>
                <circle cx={x} cy={y} r={9} className="fill-primary" stroke="white" strokeWidth={2.5} />
                <text
                  x={x + 14}
                  y={y + 5}
                  className="fill-foreground"
                  style={{ fontSize: 16, fontWeight: 700, paintOrder: "stroke", stroke: "white", strokeWidth: 4 }}
                >
                  {district.name}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}
