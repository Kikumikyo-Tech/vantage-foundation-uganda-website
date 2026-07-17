import Link from "next/link";
import { Project } from "@/types";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { ImageOrPlaceholder } from "./ImageOrPlaceholder";
import { MapPin } from "lucide-react";

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Card className="flex flex-col overflow-hidden">
      <div className="relative aspect-[16/10] overflow-hidden">
        <ImageOrPlaceholder
          src={project.heroImage}
          alt={project.title}
          fill
          containerClassName="h-full w-full"
        />
      </div>
      <div className="flex flex-1 flex-col p-5">
        <div className="flex flex-wrap items-center gap-2">
          <Badge>{project.category}</Badge>
          <Badge variant="outline">{project.status}</Badge>
        </div>
        <h3 className="mt-3 text-lg font-semibold leading-snug">
          <Link href={`/projects/${project.slug}`} className="hover:text-primary">
            {project.title}
          </Link>
        </h3>
        <p className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
          <MapPin className="h-3 w-3" />
          {project.location}
        </p>
        <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">
          {project.summary}
        </p>
        <Link
          href={`/projects/${project.slug}`}
          className="mt-4 inline-flex text-sm font-semibold text-primary hover:underline"
        >
          View the project
        </Link>
      </div>
    </Card>
  );
}
