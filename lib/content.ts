import { site } from "@/content/site";
import {
  getPublishedProjects,
  getProjectBySlug,
  getProjectSlugs,
} from "@/content/projects";
import {
  getPublishedStories,
  getStoryBySlug,
  getStorySlugs,
} from "@/content/stories";
import { areasOfWork } from "@/content/areas";
import { team } from "@/content/team";
import { partners } from "@/content/partners";
import {
  impactStats,
  outputs,
  outcomes,
  longTermGoals,
  regions,
  sdgs,
} from "@/content/impact";
import { reports } from "@/content/reports";
import { faq } from "@/content/faq";

export const content = {
  site,
  areasOfWork,
  projects: getPublishedProjects(),
  getProjectBySlug,
  getProjectSlugs,
  stories: getPublishedStories(),
  getStoryBySlug,
  getStorySlugs,
  team,
  partners,
  impact: { stats: impactStats, outputs, outcomes, longTermGoals, regions, sdgs },
  reports,
  faq,
};
