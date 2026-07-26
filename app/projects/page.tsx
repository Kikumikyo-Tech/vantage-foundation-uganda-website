import type { Metadata } from "next";
import { getPublishedProjects } from "@/content/projects";
import { Container } from "@/components/shared/Container";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { ProjectList } from "@/components/projects/ProjectList";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Browse Vantage Foundation Uganda's projects in health, education, humanitarian aid and water & sanitation.",
};

export default function ProjectsPage() {
  return (
    <>
      <section className="bg-primary py-16 text-white md:py-24">
        <Container>
          <SectionHeader title="Projects" level="h1" light />
        </Container>
      </section>

      <section className="py-16 md:py-24">
        <Container>
          <ProjectList projects={getPublishedProjects()} />
        </Container>
      </section>
    </>
  );
}
