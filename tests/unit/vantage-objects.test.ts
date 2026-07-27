import { describe, it, expect } from "vitest";
import {
  buildObjectKey,
  parseObjectKey,
  sanitizeFilename,
  generateMediaId,
  MediaFolder,
} from "@/lib/storage/vantage-objects";

describe("sanitizeFilename", () => {
  it("lowercases and replaces non-alphanumeric chars with dashes", () => {
    expect(sanitizeFilename("My Photo (1).JPG")).toBe("my-photo-1.jpg");
  });

  it("strips path separators and takes the basename", () => {
    expect(sanitizeFilename("C:\\Users\\Gerald\\photo.PNG")).toBe("photo.png");
    expect(sanitizeFilename("/tmp/foo bar.webp")).toBe("foo-bar.webp");
  });

  it("collapses consecutive dashes", () => {
    expect(sanitizeFilename("a---b")).toBe("a-b");
  });

  it("trims leading/trailing dashes", () => {
    expect(sanitizeFilename("--hello--")).toBe("hello");
  });

  it("truncates to 80 chars", () => {
    const long = "a".repeat(200);
    expect(sanitizeFilename(long).length).toBe(80);
  });

  it("falls back to 'file' when the name is empty after sanitising", () => {
    expect(sanitizeFilename("")).toBe("file");
    expect(sanitizeFilename("   ")).toBe("file");
    expect(sanitizeFilename("...")).toBe("file");
  });
});

describe("generateMediaId", () => {
  it("returns a 12-character alphanumeric string", () => {
    const id = generateMediaId();
    expect(id).toHaveLength(12);
    expect(id).toMatch(/^[a-z0-9]+$/);
  });

  it("excludes ambiguous characters (0, O, 1, l)", () => {
    // Run many times to exercise the alphabet thoroughly.
    for (let i = 0; i < 1000; i++) {
      const id = generateMediaId();
      expect(id).not.toMatch(/[01ol]/i);
    }
  });

  it("produces unique values across many calls", () => {
    const ids = new Set<string>();
    for (let i = 0; i < 1000; i++) ids.add(generateMediaId());
    expect(ids.size).toBe(1000);
  });
});

describe("buildObjectKey", () => {
  it("builds a vantage/<folder>/<id>-<filename> key for slug-less folders", () => {
    const key = buildObjectKey({ folder: "gallery", filename: "photo.webp" });
    expect(key).toMatch(/^vantage\/gallery\/[a-z0-9]{12}-photo\.webp$/);
  });

  it("includes the slug segment for programmes", () => {
    const key = buildObjectKey({
      folder: "programmes",
      filename: "kasaale.jpg",
      slug: "Kasaale Borehole",
    });
    expect(key).toMatch(/^vantage\/programmes\/kasaale-borehole\/[a-z0-9]{12}-kasaale\.jpg$/);
  });

  it("includes the slug segment for team", () => {
    const key = buildObjectKey({
      folder: "team",
      filename: "portrait.png",
      slug: "Omara Godfrey",
    });
    expect(key).toMatch(/^vantage\/team\/omara-godfrey\/[a-z0-9]{12}-portrait\.png$/);
  });

  it("uses the supplied id when provided", () => {
    const key = buildObjectKey({
      folder: "documents",
      filename: "report.pdf",
      id: "customid",
    });
    expect(key).toBe("vantage/documents/customid-report.pdf");
  });

  it("sanitises the filename in the key", () => {
    const key = buildObjectKey({
      folder: "logos",
      filename: "Vantage Logo (Final).PNG",
      id: "abc123",
    });
    expect(key).toBe("vantage/logos/abc123-vantage-logo-final.png");
  });
});

describe("parseObjectKey", () => {
  it("parses a slug-less folder key", () => {
    const parsed = parseObjectKey("vantage/gallery/abc123-photo.webp");
    expect(parsed).toEqual({
      folder: "gallery" as MediaFolder,
      slug: undefined,
      id: "abc123",
      filename: "photo.webp",
    });
  });

  it("parses a programmes key with a slug", () => {
    const parsed = parseObjectKey("vantage/programmes/kasaale-borehole/abc123-photo.webp");
    expect(parsed).toEqual({
      folder: "programmes" as MediaFolder,
      slug: "kasaale-borehole",
      id: "abc123",
      filename: "photo.webp",
    });
  });

  it("returns null for keys outside the vantage/ prefix", () => {
    expect(parseObjectKey("academy/foo/bar.png")).toBeNull();
  });

  it("returns null for unknown folders", () => {
    expect(parseObjectKey("vantage/unknown/abc123-photo.webp")).toBeNull();
  });

  it("returns null for malformed filenames (no dash)", () => {
    expect(parseObjectKey("vantage/gallery/nodashtext")).toBeNull();
  });
});
