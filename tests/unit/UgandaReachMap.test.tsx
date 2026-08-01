import { describe, it, expect } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { UgandaReachMap } from "@/components/sections/UgandaReachMap";
import { reachDistricts } from "@/content/reach";

describe("UgandaReachMap", () => {
  it("renders every district name at least once (map pin + list entry)", () => {
    render(<UgandaReachMap />);
    for (const d of reachDistricts) {
      expect(screen.getAllByText(d.name).length).toBeGreaterThan(0);
    }
  });

  it("renders a real link to a linked project's page (works without JS, no click required)", () => {
    render(<UgandaReachMap />);
    const districtWithProject = reachDistricts.find((d) => (d.projectSlugs?.length ?? 0) > 0);
    expect(districtWithProject).toBeDefined();
    // Every linked project should already be rendered as a real <a href> in
    // the accessible list, not hidden behind an interaction.
    const allLinks = screen.getAllByRole("link");
    const projectLinks = allLinks.filter((a) =>
      a.getAttribute("href")?.startsWith("/projects/")
    );
    expect(projectLinks.length).toBeGreaterThan(0);
  });

  it("shows an honest fallback for a district with no linked project", () => {
    render(<UgandaReachMap />);
    const unlinked = reachDistricts.find((d) => !d.projectSlugs || d.projectSlugs.length === 0);
    expect(unlinked).toBeDefined();
    expect(
      screen.getAllByText(/Programme activity reaches this area/i).length
    ).toBeGreaterThan(0);
  });

  it("map pins are real buttons (keyboard-focusable, not hover-only divs)", () => {
    render(<UgandaReachMap />);
    const pinButtons = screen
      .getAllByRole("button")
      .filter((b) => b.hasAttribute("aria-expanded"));
    expect(pinButtons.length).toBe(reachDistricts.length * 2); // one map pin + one list toggle per district
  });

  it("selecting a district via keyboard expands it (aria-expanded) without requiring hover", async () => {
    const user = userEvent.setup();
    render(<UgandaReachMap />);

    const firstDistrict = reachDistricts[0];
    // The district name also appears in the map pin's (aria-hidden) tooltip
    // span, so scope to the <li> ancestor rather than matching text directly.
    const matches = screen.getAllByText(firstDistrict.name);
    const listItem = matches.map((el) => el.closest("li")).find((li) => li !== null);
    expect(listItem).not.toBeNull();
    const toggleButton = within(listItem as HTMLElement).getByRole("button");

    expect(toggleButton).toHaveAttribute("aria-expanded", "false");
    await user.tab(); // move focus into the document
    toggleButton.focus();
    await user.keyboard("{Enter}");
    expect(toggleButton).toHaveAttribute("aria-expanded", "true");

    // Toggling again (keyboard Space) collapses it.
    await user.keyboard(" ");
    expect(toggleButton).toHaveAttribute("aria-expanded", "false");
  });

  it("the map graphic is decorative (aria-hidden) so screen readers rely on the accessible list, not the SVG", () => {
    const { container } = render(<UgandaReachMap />);
    const svg = container.querySelector("svg");
    expect(svg).toHaveAttribute("aria-hidden", "true");
  });
});
