import Link from "next/link";
import { TeamMember } from "@/types";
import { Card } from "@/components/ui/Card";
import { ImageOrPlaceholder } from "./ImageOrPlaceholder";

interface TeamCardProps {
  member: TeamMember;
  /** Resolved presigned URL from an /admin/media upload, if one exists. */
  photoOverrideSrc?: string;
}

export function TeamCard({ member, photoOverrideSrc }: TeamCardProps) {
  return (
    <Card className="overflow-hidden text-center">
      <div className="relative aspect-square overflow-hidden">
        <ImageOrPlaceholder
          src={photoOverrideSrc ?? `${member.image}-square.webp`}
          alt={member.imageAlt}
          fill
          preset="team"
          containerClassName="h-full w-full"
        />
      </div>
      <div className="p-5">
        <h3 className="text-base font-semibold leading-snug">
          <Link href={`/about-us/team/${member.slug}`} className="hover:text-primary">
            {member.displayName}
          </Link>
        </h3>
        <p className="mt-1 text-sm text-primary">{member.role}</p>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          {member.shortBio}
        </p>
        <Link
          href={`/about-us/team/${member.slug}`}
          className="mt-3 inline-flex text-sm font-semibold text-primary hover:underline"
        >
          Read full bio
        </Link>
      </div>
    </Card>
  );
}
