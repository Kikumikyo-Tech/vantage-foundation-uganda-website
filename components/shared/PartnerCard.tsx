import Image from "next/image";
import { Partner } from "@/types";
import { Card } from "@/components/ui/Card";

interface PartnerCardProps {
  partner: Partner;
}

export function PartnerCard({ partner }: PartnerCardProps) {
  const logoAlt = partner.logoAlt ?? `${partner.name} logo`;

  return (
    <Card className="flex h-full flex-col items-center p-6 text-center">
      <div className="relative mb-4 h-20 w-full md:h-24">
        {partner.logo ? (
          <Image
            src={partner.logo}
            alt={logoAlt}
            fill
            className="object-contain"
            sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 30vw"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center rounded-lg border border-border bg-surface px-4">
            <span className="text-lg font-semibold text-foreground">
              {partner.name}
            </span>
          </div>
        )}
      </div>

      <h3 className="text-lg font-semibold text-foreground">{partner.name}</h3>

      {partner.relationshipType && (
        <p className="mt-2 text-xs font-semibold uppercase tracking-wider text-primary">
          {partner.relationshipType}
        </p>
      )}

      {partner.description && (
        <p className="mt-3 flex-grow text-sm text-muted-foreground">
          {partner.description}
        </p>
      )}

      {partner.url && (
        <a
          href={partner.url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-flex min-h-11 items-center text-sm font-semibold text-primary underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          Visit official website
        </a>
      )}
    </Card>
  );
}
