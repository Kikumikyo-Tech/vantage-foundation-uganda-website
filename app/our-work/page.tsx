import type { Metadata } from "next";
import { site } from "@/content/site";
import { areasOfWork } from "@/content/areas";
import { projects } from "@/content/projects";
import { Container } from "@/components/shared/Container";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { AreaIcon } from "@/components/shared/AreaIcon";
import { ProjectCard } from "@/components/shared/ProjectCard";
import { Card } from "@/components/ui/Card";

export const metadata: Metadata = {
  title: "Our Work",
  description: `Explore the four pillars of ${site.name}: health, education, humanitarian aid and water & sanitation.`,
};

export default function OurWorkPage() {
  return (
    <>
      <section className="bg-primary py-16 text-white md:py-24">
        <Container>
          <SectionHeader
            title="Our Work"
            description="Health, education, humanitarian aid and water, sanitation & hygiene — working together for sustainable livelihoods."
            light
          />
        </Container>
      </section>

      <section className="py-16 md:py-24">
        <Container>
          <div className="grid gap-12">
            {areasOfWork.map((area) => {
              const relatedProjects = projects.filter((p) =>
                p.category.toLowerCase() === area.title.toLowerCase()
              );

              return (
                <div key={area.id} id={area.id}>
                  <Card className="overflow-hidden p-6 md:p-8">
                    <div className="flex items-start gap-4">
                      <div className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <AreaIcon id={area.id} className="h-6 w-6" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold">{area.title}</h2>
                        <p className="mt-2 text-muted-foreground">{area.description}</p>
                        <ul className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                          {area.items.map((item) => (
                            <li key={item} className="flex items-center gap-2 text-sm">
                              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {relatedProjects.length > 0 && (
                      <div className="mt-8">
                        <h3 className="text-sm font-semibold uppercase tracking-wider text-primary">
                          Related projects
                        </h3>
                        <div className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                          {relatedProjects.map((project) => (
                            <ProjectCard key={project.slug} project={project} />
                          ))}
                        </div>
                      </div>
                    )}
                  </Card>
                </div>
              );
            })}
          </div>
        </Container>
      </section>
    </>
  );
}
