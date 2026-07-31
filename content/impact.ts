import { District, ImpactStat } from "@/types";

export const impactStats: ImpactStat[] = [
  { value: "10,000+", label: "People with clean water access", note: "Kasaale Deep Borehole" },
  { value: "500+", label: "Young women and men reached", note: "SaveGirl Uganda mentorship" },
  { value: "4", label: "Orphanages supported", note: "Food, clothing and essentials" },
  { value: "[Number]", label: "Medical camps conducted", note: "Placeholder — update with verified figure" },
  { value: "[Number]", label: "Workshops hosted since 2021", note: "Mental health, SRH and financial literacy" },
];

/**
 * Returns impact stats that are not placeholders. In development, all
 * stats are returned. In production, stats with "[Number]" values are
 * filtered out.
 */
export function getPublishedImpactStats(): ImpactStat[] {
  const isDev = process.env.NODE_ENV === "development";
  return impactStats.filter((s) => isDev || !s.value.includes("["));
}

export const outputs = [
  "Deep water well constructed and serving over 10,000 people.",
  "Multiple medical camps conducted in rural Uganda.",
  "Semi-annual workshops on mental health, sexual/reproductive health and financial literacy since 2021.",
  "Direct mentorship and book-club activities for youth.",
  "Food and clothing donated to four orphanages.",
  "Support provided to young women on Kalangala Island.",
];

export const outcomes = [
  "Improved access to clean water, health information and menstrual hygiene resources.",
  "Increased confidence, financial literacy and life skills among SaveGirl participants.",
  "Stronger community awareness of mental health, reproductive health and preventive care.",
  "A growing network of young people committed to learning and leadership.",
];

export const longTermGoals = [
  "Minimise infectious diseases and water-borne illness in partner communities.",
  "Make rural education and skills development a sustained community and government priority.",
  "Equip young people with the awareness to lead healthy, productive lives.",
  "Build a self-sustaining, scalable model through agricultural social enterprise and diversified income.",
];

export const regions = [
  "Bushenyi District",
  "Kampala",
  "Kalangala Island",
  "Jinja",
  "Rural districts across Uganda",
];

// Districts where Vantage Foundation Uganda has run programmes, with real
// coordinates for the Uganda map in the impact section. Confirmed by
// management as the districts served.
export const districts: District[] = [
  {
    name: "Kampala",
    description: "Empowering urban youth through mentorship, mental health support and education programmes.",
    lat: 0.3476,
    lon: 32.5825,
  },
  {
    name: "Jinja",
    description: "Home base for Vantage Foundation Uganda's programmes and community partnerships.",
    lat: 0.4233,
    lon: 33.2039,
  },
  {
    name: "Bushenyi",
    description: "Supporting rural communities with youth conferences, mentorship and financial literacy workshops.",
    lat: -0.5417,
    lon: 30.1878,
  },
  {
    name: "Gulu",
    description: "Extending health and education outreach to communities in northern Uganda.",
    lat: 2.7817,
    lon: 32.2992,
  },
  {
    name: "Kiryandongo",
    description: "Strengthening communities through education and sustainable development support.",
    lat: 1.9525,
    lon: 32.1389,
  },
  {
    name: "Namutumba",
    description: "Improving access to health, education and community support services.",
    lat: 0.835,
    lon: 33.685,
  },
  {
    name: "Kayunga",
    description: "Building stronger communities through empowerment and access to opportunity.",
    lat: 0.7033,
    lon: 32.9036,
  },
  {
    name: "Kalangala",
    description: "Providing relief support and mentorship for young women on Kalangala Island.",
    lat: -0.3214,
    lon: 32.2919,
  },
];

export const sdgs = [3, 4, 6, 10, 17];
