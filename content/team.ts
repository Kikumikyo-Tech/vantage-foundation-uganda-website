import { TeamMember } from "@/types";

// NOTE: The volunteer bios below are short, role-based drafts (not
// fabricated personal history) — please review and edit before public
// launch. The Girl Power USA references in Kauthar's and Hillary's bios
// are sourced from Girl Power USA's own published pages (girlpowerusa.org,
// girlpowertalk.com) plus direct confirmation from Vantage management —
// see the audit table provided alongside this change for citations.
export const team: TeamMember[] = [
  {
    name: "Dr. Nassazi Kauthar Wangi",
    role: "Co-founder & Executive Director",
    bio:
      "Co-founder of Vantage Foundation Uganda, providing strategic leadership across the organisation's health, education and humanitarian programmes. In 2021 she founded the SaveGirl Uganda initiative, which Girl Power USA — a US-based 501(c)(3) working across Africa and Asia — has supported ever since. Kauthar has served as a Senior Associate with Girl Power USA and a Young Leader with its sister organisation, Girl Power Talk.",
    photo: "/images/team/nassazi-kauthar-wangi.webp",
    placeholder: false,
    links: [
      { label: "SaveGirl Uganda project", href: "/projects/savegirl-uganda" },
      {
        label: "Girl Power USA on its support for SaveGirl Uganda",
        href: "https://girlpowerusa.org/impact/creating-doctors-in-uganda-uganda/",
        external: true,
      },
      {
        label: "Dr. Nassazi Kauthar Wangi on LinkedIn",
        href: "https://www.linkedin.com/in/kautharwangi/",
        external: true,
      },
    ],
  },
  {
    name: "Dr. Turyasingura Hillary A.",
    role: "Co-founder & Operations Director",
    bio:
      "Co-founder of Vantage Foundation Uganda, overseeing day-to-day operations and ensuring programmes run effectively across partner communities. Before his medical and surgical training required his full focus, he served with Girl Power USA — a US-based 501(c)(3) working in Uganda — progressing from Senior Associate to Associate Director and leading its Uganda team on community-health, humanitarian and youth-led initiatives. This included burns-prevention education delivered in association with the Grossman Burn Foundation and Ugandan doctors, and healthcare outreach for children living on the streets of Jinja, delivered at S.A.L.V.E. International's town home on International Street Children's Day.",
    photo: "/images/team/turyasingura-hillary.webp",
    placeholder: false,
    links: [
      { label: "Youth conference in Bushenyi", href: "/stories/youth-conference-bushenyi" },
      {
        label: "Humanitarian support for vulnerable children",
        href: "/projects/orphanage-relief",
      },
      {
        label: "Girl Power USA's burns-prevention work with the Grossman Burn Foundation",
        href: "https://girlpowerusa.org/grossman-burn-foundation-in-uganda/",
        external: true,
      },
      {
        label: "Girl Power USA on its healthcare partnership with Vantage Foundation and S.A.L.V.E. International",
        href: "https://girlpowerusa.org/health-care-in-africa/",
        external: true,
      },
      {
        label: "Dr. Turyasingura Hillary A. on LinkedIn",
        href: "https://www.linkedin.com/in/turyasingura-hillary/",
        external: true,
      },
    ],
  },
  {
    name: "Engineer Omara Godfrey",
    role: "Volunteer",
    bio:
      "Volunteer engineer supporting Vantage Foundation Uganda's water and infrastructure projects, including borehole and WASH initiatives.",
    photo: "/images/team/omara-godfrey.webp",
    placeholder: false,
  },
  {
    name: "Dr. Kabagenyi Oliyer Abwooli",
    role: "Volunteer",
    bio:
      "Volunteer with Vantage Foundation Uganda, contributing to the organisation's community health and education initiatives.",
    photo: "/images/team/kabagenyi-oliyer-abwooli.webp",
    placeholder: false,
  },
  {
    name: "Mr. Ashabahebwa Humphrey",
    role: "Volunteer",
    bio:
      "Volunteer with Vantage Foundation Uganda, supporting community outreach and programme activities.",
    photo: "/images/team/ashabahebwa-humphrey.webp",
    placeholder: false,
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
