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
