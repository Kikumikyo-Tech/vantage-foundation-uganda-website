import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Button } from "@/components/ui/Button";

describe("Button", () => {
  it("renders children text", () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText("Click me")).toBeInTheDocument();
  });

  it("renders as a button when no href is provided", () => {
    render(<Button>Test</Button>);
    const button = screen.getByText("Test").closest("button");
    expect(button).not.toBeNull();
  });

  it("renders as a link when href is provided", () => {
    render(<Button href="/about">Link</Button>);
    const link = screen.getByText("Link").closest("a");
    expect(link).not.toBeNull();
    expect(link).toHaveAttribute("href", "/about");
  });

  it("calls onClick when clicked", async () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Click</Button>);
    await userEvent.click(screen.getByText("Click"));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("is disabled when disabled prop is true", () => {
    render(<Button disabled>Disabled</Button>);
    const button = screen.getByText("Disabled").closest("button");
    expect(button).toBeDisabled();
  });

  it("applies variant classes", () => {
    render(<Button variant="outline">Outline</Button>);
    const button = screen.getByText("Outline").closest("button");
    expect(button?.className).toContain("border");
  });
});
