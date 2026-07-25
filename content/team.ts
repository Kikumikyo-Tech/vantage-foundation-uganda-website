import { TeamMember } from "@/types";

export const team: TeamMember[] = [
  {
    name: "[Founder / Executive Director name to be added]",
    role: "Founder & Executive Director",
    bio:
      "Visionary youth leader who started Vantage Foundation Uganda in December 2020 to create opportunities for underserved young people.",
    photo: "/images/placeholder-team.jpg",
    placeholder: true,
  },
  {
    name: "[Programmes Lead name to be added]",
    role: "Programmes Lead",
    bio:
      "Coordinates health, education and humanitarian projects across partner communities and ensures programmes stay community-centred.",
    photo: "/images/placeholder-team.jpg",
    placeholder: true,
  },
  {
    name: "[Volunteer Coordinator name to be added]",
    role: "Volunteer Coordinator",
    bio:
      "Builds and supports the volunteer network that makes Vantage Foundation's outreach possible.",
    photo: "/images/placeholder-team.jpg",
    placeholder: true,
  },
  {
    name: "[Finance & Partnerships Lead name to be added]",
    role: "Finance & Partnerships Lead",
    bio:
      "Overseeing donor relations, financial accountability and strategic partnerships.",
    photo: "/images/placeholder-team.jpg",
    placeholder: true,
  },
];

/**
 * Returns team members that are not placeholders. In development, all
 * members are returned (including placeholders for previewing). In
 * production, placeholder members are filtered out.
 */
export function getPublishedTeam(): TeamMember[] {
  const isDev = process.env.NODE_ENV === "development";
  return team.filter((m) => isDev || !m.placeholder);
}
