import { TeamMember } from "@/types";

// Verified team biographies supplied by Vantage Foundation Uganda leadership
// (2026-07-27). Do not invent additional titles, qualifications, awards,
// employment history or academic credentials — only the roles and bios below
// are confirmed for publication.
//
// Kauthar's and Hillary's Girl Power USA history (added 2026-07-31) is
// sourced from Girl Power USA's own published pages (girlpowerusa.org,
// girlpowertalk.com), cross-checked against LinkedIn, plus direct
// confirmation from Vantage management on the Senior Associate → Associate
// Director progression and its end (stepped back for medical/surgical
// training requirements). See each member's `citations` for sources.
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
      "Dr. Nassazi Kauthar Wangi is a medical doctor, researcher and nonprofit leader with a strong interest in mental health, neuroscience, psychology and community wellbeing. As Co-founder and Executive Director of Vantage Foundation Uganda, she provides strategic leadership and oversees the Foundation's programmes, partnerships and institutional development. Her work focuses particularly on adolescents, young people, women, health workers, people living with chronic illness and underserved communities. In 2021 she founded the SaveGirl Uganda initiative, which Girl Power USA — a US-based 501(c)(3) working across Africa and Asia — has supported ever since. Kauthar has served as a Senior Associate with Girl Power USA and a Young Leader with its sister organisation, Girl Power Talk.",
    image: "/images/team/nassazi-kauthar-wangi",
    imageAlt: "Portrait of Dr. Nassazi Kauthar Wangi",
    linkedin: "https://www.linkedin.com/in/kautharwangi/",
    citations: [
      {
        label: "Girl Power USA on its support for SaveGirl Uganda",
        url: "https://girlpowerusa.org/impact/creating-doctors-in-uganda-uganda/",
      },
    ],
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
      "Dr. Turyasingura Hillary A. is a medical doctor, community health advocate and development practitioner with experience in primary care, medical outreach, youth empowerment and nonprofit operations. As Co-founder and Operations Director of Vantage Foundation Uganda, he coordinates programme implementation, field operations, partnerships and organisational systems. His interests include preventive healthcare, maternal and child health, sexual and reproductive health, community medical camps and improving access to care in underserved settings. Before his medical and surgical training required his full focus, he served with Girl Power USA — a US-based 501(c)(3) working in Uganda — progressing through its associate programme from Senior Associate to Associate Director and leading its Uganda team on community-health, humanitarian and youth-led initiatives. This included burns-prevention education delivered in association with the Grossman Burn Foundation and Ugandan doctors, and healthcare outreach for children living on the streets of Jinja delivered with S.A.L.V.E. International on International Street Children's Day.",
    image: "/images/team/turyasingura-hillary-a",
    imageAlt: "Portrait of Dr. Turyasingura Hillary A.",
    linkedin: "https://www.linkedin.com/in/turyasingura-hillary/",
    citations: [
      {
        label: "Girl Power USA's burns-prevention work with the Grossman Burn Foundation",
        url: "https://girlpowerusa.org/grossman-burn-foundation-in-uganda/",
      },
      {
        label: "Girl Power USA on its healthcare partnership with Vantage Foundation and S.A.L.V.E. International",
        url: "https://girlpowerusa.org/health-care-in-africa/",
      },
    ],
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
