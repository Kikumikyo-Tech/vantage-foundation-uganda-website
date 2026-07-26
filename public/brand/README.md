# Vantage Foundation Uganda — Brand Asset Library

This directory is the canonical home for all brand assets served by the website.

## Structure

```
public/brand/
  logos/            Logo files (primary, horizontal, symbol, variants)
  icons/            General UI icons (SVG)
  programme-icons/  Programme-specific icons (health, education, water, etc.)
  social/           Social media template exports
  stationery/       Letterhead, business card, email signature assets
  reports/          Report cover and document template assets
  photography/      Curated/hero photography selections (full archive in /images/photos)
  mockups/          Merchandise and field-branding mockups
```

## File naming convention

Use descriptive, kebab-case names with the brand prefix and variant suffix:

```
vantage-logo-primary.svg
vantage-logo-primary-dark.svg          (for dark backgrounds)
vantage-logo-horizontal.svg
vantage-logo-horizontal-light.svg
vantage-symbol.svg
vantage-symbol-monochrome-black.svg
vantage-symbol-monochrome-white.svg
vantage-programme-icon-health.svg
vantage-social-instagram-profile.png
```

**Never** use names like `IMG_1234.jpg`, `final-logo2.png`, or `new-copy.png`.

## Current logo files

Confirmed canonical by the org (2026-07-27) — matches the SVG set supplied in
`vantage-foundation-uganda-svg-logos.zip`, verified byte-identical to what's
already wired in below.

| File | Role |
|------|------|
| `logos/vantage-logo-primary.svg` | Primary / stacked lockup, light backgrounds |
| `logos/vantage-logo-primary-dark.svg` | Primary lockup, dark backgrounds |
| `logos/vantage-logo-primary-grayscale.svg` | Grayscale variant |
| `logos/vantage-logo-primary-monochrome-black.svg` | Monochrome black (e.g. print, watermarks) |
| `logos/vantage-logo-primary-monochrome-white.svg` | Monochrome white (dark/photo backgrounds) |
| `logos/vantage-logo-horizontal.svg` | Horizontal lockup, light backgrounds (headers, email) |
| `logos/vantage-logo-horizontal-light.svg` | Horizontal lockup, dark backgrounds |
| `logos/vantage-symbol.svg` | Symbol-only mark, theme-independent |

Consumed via the `Logo` component (`components/shared/Logo.tsx`) — do not
redraw, regenerate, reinterpret, or replace these files. See
`docs/brand/logo-guidelines.md`.

## Asset governance

See `docs/brand/asset-governance.md` for the full asset lifecycle: naming, consent, storage, review, and withdrawal procedures.
