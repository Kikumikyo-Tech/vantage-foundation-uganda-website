import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ArticleShare } from "@/components/blog/ArticleShare";

describe("ArticleShare", () => {
  const url =
    "https://www.vantagefoundationuganda.com/blog/what-we-mean-when-we-say-advantage";

  beforeEach(() => {
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: { writeText: vi.fn().mockResolvedValue(undefined) },
    });
  });

  it("renders labelled standard share links", () => {
    render(<ArticleShare title="Advantage" url={url} />);

    expect(
      screen.getByRole("link", { name: /LinkedIn/i })
    ).toHaveAttribute("href", expect.stringContaining("linkedin.com"));
    expect(
      screen.getByRole("link", { name: /Facebook/i })
    ).toHaveAttribute("href", expect.stringContaining("facebook.com"));
    expect(
      screen.getByRole("link", { name: /WhatsApp/i })
    ).toHaveAttribute("href", expect.stringContaining("wa.me"));
    expect(
      screen.getByRole("button", { name: "Copy article link" })
    ).toBeInTheDocument();
  });

  it("copies the canonical URL and announces success", async () => {
    const user = userEvent.setup();
    const writeText = vi
      .spyOn(navigator.clipboard, "writeText")
      .mockResolvedValue(undefined);
    render(<ArticleShare title="Advantage" url={url} />);

    await user.click(
      screen.getByRole("button", { name: "Copy article link" })
    );

    expect(writeText).toHaveBeenCalledWith(url);
    expect(
      screen.getByText("Article link copied to your clipboard.")
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Copy article link" })).toHaveTextContent(
      "Copied"
    );
  });
});
