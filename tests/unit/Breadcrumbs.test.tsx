import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";

describe("Breadcrumbs", () => {
  it("renders all items in order", () => {
    render(
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Projects", href: "/projects" },
          { label: "Kasaale" },
        ]}
      />
    );
    expect(screen.getByText("Home")).toBeInTheDocument();
    expect(screen.getByText("Projects")).toBeInTheDocument();
    expect(screen.getByText("Kasaale")).toBeInTheDocument();
  });

  it("has aria-label='Breadcrumb' on the nav", () => {
    render(
      <Breadcrumbs
        items={[{ label: "Home", href: "/" }, { label: "Page" }]}
      />
    );
    expect(screen.getByLabelText("Breadcrumb")).toBeInTheDocument();
  });

  it("renders links for items with href", () => {
    render(
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Current" },
        ]}
      />
    );
    const homeLink = screen.getByText("Home").closest("a");
    expect(homeLink).toHaveAttribute("href", "/");
  });

  it("marks the last item with aria-current='page'", () => {
    render(
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Current" },
        ]}
      />
    );
    const lastItem = screen.getByText("Current");
    expect(lastItem).toHaveAttribute("aria-current", "page");
  });

  it("does not render a link for the last item", () => {
    render(
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Current" },
        ]}
      />
    );
    const lastItem = screen.getByText("Current");
    expect(lastItem.closest("a")).toBeNull();
  });
});
