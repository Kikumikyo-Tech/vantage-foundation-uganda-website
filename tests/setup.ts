import "@testing-library/jest-dom/vitest";
import { afterEach, vi } from "vitest";
import { cleanup } from "@testing-library/react";
import { createElement } from "react";

// Clean up DOM after each test.
afterEach(() => {
  cleanup();
});

// Mock Next.js navigation hooks (jsdom doesn't have real routing).
vi.mock("next/navigation", () => ({
  usePathname: () => "/",
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    back: vi.fn(),
    refresh: vi.fn(),
    prefetch: vi.fn(),
  }),
  useSearchParams: () => new URLSearchParams(),
  redirect: vi.fn(),
}));

// Mock next/image to render a plain img tag (jsdom doesn't support image optimization).
vi.mock("next/image", () => ({
  default: (props: Record<string, unknown>) => {
    // Strip Next.js-specific props that aren't valid HTML attributes.
    const rest = { ...props };
    delete rest.fill;
    delete rest.priority;
    delete rest.placeholder;
    delete rest.blurDataURL;
    delete rest.onLoadingComplete;
    delete rest.loader;
    return createElement("img", rest);
  },
}));
