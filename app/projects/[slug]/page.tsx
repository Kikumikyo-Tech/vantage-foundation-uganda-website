import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  getProjectBySlug,
  getProjectSlugs,
  getPublishedProjects,
} from "@/content/projects";
import { Container } from "@/components/shared/Container";
import { Badge } from "@/components/ui/Badge";
import { ImageOrPlaceholder } from "@/components/shared/ImageOrPlaceholder";
import { Button } from "@/components/ui/Button";
import { ProjectCard } from "@/components/shared/ProjectCard";
import { MapPin, Calendar, Users } from "lucide-react";
import { Markdown } from "@/components/shared/Markdown";

export async function generateStaticParams() {
  return getProjectSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) return {};
  return {
    title: project.seo?.title || project.title,
    description: project.seo?.description || project.summary,
    openGraph: {
      title: project.seo?.title || project.title,
      description: project.seo?.description || project.summary,
      images: project.seo?.ogImage ? [{ url: project.seo.ogImage }] : undefined,
    },
    alternates: {
      canonical: `/projects/${slug}`,
    },
  };
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  // In production, unpublished projects should 404.
  if (!project || (process.env.NODE_ENV === "production" && project.published === false)) {
    notFound();
  }

  const relatedProjects = getPublishedProjects()
    .filter((p) => p.category === project.category && p.slug !== project.slug)
    .slice(0, 3);

  return (
    <>
      <section className="bg-primary py-16 text-white md:py-24">
        <Container>
          <div className="max-w-3xl">
            <div className="flex flex-wrap gap-2">
              <Badge variant="accent">{project.category}</Badge>
              <Badge variant="outline" className="border-white/30 text-white">
                {project.status}
              </Badge>
            </div>
            <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">
              {project.title}
            </h1>
            <p className="mt-4 text-lg text-white/90">{project.summary}</p>
          </div>
        </Container>
      </section>

      <section className="py-12 md:py-16">
        <Container>
          <div className="relative aspect-[16/9] overflow-hidden rounded-2xl">
            <ImageOrPlaceholder
              src={project.heroImage}
              alt={project.title}
              fill
              priority
              containerClassName="h-full w-full"
            />
          </div>

          <div className="mt-8 flex flex-wrap gap-6 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              {project.location}
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              {project.date}
            </span>
            {project.beneficiaries && (
              <span className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                {project.beneficiaries}
              </span>
            )}
          </div>

          {project.body && (
            <div className="mt-8 max-w-3xl">
              <Markdown>{project.body}</Markdown>
            </div>
          )}

          <div className="mt-12 grid gap-8 lg:grid-cols-2">
            {project.objective && (
              <div>
                <h2 className="text-2xl font-bold">Community need & objectives</h2>
                <p className="mt-4 text-muted-foreground">{project.objective}</p>
              </div>
            )}
            {project.activities && project.activities.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold">Activities</h2>
                <ul className="mt-4 space-y-2 text-muted-foreground">
                  {project.activities.map((activity) => (
                    <li key={activity} className="flex items-start gap-2">
                      <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary" />
                      {activity}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {project.outcomes && project.outcomes.length > 0 && (
            <div className="mt-12">
              <h2 className="text-2xl font-bold">Results</h2>
              <ul className="mt-4 space-y-2 text-muted-foreground">
                {project.outcomes.map((outcome) => (
                  <li key={outcome} className="flex items-start gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary" />
                    {outcome}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {project.partners && project.partners.length > 0 && (
            <div className="mt-12">
              <h2 className="text-2xl font-bold">Partners</h2>
              <div className="mt-4 flex flex-wrap gap-2">
                {project.partners.map((partner) => (
                  <span
                    key={partner}
                    className="rounded-full border border-border bg-white px-3 py-1 text-sm"
                  >
                    {partner}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="mt-12 rounded-xl bg-primary p-8 text-white">
            <h2 className="text-2xl font-bold">Support this project</h2>
            <p className="mt-2 text-white/90">
              Your contribution helps us expand this work and reach more communities.
            </p>
            <Button href="/donate" variant="secondary" className="mt-6">
              Donate now
            </Button>
          </div>

          {relatedProjects.length > 0 && (
            <div className="mt-16">
              <h2 className="text-2xl font-bold">Related projects</h2>
              <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {relatedProjects.map((p) => (
                  <ProjectCard key={p.slug} project={p} />
                ))}
              </div>
            </div>
          )}
        </Container>
      </section>
    </>
  );
}
