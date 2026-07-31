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
    name: "Lunette",
    description:
      "Manufacturer of the UN-recommended menstrual cups distributed through the Menstrual Cups Project.",
    url: "https://www.lunette.com/",
  },
  {
    name: "Kikumikyo Technologies",
    description:
      "Technology partner supporting Vantage Foundation Uganda's website and digital presence.",
  },
  {
    name: "iMental Uganda",
    description:
      "Mental health partner supporting Vantage Foundation Uganda's mental health and wellbeing initiatives.",
  },
  {
    name: "Girl Power USA",
    description:
      "US-based 501(c)(3) nonprofit collaborating with Vantage Foundation on joint branding, youth programmes and healthcare initiatives — including co-sponsoring the 2022 Bushenyi youth conference, supporting the SaveGirl Uganda initiative since 2021, and partnering on healthcare outreach in Uganda alongside S.A.L.V.E. International.",
    url: "https://girlpowerusa.org/",
  },
  {
    name: "S.A.L.V.E. International",
    description:
      "UK- and Uganda-registered charity (\"Support And Love Via Education\") based in Jinja, supporting street-connected children through outreach, halfway homes and family resettlement. Vantage Foundation has donated food and essential supplies to children in their care.",
    url: "https://salveinternational.org/",
  },
];

// NOTE: Lunette, Kikumikyo Technologies and iMental Uganda logos are pending
// from the partner organisations — logo fields intentionally omitted above
// (renders as an "Image coming soon" placeholder) until provided.

/**
 * Returns partners that are not placeholders. In development, all
 * partners are returned (including placeholders for previewing). In
 * production, placeholder partners are filtered out.
 */
export function getPublishedPartners(): Partner[] {
  const isDev = process.env.NODE_ENV === "development";
  return partners.filter((p) => isDev || !p.placeholder);
}
