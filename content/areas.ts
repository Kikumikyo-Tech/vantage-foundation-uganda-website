import { AreaOfWork, ProjectCategory } from "@/types";

export const areasOfWork: AreaOfWork[] = [
  {
    id: "health",
    title: "Health",
    summary: "Bringing medical outreach, reproductive health and mental wellness to young people and hard-to-reach communities.",
    description:
      "We deliver basic medical services to hard-to-reach areas and advocate for affordable, quality care for all. Our health work spans medical camps, sexual and reproductive health, maternal and child health, paediatrics, geriatrics, preventive care, mental health sessions and community health education.",
    items: [
      "Medical outreaches and camps",
      "Sexual and reproductive health",
      "Mental health workshops",
      "Maternal and child health",
      "Paediatrics",
      "Geriatrics",
      "Preventive healthcare",
      "Health advocacy",
      "Community health education",
    ],
    icon: "heart-pulse",
  },
  {
    id: "education",
    title: "Education",
    summary: "Mentorship, career guidance, financial literacy and self-development for youth with limited access to higher education.",
    description:
      "Where formal systems struggle to provide relevant skills, we step in with mentorship, career guidance, financial literacy, soft skills, academic support and the Advantage Book Club — giving young people tools to harness their full potential.",
    items: [
      "Mentorship",
      "Career guidance",
      "Financial literacy",
      "Workshops",
      "Soft skills",
      "Youth empowerment",
      "Academic support",
      "Advantage Book Club",
    ],
    icon: "graduation-cap",
  },
  {
    id: "humanitarian",
    title: "Humanitarian Aid",
    summary: "Emergency and household support, food, essential supplies and care for vulnerable children and families.",
    description:
      "We provide essential nutrition, clothing, household support and relief to orphans, women and communities in crisis. Our aid is disability-inclusive and centred on dignity.",
    items: [
      "Emergency and household support",
      "Food and essential supplies",
      "Support for vulnerable children",
      "Disability-inclusive assistance",
      "Community relief initiatives",
    ],
    icon: "hand-heart",
  },
  {
    id: "water",
    title: "Water, Sanitation & Hygiene",
    summary: "Sustainable water, sanitation and hygiene infrastructure for rural and underserved communities.",
    description:
      "Clean water and dignified sanitation are foundational to health and education. We build wells, promote hygiene education and support WASH interventions that last.",
    items: [
      "Deep water well construction",
      "Community boreholes",
      "Hygiene education",
      "Sanitation support",
      "WASH in schools",
    ],
    icon: "droplets",
  },
  {
    id: "youth-leadership",
    title: "Youth Leadership & Community Empowerment",
    summary:
      "Equipping young people with the confidence, skills and platforms to lead change in their communities.",
    description:
      "We believe that young people are not just beneficiaries but leaders. Through mentorship, conference platforms, youth-led initiatives and community organising, we support young Ugandans to step into leadership roles, shape conversations and drive sustainable change from within their communities.",
    items: [
      "Youth conferences and forums",
      "Leadership mentorship",
      "Community organising",
      "Youth-led initiatives",
      "Public speaking and advocacy",
      "Peer-to-peer mentorship",
    ],
    icon: "lightbulb",
  },
];

// Maps an area id to the ProjectCategory label(s) used in content/projects.ts.
// Area display titles (e.g. "Water, Sanitation & Hygiene") intentionally differ
// from project category labels (e.g. "Water & Sanitation"), so matching by
// title string equality would silently hide the flagship Kasaale borehole from
// the WASH section. This explicit mapping keeps display wording and matching
// logic decoupled.
export const projectCategoriesByAreaId: Record<string, ProjectCategory[]> = {
  health: ["Health"],
  education: ["Education"],
  humanitarian: ["Humanitarian Aid"],
  water: ["Water & Sanitation"],
  "youth-leadership": ["Youth Leadership"],
};
