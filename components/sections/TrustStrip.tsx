import { site } from "@/content/site";
import { Container } from "@/components/shared/Container";
import { Sparkles, MapPin, Heart, Users } from "lucide-react";

export function TrustStrip() {
  const trustItems = [
    { icon: Sparkles, text: `Youth-led since ${site.founded}` },
    { icon: MapPin, text: "Uganda-based" },
    { icon: Heart, text: "100% volunteer-run" },
    { icon: Users, text: "Community-centred" },
  ];

  return (
    <section className="border-y border-border bg-surface py-10">
      <Container>
        <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm font-medium text-muted-foreground">
          {trustItems.map((item) => (
            <span key={item.text} className="inline-flex items-center gap-2">
              <item.icon className="h-4 w-4 text-primary" aria-hidden="true" />
              {item.text}
            </span>
          ))}
        </div>
      </Container>
    </section>
  );
}