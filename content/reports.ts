import { Report } from "@/types";

export const reports: Report[] = [
  {
    title: "Annual Report 2024",
    date: "2024",
    type: "Annual report",
    description: "Year in review, programme highlights, financial summary and plans for 2025.",
    placeholder: true,
  },
  {
    title: "Financial Statements 2024",
    date: "2024",
    type: "Financial report",
    description: "Audited or reviewed financial statements.",
    placeholder: true,
  },
  {
    title: "Safeguarding Policy",
    date: "2024",
    type: "Policy",
    description: "How Vantage Foundation protects children, young people and vulnerable adults.",
    placeholder: true,
  },
  {
    title: "Governance Manual",
    date: "2024",
    type: "Governance",
    description: "Board structure, roles and accountability frameworks.",
    placeholder: true,
  },
  {
    title: "Kasaale Deep Borehole Project Report",
    date: "2022",
    type: "Project report",
    description: "Construction process, community engagement and outcomes of the Kasaale well.",
    placeholder: true,
  },
];

/**
 * Returns reports that are not placeholders. In development, all
 * reports are returned (including placeholders for previewing). In
 * production, placeholder reports are filtered out.
 */
export function getPublishedReports(): Report[] {
  const isDev = process.env.NODE_ENV === "development";
  return reports.filter((r) => isDev || !r.placeholder);
}
