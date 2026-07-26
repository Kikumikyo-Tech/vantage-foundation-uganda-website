import type { MetadataRoute } from "next";
import { site } from "@/content/site";
import { getProjectSlugs } from "@/content/projects";
import { getStorySlugs } from "@/content/stories";
import { areasOfWork } from "@/content/areas";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = site.url;

  const staticRoutes = [
    "/",
    "/about-us",
    "/our-work",
    "/projects",
    "/impact",
    "/stories",
    "/get-involved",
    "/donate",
    "/contact",
    "/reports-and-accountability",
    "/faq",
    "/privacy",
    "/terms",
    "/safeguarding",
    "/accessibility",
  ];

  const routes: MetadataRoute.Sitemap = staticRoutes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: route === "/" ? 1 : 0.8,
  }));

  const programmeRoutes = areasOfWork.map((area) => ({
    url: `${baseUrl}/programmes/${area.id}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const projectRoutes = getProjectSlugs().map((slug) => ({
    url: `${baseUrl}/projects/${slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const storyRoutes = getStorySlugs().map((slug) => ({
    url: `${baseUrl}/stories/${slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [...routes, ...programmeRoutes, ...projectRoutes, ...storyRoutes];
}
