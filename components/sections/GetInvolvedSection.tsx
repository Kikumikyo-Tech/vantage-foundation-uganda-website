import { Container } from "@/components/shared/Container";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Heart, HandHelping, Handshake, Megaphone, Users, Briefcase } from "lucide-react";

const pathways = [
  {
    icon: Heart,
    title: "Donate",
    description: "Fund a project, a campaign or our general operations.",
    href: "/donate",
    cta: "Give now",
  },
  {
    icon: HandHelping,
    title: "Volunteer",
    description: "Share your time as a mentor, health worker, educator or logistics helper.",
    href: "/get-involved#volunteer",
    cta: "Become a volunteer",
  },
  {
    icon: Handshake,
    title: "Partner",
    description: "Collaborate on programmes, funding or technical expertise.",
    href: "/get-involved#partner",
    cta: "Partner with us",
  },
  {
    icon: Megaphone,
    title: "Sponsor",
    description: "Sponsor a specific project, event or community need.",
    href: "/get-involved#sponsor",
    cta: "Sponsor a project",
  },
  {
    icon: Users,
    title: "Collaborate",
    description: "Join a campaign, workshop or community mobilisation.",
    href: "/contact",
    cta: "Get in touch",
  },
  {
    icon: Briefcase,
    title: "Corporate social responsibility",
    description: "Align your organisation's CSR with youth and community impact.",
    href: "/contact",
    cta: "Discuss CSR",
  },
];

export function GetInvolvedSection() {
  return (
    <section className="bg-black py-16 md:py-24 lg:py-32" id="get-involved">
      <Container>
        <SectionHeader
          eyebrow="Get Involved"
          title="Join the movement"
          description="There are many ways to help create one more advantage for a young person, family or community."
          light
        />

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {pathways.map((path) => (
            <Card key={path.title} className="flex flex-col p-6">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <path.icon className="h-6 w-6" aria-hidden="true" />
              </div>
              <h3 className="mt-4 text-xl font-semibold">{path.title}</h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                {path.description}
              </p>
              <Button href={path.href} variant="ghost" className="mt-4 justify-start px-0">
                {path.cta}
              </Button>
            </Card>
          ))}
        </div>
      </Container>
    </section>
  );
}
