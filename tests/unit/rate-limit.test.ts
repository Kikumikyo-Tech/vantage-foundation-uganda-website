import { describe, it, expect, beforeEach } from "vitest";
import {
  rateLimit,
  recordFailure,
  isLockedOut,
  clearFailures,
} from "@/lib/rate-limit";

beforeEach(() => {
  // Clear all buckets and lockouts before each test by clearing known keys.
  for (let i = 0; i < 100; i++) {
    clearFailures(`test-key-${i}`);
    clearFailures(`admin-login-lockout:test-ip-${i}`);
  }
});

describe("rateLimit", () => {
  it("allows requests within the limit", () => {
    const key = "test-key-rate-allow";
    clearFailures(key);
    expect(rateLimit({ key, limit: 3, windowMs: 60_000 })).toBe(true);
    expect(rateLimit({ key, limit: 3, windowMs: 60_000 })).toBe(true);
    expect(rateLimit({ key, limit: 3, windowMs: 60_000 })).toBe(true);
  });

  it("blocks requests exceeding the limit", () => {
    const key = "test-key-rate-block";
    clearFailures(key);
    rateLimit({ key, limit: 2, windowMs: 60_000 });
    rateLimit({ key, limit: 2, windowMs: 60_000 });
    expect(rateLimit({ key, limit: 2, windowMs: 60_000 })).toBe(false);
  });
});

describe("recordFailure and isLockedOut", () => {
  it("does not lock out before threshold", () => {
    const key = "admin-login-lockout:test-ip-1";
    clearFailures(key);
    recordFailure({ key, maxFailures: 5, lockoutMs: 60_000, windowMs: 60_000 });
    recordFailure({ key, maxFailures: 5, lockoutMs: 60_000, windowMs: 60_000 });
    const { locked } = isLockedOut(key);
    expect(locked).toBe(false);
  });

  it("locks out after threshold is reached", () => {
    const key = "admin-login-lockout:test-ip-2";
    clearFailures(key);
    for (let i = 0; i < 5; i++) {
      recordFailure({ key, maxFailures: 5, lockoutMs: 60_000, windowMs: 60_000 });
    }
    const { locked } = isLockedOut(key);
    expect(locked).toBe(true);
  });

  it("reports remaining seconds when locked", () => {
    const key = "admin-login-lockout:test-ip-3";
    clearFailures(key);
    for (let i = 0; i < 5; i++) {
      recordFailure({ key, maxFailures: 5, lockoutMs: 60_000, windowMs: 60_000 });
    }
    const { locked, remainingSeconds } = isLockedOut(key);
    expect(locked).toBe(true);
    expect(remainingSeconds).toBeGreaterThan(0);
    expect(remainingSeconds).toBeLessThanOrEqual(60);
  });

  it("clearFailures resets the lockout", () => {
    const key = "admin-login-lockout:test-ip-4";
    clearFailures(key);
    for (let i = 0; i < 5; i++) {
      recordFailure({ key, maxFailures: 5, lockoutMs: 60_000, windowMs: 60_000 });
    }
    expect(isLockedOut(key).locked).toBe(true);
    clearFailures(key);
    expect(isLockedOut(key).locked).toBe(false);
  });

  it("rateLimit returns false when locked out", () => {
    const key = "admin-login-lockout:test-ip-5";
    clearFailures(key);
    for (let i = 0; i < 5; i++) {
      recordFailure({ key, maxFailures: 5, lockoutMs: 60_000, windowMs: 60_000 });
    }
    // Now locked out — rateLimit should also return false
    expect(rateLimit({ key, limit: 100, windowMs: 60_000 })).toBe(false);
  });
});
