import { Partner } from "@/types";

export const partners: Partner[] = [
  {
    name: "The Cup Foundation",
    description:
      "Donated UN-recommended Lunette menstrual cups and supported menstrual health training for the SaveGirl Uganda programme.",
    url: "https://www.thecup.org/",
    logo: "/images/placeholder-partner.jpg",
  },
  {
    name: "Housing Finance Bank",
    description:
      "Banking partner holding Vantage Foundation Uganda Limited's donation account.",
    url: "https://www.housingfinance.co.ug/",
    logo: "/images/placeholder-partner.jpg",
  },
  {
    name: "[Partner name to be added]",
    description: "[Partner description to be added]",
    logo: "/images/placeholder-partner.jpg",
    placeholder: true,
  },
];

/**
 * Returns partners that are not placeholders. In development, all
 * partners are returned (including placeholders for previewing). In
 * production, placeholder partners are filtered out.
 */
export function getPublishedPartners(): Partner[] {
  const isDev = process.env.NODE_ENV === "development";
  return partners.filter((p) => isDev || !p.placeholder);
}
