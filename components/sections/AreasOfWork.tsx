import Link from "next/link";
import { areasOfWork } from "@/content/areas";
import { Container } from "@/components/shared/Container";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { AreaIcon } from "@/components/shared/AreaIcon";
import { Card } from "@/components/ui/Card";
import { ArrowRight } from "lucide-react";

export function AreasOfWork() {
  return (
    <section className="bg-muted py-16 md:py-24 lg:py-32">
      <Container>
        <SectionHeader
          eyebrow="Our Work"
          title="Curated, sustainable and holistic projects"
          description="We work across four interconnected areas because health, education, relief and clean water reinforce one another."
        />

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {areasOfWork.map((area) => (
            <Card key={area.id} className="flex flex-col p-6">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <AreaIcon id={area.id} className="h-6 w-6" />
              </div>
              <h3 className="mt-4 text-xl font-semibold">{area.title}</h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                {area.summary}
              </p>
              <ul className="mt-4 space-y-1 text-sm text-muted-foreground">
                {area.items.slice(0, 4).map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link
                href={`/our-work#${area.id}`}
                className="mt-6 inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
              >
                Learn more <ArrowRight className="h-4 w-4" />
              </Link>
            </Card>
          ))}
        </div>
      </Container>
    </section>
  );
}
