"use client";

import { useId, useState } from "react";
import Link from "next/link";
import { MapPin } from "lucide-react";
import { reachDistricts, type ReachDistrict } from "@/content/reach";
import { getProjectBySlug } from "@/content/projects";
import { Container } from "@/components/shared/Container";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";

// Simplified schematic — not a traced map and not exact GPS coordinates. The
// outline below is a real Uganda border (public-domain boundary data,
// projected equirectangularly), and district positions are real coordinates
// projected onto the same 0-100 frame (see content/reach.ts), but this is
// still a lightweight illustrative aid, not a surveyed map. The accessible
// list alongside it carries the same information — including real links to
// project pages — and needs no JavaScript to work.
const UGANDA_OUTLINE =
  "M 42.83,88.02 L 25.02,87.82 L 19.32,89.70 L 9.62,94.53 L 5.68,92.93 L 5.82,81.14 L 9.58,75.16 L 10.50,62.61 L 13.91,55.33 L 20.13,47.18 L 26.36,43.02 L 31.59,37.47 L 25.08,35.35 L 26.06,17.06 L 32.75,12.79 L 43.08,16.29 L 56.15,12.63 L 67.58,12.67 L 77.57,5.47 L 85.27,16.33 L 87.17,24.18 L 94.31,42.14 L 88.40,53.54 L 80.41,63.89 L 75.76,70.23 L 75.92,86.81 L 42.83,88.02 Z";

type DistrictStatus = "active" | "completed" | "planned" | "reached";

const STATUS_STYLE: Record<
  DistrictStatus,
  { pin: string; badge: "default" | "success" | "warning" | "outline"; label: string }
> = {
  active: { pin: "text-primary", badge: "default", label: "Active project" },
  planned: { pin: "text-warning", badge: "warning", label: "Planned project" },
  completed: { pin: "text-success", badge: "success", label: "Completed project" },
  reached: { pin: "text-muted-foreground", badge: "outline", label: "Area reached" },
};

function districtStatus(district: ReachDistrict): DistrictStatus {
  const projects = (district.projectSlugs ?? [])
    .map((slug) => getProjectBySlug(slug))
    .filter((p): p is NonNullable<typeof p> => Boolean(p));
  if (projects.length === 0) return "reached";
  if (projects.some((p) => p.status === "Active")) return "active";
  if (projects.some((p) => p.status === "Planned")) return "planned";
  return "completed";
}

export function UgandaReachMap() {
  const [selected, setSelected] = useState<string | null>(null);
  const idBase = useId();

  const districtsWithMeta = reachDistricts.map((d) => ({
    district: d,
    status: districtStatus(d),
    projects: (d.projectSlugs ?? [])
      .map((slug) => getProjectBySlug(slug))
      .filter((p): p is NonNullable<typeof p> => Boolean(p)),
  }));

  function toggle(name: string) {
    setSelected((current) => (current === name ? null : name));
  }

  return (
    <section className="bg-white py-16 md:py-24 lg:py-32">
      <Container>
        <SectionHeader
          eyebrow="Where We Work"
          title="Our Reach Across Uganda"
          description="From urban centres to rural communities, we work where need meets opportunity. Select a district for details."
        />

        <div className="mt-12 grid gap-8 lg:grid-cols-2 lg:items-start">
          <div
            className="relative aspect-square w-full overflow-hidden rounded-2xl border border-border bg-surface"
            role="img"
            aria-label={`Simplified map showing Vantage Foundation Uganda's approximate programme locations: ${reachDistricts
              .map((d) => d.name)
              .join(", ")}. Not to scale.`}
          >
            <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full" aria-hidden="true">
              <path d={UGANDA_OUTLINE} className="fill-background stroke-border" strokeWidth={0.6} />
            </svg>

            {districtsWithMeta.map(({ district, status }) => {
              const isSelected = selected === district.name;
              return (
                <button
                  key={district.name}
                  type="button"
                  onClick={() => toggle(district.name)}
                  aria-expanded={isSelected}
                  aria-controls={`${idBase}-${district.name}`}
                  aria-label={`${district.name} on the map: view details`}
                  className="group absolute -translate-x-1/2 -translate-y-full rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                  style={{ left: `${district.x}%`, top: `${district.y}%` }}
                >
                  <MapPin
                    className={cn(
                      "h-6 w-6 drop-shadow transition-transform",
                      STATUS_STYLE[status].pin,
                      isSelected && "scale-125"
                    )}
                    fill="currentColor"
                    fillOpacity={0.15}
                  />
                  <span
                    aria-hidden="true"
                    className={cn(
                      "pointer-events-none absolute left-1/2 top-full mt-1 -translate-x-1/2 whitespace-nowrap rounded-md bg-navy px-2 py-1 text-xs font-medium text-white shadow-lg transition-opacity",
                      isSelected
                        ? "opacity-100"
                        : "opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100"
                    )}
                  >
                    {district.name}
                  </span>
                </button>
              );
            })}

            <p className="absolute bottom-2 right-3 text-xs text-muted-foreground">
              Simplified schematic — not to scale
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-primary">
              Districts we&rsquo;ve reached
            </h3>
            <ul className="mt-4 space-y-2">
              {districtsWithMeta.map(({ district, status, projects }) => {
                const isSelected = selected === district.name;
                return (
                  <li
                    key={district.name}
                    id={`${idBase}-${district.name}`}
                    className={cn(
                      "rounded-xl border p-3 transition-colors",
                      isSelected ? "border-primary bg-primary-light/40" : "border-border"
                    )}
                  >
                    <button
                      type="button"
                      onClick={() => toggle(district.name)}
                      aria-expanded={isSelected}
                      className="flex w-full items-center justify-between gap-2 text-left"
                    >
                      <span className="flex items-center gap-2 text-sm font-medium">
                        <MapPin
                          className={cn("h-4 w-4 shrink-0", STATUS_STYLE[status].pin)}
                          aria-hidden="true"
                        />
                        {district.name}
                      </span>
                      <Badge variant={STATUS_STYLE[status].badge}>
                        {STATUS_STYLE[status].label}
                      </Badge>
                    </button>

                    {projects.length > 0 ? (
                      <ul className="mt-2 space-y-1 pl-6">
                        {projects.map((p) => (
                          <li key={p.slug}>
                            <Link
                              href={`/projects/${p.slug}`}
                              className="text-sm text-primary underline-offset-4 hover:underline"
                            >
                              {p.title}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="mt-2 pl-6 text-sm text-muted-foreground">
                        Programme activity reaches this area; no dedicated project page yet.
                      </p>
                    )}
                  </li>
                );
              })}
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
