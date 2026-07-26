import { SiteConfig } from "@/types";

export const site: SiteConfig = {
  name: "Vantage Foundation Uganda",
  legalName: "Vantage Foundation Uganda Limited",
  tagline: "Changing the world, one advantage at a time.",
  description:
    "Vantage Foundation Uganda is a youth-led nonprofit improving lives through health, education and humanitarian action in underserved communities across Uganda.",
  mission: "To change the world, one advantage at a time.",
  vision: "Improved livelihoods in Ugandan and African communities.",
  values: ["Growth", "Sustainability", "Safety", "Inclusivity"],
  founded: "December 2020",
  contact: {
    email: "foundationvantage@gmail.com",
    phone: "+256 786 585 216",
    // TODO: needs management info — address says Ishaka/Bushenyi but city says Jinja.
    // These are different regions of Uganda. Confirm the correct office location
    // before public launch. See docs/technical-audit.md §4.5 and §4.7.
    address: "Ishaka, Bushenyi, Uganda",
    city: "Jinja",
    country: "Uganda",
  },
  socials: {
    instagram: "https://www.instagram.com/vantagefoundation/",
    linkedin: "https://ug.linkedin.com/company/vantagefoundation",
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
    { label: "Home", href: "/" },
    { label: "About Us", href: "/about-us" },
    { label: "Our Work", href: "/our-work" },
    { label: "Projects", href: "/projects" },
    { label: "Impact", href: "/impact" },
    { label: "Stories", href: "/stories" },
    { label: "Gallery", href: "/gallery" },
    { label: "Get Involved", href: "/get-involved" },
    { label: "Contact", href: "/contact" },
  ],
  primaryCta: { label: "Donate", href: "/donate" },
  secondaryCta: { label: "Partner With Us", href: "/get-involved" },
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://vantagefoundationuganda.org",
};
