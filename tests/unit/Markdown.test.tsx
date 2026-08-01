import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { Markdown } from "@/components/shared/Markdown";

describe("Markdown article typography", () => {
  it("renders editorial headings and a cited pull quote semantically", () => {
    const { container } = render(
      <Markdown
        variant="article"
        pullQuoteAttribution="Hillary Turyasingura, founding-team member"
      >
        {`Opening paragraph.

> "Advantage is about how that elevated post helps your people."

## Advantage as a Vantage Point`}
      </Markdown>
    );

    expect(container.querySelector("blockquote")).toBeInTheDocument();
    expect(container.querySelector("cite")).toHaveTextContent(
      "Hillary Turyasingura, founding-team member"
    );
    expect(
      screen.getByRole("heading", {
        level: 2,
        name: "Advantage as a Vantage Point",
      })
    ).toBeInTheDocument();
  });
});

describe("Markdown links", () => {
  it("opens external links in a new tab with rel=noopener noreferrer", () => {
    render(<Markdown>{`See [Girl Power USA](https://girlpowerusa.org/) for details.`}</Markdown>);
    const link = screen.getByRole("link", { name: "Girl Power USA" });
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("does not add target/rel to internal links", () => {
    render(<Markdown>{`See our [SaveGirl Uganda project](/projects/savegirl-uganda).`}</Markdown>);
    const link = screen.getByRole("link", { name: "SaveGirl Uganda project" });
    expect(link).not.toHaveAttribute("target");
    expect(link).not.toHaveAttribute("rel");
  });
});
