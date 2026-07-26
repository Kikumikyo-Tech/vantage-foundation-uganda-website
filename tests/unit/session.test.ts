import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";

// Stub process.env.ADMIN_SECRET for tests
const TEST_SECRET = "test-admin-secret-12345";

beforeEach(() => {
  vi.stubEnv("ADMIN_SECRET", TEST_SECRET);
});

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("session tokens", () => {
  it("createSessionToken returns a token with two hex parts", async () => {
    const { createSessionToken } = await import("@/lib/session");
    const { token } = createSessionToken();
    const parts = token.split(".");
    expect(parts.length).toBe(2);
    expect(parts[0]).toMatch(/^[a-f0-9]{64}$/);
    expect(parts[1]).toMatch(/^[a-f0-9]{64}$/);
  });

  it("verifySessionToken accepts a valid token", async () => {
    const { createSessionToken, verifySessionToken } = await import("@/lib/session");
    const { token } = createSessionToken();
    expect(verifySessionToken(token)).toBe(true);
  });

  it("verifySessionToken rejects undefined", async () => {
    const { verifySessionToken } = await import("@/lib/session");
    expect(verifySessionToken(undefined)).toBe(false);
  });

  it("verifySessionToken rejects an empty string", async () => {
    const { verifySessionToken } = await import("@/lib/session");
    expect(verifySessionToken("")).toBe(false);
  });

  it("verifySessionToken rejects a malformed token", async () => {
    const { verifySessionToken } = await import("@/lib/session");
    expect(verifySessionToken("not-a-token")).toBe(false);
  });

  it("verifySessionToken rejects a token with wrong signature", async () => {
    const { createSessionToken, verifySessionToken } = await import("@/lib/session");
    const { token } = createSessionToken();
    // Tamper with the signature part
    const tampered = token.split(".")[0] + "." + "a".repeat(64);
    expect(verifySessionToken(tampered)).toBe(false);
  });

  it("verifySessionToken rejects a token signed with a different secret", async () => {
    const { createSessionToken, verifySessionToken } = await import("@/lib/session");
    const { token } = createSessionToken();
    // Change the secret and verify — should fail
    vi.stubEnv("ADMIN_SECRET", "different-secret");
    expect(verifySessionToken(token)).toBe(false);
  });

  it("sessionCookieName is vantage_admin", async () => {
    const { sessionCookieName } = await import("@/lib/session");
    expect(sessionCookieName).toBe("vantage_admin");
  });

  it("sessionMaxAge is 1 day in seconds", async () => {
    const { sessionMaxAge } = await import("@/lib/session");
    expect(sessionMaxAge).toBe(60 * 60 * 24);
  });
});
