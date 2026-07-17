import { projects } from "@/content/projects";
import { Container } from "@/components/shared/Container";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { ProjectCard } from "@/components/shared/ProjectCard";
import { Button } from "@/components/ui/Button";

export function FeaturedProjects() {
  const featured = projects.slice(0, 3);

  return (
    <section className="py-16 md:py-24 lg:py-32">
      <Container>
        <SectionHeader
          eyebrow="Projects"
          title="Featured projects"
          description="A snapshot of our work in clean water, menstrual health, mentorship and education."
        />

        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {featured.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </div>

        <div className="mt-12 text-center">
          <Button href="/projects" variant="outline">
            View All Projects
          </Button>
        </div>
      </Container>
    </section>
  );
}
