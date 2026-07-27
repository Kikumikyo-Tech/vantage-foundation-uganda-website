import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./tests/setup.ts"],
    include: ["tests/**/*.test.{ts,tsx}"],
    exclude: ["tests/e2e/**", "node_modules/**"],
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "."),
      // Next.js's `server-only` package throws when imported from a client
      // component. In unit tests we just want it to be a no-op so we can
      // exercise the pure helpers in modules that import it.
      "server-only": resolve(__dirname, "tests/stubs/server-only.ts"),
    },
  },
});
