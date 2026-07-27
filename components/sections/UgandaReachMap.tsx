import { MapPin } from "lucide-react";
import { reachDistricts } from "@/content/reach";
import { Container } from "@/components/shared/Container";
import { SectionHeader } from "@/components/shared/SectionHeader";

/**
 * A simplified schematic of where Vantage Foundation Uganda works — not a
 * traced map and not exact GPS coordinates. The pin positions in
 * content/reach.ts are approximate, and the accessible text list below
 * carries the same information for anyone who can't (or doesn't want to)
 * interpret the visual.
 */
export function UgandaReachMap() {
  return (
    <section className="bg-white py-16 md:py-24 lg:py-32">
      <Container>
        <SectionHeader
          eyebrow="Where We Work"
          title="Our Reach Across Uganda"
          description="From urban centres to rural communities, we work where need meets opportunity."
        />

        <div className="mt-12 grid gap-8 lg:grid-cols-[1.3fr_1fr] lg:items-center">
          <div
            className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-border bg-surface"
            role="img"
            aria-label={`Simplified schematic showing Vantage Foundation Uganda's approximate programme locations: ${reachDistricts
              .map((d) => d.name)
              .join(", ")}. Not to scale.`}
          >
            {reachDistricts.map((d) => (
              <div
                key={d.name}
                className="group absolute -translate-x-1/2 -translate-y-full"
                style={{ left: `${d.x}%`, top: `${d.y}%` }}
                aria-hidden="true"
              >
                <MapPin className="h-6 w-6 text-primary drop-shadow" fill="var(--bright-aqua)" />
                <span className="absolute left-1/2 top-full mt-1 -translate-x-1/2 whitespace-nowrap rounded-md bg-navy px-2 py-1 text-xs font-medium text-white opacity-0 shadow-lg transition-opacity group-hover:opacity-100">
                  {d.name}
                </span>
              </div>
            ))}
            <p className="absolute bottom-2 right-3 text-xs text-muted-foreground">
              Simplified schematic — not to scale
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-primary">
              Districts we&rsquo;ve reached
            </h3>
            <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-2">
              {reachDistricts.map((d) => (
                <li key={d.name} className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                  {d.name}
                </li>
              ))}
            </ul>
            <p className="mt-6 text-sm text-muted-foreground">
              Markers show approximate programme locations, not exact GPS
              coordinates.
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}
