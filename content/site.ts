import { SiteConfig } from "@/types";
import { resolveSiteUrl } from "@/lib/site-url";

export const site: SiteConfig = {
  name: "Vantage Foundation Uganda",
  legalName: "Vantage Foundation Uganda Limited",
  tagline: "Changing the world, one advantage at a time.",
  description:
    "Vantage Foundation Uganda is a youth-led nonprofit improving access to health, education, clean water and humanitarian support in underserved Ugandan communities.",
  mission: "To change the world, one advantage at a time.",
  vision: "Improved livelihoods in Ugandan and East African communities.",
  values: ["Growth", "Sustainability", "Safety", "Inclusivity"],
  founded: "December 2020",
  contact: {
    email: "foundationvantage@gmail.com",
    phone: "+256 786 585 216",
    address: "Jinja, Uganda",
    city: "Jinja",
    country: "Uganda",
    offices: [
      { label: "Jinja Office", city: "Jinja", region: "Eastern Region", country: "Uganda" },
      { label: "Ishaka Office", city: "Ishaka", region: "Bushenyi District", country: "Uganda" },
    ],
  },
  socials: {
    instagram: "https://www.instagram.com/vantagefoundationuganda/",
    linkedin: "https://ug.linkedin.com/company/vantagefoundation",
    youtube: "https://www.youtube.com/@vantagefoundation",
  },
  bankDetails: {
    bankName: "Housing Finance Bank",
    accountName: "Vantage Foundation Uganda Limited",
    accountNumber: "1160000227127",
    swiftCode: "HFINUGKAXXX",
  },
  mobileMoney:
    "Mobile Money details will be added here. Please contact us for the current number and registered name.",
  nav: [
    {
      label: "About",
      href: "/about-us",
      children: [
        { label: "Our Story", href: "/about-us" },
        { label: "Team", href: "/about-us/team" },
        { label: "Governance", href: "/about-us#governance" },
        { label: "Reports and Accountability", href: "/reports-and-accountability" },
        { label: "Contact", href: "/contact" },
      ],
    },
    {
      label: "Programmes",
      href: "/our-work",
      children: [
        { label: "Vantage Care", href: "/programmes/health" },
        { label: "KikumiKyo Academy", href: "/programmes/education" },
        { label: "Humanitarian Assistance", href: "/programmes/humanitarian" },
        { label: "Water, Sanitation and Hygiene", href: "/programmes/water" },
      ],
    },
    {
      label: "Impact",
      href: "/impact",
      children: [
        { label: "Projects", href: "/projects" },
        { label: "Where We Work", href: "/impact#where-we-work" },
        { label: "Impact Results", href: "/impact" },
        { label: "Reports", href: "/reports-and-accountability" },
      ],
    },
    {
      label: "Stories",
      href: "/stories",
    },
    {
      label: "Get Involved",
      href: "/get-involved",
      children: [
        { label: "Donate", href: "/donate" },
        { label: "Volunteer", href: "/get-involved#volunteer" },
        { label: "Partner", href: "/get-involved#partner" },
        { label: "Sponsor", href: "/get-involved#sponsor" },
        { label: "Corporate Social Responsibility", href: "/get-involved#csr" },
      ],
    },
    {
      label: "Donate",
      href: "/donate",
    },
  ],
  primaryCta: { label: "Donate", href: "/donate" },
  secondaryCta: { label: "Partner With Us", href: "/get-involved" },
  url: resolveSiteUrl(),
};
