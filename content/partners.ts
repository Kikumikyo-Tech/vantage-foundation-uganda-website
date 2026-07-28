import { Partner } from "@/types";

export const partners: Partner[] = [
  {
    name: "The Cup Foundation",
    description:
      "Donated UN-recommended Lunette menstrual cups and supported menstrual health training for the SaveGirl Uganda programme.",
    url: "https://www.thecup.org/",
  },
  {
    name: "Housing Finance Bank",
    description:
      "Banking partner holding Vantage Foundation Uganda Limited's donation account.",
    url: "https://www.housingfinance.co.ug/",
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
