import { ImpactStat } from "@/types";

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

export const sdgs = [3, 4, 6, 10, 17];
