import { describe, it, expect, vi } from "vitest";
import { areasOfWork, projectCategoriesByAreaId } from "@/content/areas";
import { getPublishedProjects, getProjectSlugs, getProjectsByCategory } from "@/content/projects";
import { getPublishedStories, getStorySlugs } from "@/content/stories";
import { getPublishedTeam } from "@/content/team";
import { getPublishedPartners } from "@/content/partners";
import { getPublishedReports } from "@/content/reports";
import { getPublishedImpactStats } from "@/content/impact";

describe("areasOfWork", () => {
  it("has 5 programme areas", () => {
    expect(areasOfWork).toHaveLength(5);
  });

  it("includes youth-leadership as the 5th pillar", () => {
    expect(areasOfWork[4].id).toBe("youth-leadership");
  });

  it("each area has id, title, summary, description, items, and icon", () => {
    for (const area of areasOfWork) {
      expect(area.id).toBeTruthy();
      expect(area.title).toBeTruthy();
      expect(area.summary).toBeTruthy();
      expect(area.description).toBeTruthy();
      expect(area.items.length).toBeGreaterThan(0);
      expect(area.icon).toBeTruthy();
    }
  });

  it("has a category mapping for every area", () => {
    for (const area of areasOfWork) {
      expect(projectCategoriesByAreaId[area.id]).toBeDefined();
      expect(projectCategoriesByAreaId[area.id].length).toBeGreaterThan(0);
    }
  });
});

describe("getPublishedProjects", () => {
  it("returns projects", () => {
    const projects = getPublishedProjects();
    expect(projects.length).toBeGreaterThan(0);
  });

  it("each project has slug, title, summary, category, and status", () => {
    for (const project of getPublishedProjects()) {
      expect(project.slug).toBeTruthy();
      expect(project.title).toBeTruthy();
      expect(project.summary).toBeTruthy();
      expect(project.category).toBeTruthy();
      expect(project.status).toBeTruthy();
    }
  });
});

describe("getProjectSlugs", () => {
  it("returns slug strings", () => {
    const slugs = getProjectSlugs();
    expect(slugs.length).toBeGreaterThan(0);
    for (const slug of slugs) {
      expect(typeof slug).toBe("string");
    }
  });
});

describe("getProjectsByCategory", () => {
  it("filters projects by category", () => {
    const healthProjects = getProjectsByCategory("Health");
    for (const p of healthProjects) {
      expect(p.category).toBe("Health");
    }
  });
});

describe("getPublishedStories", () => {
  it("returns stories", () => {
    const stories = getPublishedStories();
    expect(stories.length).toBeGreaterThan(0);
  });

  it("each story has slug, title, excerpt, and category", () => {
    for (const story of getPublishedStories()) {
      expect(story.slug).toBeTruthy();
      expect(story.title).toBeTruthy();
      expect(story.excerpt).toBeTruthy();
      expect(story.category).toBeTruthy();
    }
  });
});

describe("getStorySlugs", () => {
  it("returns slug strings", () => {
    const slugs = getStorySlugs();
    expect(slugs.length).toBeGreaterThan(0);
  });
});

describe("getPublishedTeam", () => {
  it("returns an array", () => {
    const team = getPublishedTeam();
    expect(Array.isArray(team)).toBe(true);
  });

  it("in production, filters out placeholder members", () => {
    vi.stubEnv("NODE_ENV", "production");
    const team = getPublishedTeam();
    for (const member of team) {
      expect(member.placeholder).not.toBe(true);
    }
    vi.unstubAllEnvs();
  });
});

describe("getPublishedPartners", () => {
  it("returns an array", () => {
    const partners = getPublishedPartners();
    expect(Array.isArray(partners)).toBe(true);
  });
});

describe("getPublishedReports", () => {
  it("returns an array", () => {
    const reports = getPublishedReports();
    expect(Array.isArray(reports)).toBe(true);
  });
});

describe("getPublishedImpactStats", () => {
  it("returns an array", () => {
    const stats = getPublishedImpactStats();
    expect(Array.isArray(stats)).toBe(true);
  });

  it("in production, filters out [Number] placeholder stats", () => {
    vi.stubEnv("NODE_ENV", "production");
    const stats = getPublishedImpactStats();
    for (const stat of stats) {
      expect(stat.value).not.toContain("[");
    }
    vi.unstubAllEnvs();
  });
});
