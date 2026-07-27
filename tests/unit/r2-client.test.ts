import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";

// Test the pure helpers in lib/storage/r2-client.ts (src encoding/decoding,
// allowed-types map, size limits) without touching the network or real R2
// credentials. The S3Client is only constructed lazily inside getR2Client(),
// so importing the helpers below does not require valid env vars.

describe("r2-client src helpers", () => {
  it("getPublicSrc prefixes the key with r2://", async () => {
    const { getPublicSrc } = await import("@/lib/storage/r2-client");
    expect(getPublicSrc("vantage/gallery/abc-photo.webp")).toBe(
      "r2://vantage/gallery/abc-photo.webp"
    );
  });

  it("isR2Src detects r2://-prefixed values", async () => {
    const { isR2Src } = await import("@/lib/storage/r2-client");
    expect(isR2Src("r2://vantage/gallery/abc.webp")).toBe(true);
    expect(isR2Src("/images/photos/photo-001.webp")).toBe(false);
    expect(isR2Src("https://cdn.example.com/foo.webp")).toBe(false);
  });

  it("objectKeyFromSrc strips the r2:// prefix", async () => {
    const { objectKeyFromSrc } = await import("@/lib/storage/r2-client");
    expect(objectKeyFromSrc("r2://vantage/gallery/abc.webp")).toBe(
      "vantage/gallery/abc.webp"
    );
    // Non-r2 srcs are returned as-is.
    expect(objectKeyFromSrc("/images/photos/photo-001.webp")).toBe(
      "/images/photos/photo-001.webp"
    );
  });
});

describe("ALLOWED_UPLOAD_TYPES", () => {
  it("includes common image types and PDF", async () => {
    const { ALLOWED_UPLOAD_TYPES } = await import("@/lib/storage/r2-client");
    expect(ALLOWED_UPLOAD_TYPES["image/jpeg"]).toBe(".jpg");
    expect(ALLOWED_UPLOAD_TYPES["image/png"]).toBe(".png");
    expect(ALLOWED_UPLOAD_TYPES["image/webp"]).toBe(".webp");
    expect(ALLOWED_UPLOAD_TYPES["image/avif"]).toBe(".avif");
    expect(ALLOWED_UPLOAD_TYPES["application/pdf"]).toBe(".pdf");
  });

  it("does NOT include text/html or application/javascript", async () => {
    const { ALLOWED_UPLOAD_TYPES } = await import("@/lib/storage/r2-client");
    expect(ALLOWED_UPLOAD_TYPES["text/html"]).toBeUndefined();
    expect(ALLOWED_UPLOAD_TYPES["application/javascript"]).toBeUndefined();
  });
});

describe("MAX_UPLOAD_BYTES", () => {
  it("is 10 MB", async () => {
    const { MAX_UPLOAD_BYTES } = await import("@/lib/storage/r2-client");
    expect(MAX_UPLOAD_BYTES).toBe(10 * 1024 * 1024);
  });
});

describe("getObjectStorageRuntimeEnv", () => {
  const validEnv = {
    R2_ENDPOINT: "https://abc.r2.cloudflarestorage.com",
    R2_ACCESS_KEY_ID: "keyid",
    R2_SECRET_ACCESS_KEY: "secret",
    R2_BUCKET_NAME: "vantage-bucket",
  };

  beforeEach(() => {
    vi.stubEnv("R2_ENDPOINT", validEnv.R2_ENDPOINT);
    vi.stubEnv("R2_ACCESS_KEY_ID", validEnv.R2_ACCESS_KEY_ID);
    vi.stubEnv("R2_SECRET_ACCESS_KEY", validEnv.R2_SECRET_ACCESS_KEY);
    vi.stubEnv("R2_BUCKET_NAME", validEnv.R2_BUCKET_NAME);
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("returns the parsed env when all vars are set", async () => {
    const { getObjectStorageRuntimeEnv } = await import("@/lib/env");
    const env = getObjectStorageRuntimeEnv();
    expect(env).toEqual(validEnv);
  });

  it("throws when R2_ENDPOINT is missing", async () => {
    vi.stubEnv("R2_ENDPOINT", "");
    const { getObjectStorageRuntimeEnv } = await import("@/lib/env");
    expect(() => getObjectStorageRuntimeEnv()).toThrow(/Object storage environment is incomplete/);
  });

  it("throws when R2_ENDPOINT is not an https URL", async () => {
    vi.stubEnv("R2_ENDPOINT", "http://insecure.example.com");
    const { getObjectStorageRuntimeEnv } = await import("@/lib/env");
    expect(() => getObjectStorageRuntimeEnv()).toThrow(/Object storage environment is incomplete/);
  });

  it("throws when R2_BUCKET_NAME is too short", async () => {
    vi.stubEnv("R2_BUCKET_NAME", "ab");
    const { getObjectStorageRuntimeEnv } = await import("@/lib/env");
    expect(() => getObjectStorageRuntimeEnv()).toThrow(/Object storage environment is incomplete/);
  });
});
