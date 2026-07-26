import { TeamMember } from "@/types";

// Verified team biographies supplied by Vantage Foundation Uganda leadership
// (2026-07-27). Do not invent additional titles, qualifications, awards,
// employment history or academic credentials — only the roles and bios below
// are confirmed for publication.
export const team: TeamMember[] = [
  {
    id: "nassazi-kauthar-wangi",
    slug: "nassazi-kauthar-wangi",
    fullName: "Dr. Nassazi Kauthar Wangi",
    displayName: "Dr. Nassazi Kauthar Wangi",
    role: "Co-founder and Executive Director",
    category: "leadership",
    shortBio:
      "Medical doctor and nonprofit leader providing strategic direction across Vantage Foundation Uganda's programmes, partnerships and community initiatives.",
    fullBio:
      "Dr. Nassazi Kauthar Wangi is a medical doctor, researcher and nonprofit leader with a strong interest in mental health, neuroscience, psychology and community wellbeing. As Co-founder and Executive Director of Vantage Foundation Uganda, she provides strategic leadership and oversees the Foundation's programmes, partnerships and institutional development. Her work focuses particularly on adolescents, young people, women, health workers, people living with chronic illness and underserved communities.",
    image: "/images/team/nassazi-kauthar-wangi",
    imageAlt: "Portrait of Dr. Nassazi Kauthar Wangi",
    displayOrder: 1,
    published: true,
  },
  {
    id: "turyasingura-hillary-a",
    slug: "turyasingura-hillary-a",
    fullName: "Dr. Turyasingura Hillary A.",
    displayName: "Dr. Turyasingura Hillary A.",
    role: "Co-founder and Operations Director",
    category: "leadership",
    shortBio:
      "Medical doctor and community health advocate leading programme delivery, operations and field implementation.",
    fullBio:
      "Dr. Turyasingura Hillary A. is a medical doctor, community health advocate and development practitioner with experience in primary care, medical outreach, youth empowerment and nonprofit operations. As Co-founder and Operations Director of Vantage Foundation Uganda, he coordinates programme implementation, field operations, partnerships and organisational systems. His interests include preventive healthcare, maternal and child health, sexual and reproductive health, community medical camps and improving access to care in underserved settings.",
    image: "/images/team/turyasingura-hillary-a",
    imageAlt: "Portrait of Dr. Turyasingura Hillary A.",
    displayOrder: 2,
    published: true,
  },
  {
    id: "kabagenyi-oliyer-abwooli",
    slug: "kabagenyi-oliyer-abwooli",
    fullName: "Dr. Kabagenyi Oliyer Abwooli",
    displayName: "Dr. Kabagenyi Oliyer Abwooli",
    role: "Volunteer",
    category: "volunteer",
    shortBio:
      "Medical professional supporting community health, outreach and volunteer-led service delivery.",
    fullBio:
      "Dr. Kabagenyi Oliyer Abwooli is a medical professional who supports Vantage Foundation Uganda's community health and outreach activities. She contributes clinical knowledge, volunteer service and community engagement to initiatives designed to improve health awareness, access to essential services and the wellbeing of vulnerable populations.",
    image: "/images/team/kabagenyi-oliyer-abwooli",
    imageAlt: "Portrait of Dr. Kabagenyi Oliyer Abwooli",
    displayOrder: 3,
    published: true,
  },
  {
    id: "ashabahebwa-humphrey",
    slug: "ashabahebwa-humphrey",
    fullName: "Mr. Ashabahebwa Humphrey",
    displayName: "Mr. Ashabahebwa Humphrey",
    role: "Volunteer",
    category: "volunteer",
    shortBio:
      "Community volunteer supporting outreach, mobilisation and humanitarian programme delivery.",
    fullBio:
      "Mr. Ashabahebwa Humphrey is a community volunteer supporting Vantage Foundation Uganda's outreach, mobilisation and humanitarian activities. He contributes to field coordination, beneficiary engagement and the practical delivery of programmes within the communities served by the Foundation.",
    image: "/images/team/ashabahebwa-humphrey",
    imageAlt: "Portrait of Mr. Ashabahebwa Humphrey",
    displayOrder: 4,
    published: true,
  },
  {
    id: "omara-godfrey",
    slug: "omara-godfrey",
    fullName: "Engineer Omara Godfrey",
    displayName: "Engineer Omara Godfrey",
    role: "Volunteer",
    category: "volunteer",
    shortBio:
      "Engineer and volunteer contributing technical support to community development and humanitarian projects.",
    fullBio:
      "Engineer Omara Godfrey is an engineer and community volunteer who supports Vantage Foundation Uganda's development and humanitarian initiatives. He contributes technical insight, field support and practical problem-solving to projects involving community infrastructure, logistics and service delivery.",
    image: "/images/team/omara-godfrey",
    imageAlt: "Portrait of Engineer Omara Godfrey",
    displayOrder: 5,
    published: true,
  },
];

export function getTeamBySlug(slug: string): TeamMember | undefined {
  return team.find((m) => m.slug === slug);
}

export function getTeamSlugs(): string[] {
  return getPublishedTeam().map((m) => m.slug);
}

/**
 * Returns published team members sorted by displayOrder. In development,
 * unpublished members are included too so they can be previewed.
 */
export function getPublishedTeam(): TeamMember[] {
  const isDev = process.env.NODE_ENV === "development";
  return team
    .filter((m) => isDev || m.published)
    .sort((a, b) => a.displayOrder - b.displayOrder);
}

export function getLeadership(): TeamMember[] {
  return getPublishedTeam().filter((m) => m.category === "leadership");
}

export function getVolunteers(): TeamMember[] {
  return getPublishedTeam().filter((m) => m.category === "volunteer");
}
