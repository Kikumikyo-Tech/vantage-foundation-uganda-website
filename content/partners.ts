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
  {
    name: "Girl Power USA",
    relationshipType: "Programme collaborator",
    description:
      "US-based 501(c)(3) nonprofit collaborating with Vantage Foundation on joint branding and youth programmes — including co-sponsoring the 2022 Bushenyi youth conference and supporting the SaveGirl Uganda initiative since 2021.",
    url: "https://girlpowerusa.org/",
  },
  {
    name: "S.A.L.V.E. International",
    relationshipType: "In-kind programme contributor",
    description:
      "UK- and Uganda-registered charity (\"Support And Love Via Education\") based in Jinja, supporting street-connected children through outreach, halfway homes and family resettlement. Vantage Foundation has donated food and essential supplies to children in their care.",
    url: "https://salveinternational.org/",
  },
  {
    name: "KikumiKyo",
    relationshipType: "Programme and technology partner",
    description:
      "Fintech company partnering with Vantage Foundation on KikumiKyo Academy, a financial literacy and economic empowerment programme for young people.",
    url: "https://kikumikyo.com/",
  },
];

export function getPublishedPartners(): Partner[] {
  return partners;
}
