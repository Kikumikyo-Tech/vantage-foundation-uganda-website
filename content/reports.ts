import type { Report } from "@/types";

// Public reports are listed only after an approved document URL is available.
// The empty array is intentional: the reports page explains the current
// publication status without presenting unfinished documents as evidence.
export const reports: Report[] = [];

export function getPublishedReports(): Report[] {
  return reports;
}
