import { Partner } from "@/types";

export const partners: Partner[] = [
  {
    name: "The Cup Foundation",
    relationshipType: "In-kind programme contributor",
    description:
      "Donated UN-recommended Lunette menstrual cups and supported menstrual health training for the SaveGirl Uganda programme.",
    url: "https://www.thecup.org/",
  },
  {
    name: "Housing Finance Bank",
    relationshipType: "Banking service provider",
    description:
      "Holds Vantage Foundation Uganda Limited's donation account. This banking relationship is not presented as programme sponsorship.",
    url: "https://www.housingfinance.co.ug/",
  },
];

export function getPublishedPartners(): Partner[] {
  return partners;
}
