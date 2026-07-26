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

| File | Format | Dimensions | Role |
|------|--------|------------|------|
| `logos/vantage-logo-primary.png` | PNG | 1448×1086 | Primary / stacked lockup (interim — SVG pending) |
| `logos/vantage-logo-primary-alt.png` | PNG | 1448×1086 | Alternate primary (visually similar — confirm canonical with org) |
| `logos/vantage-logo-horizontal.png` | PNG | 1721×914 | Horizontal lockup for headers, email signatures |

> **SVG logos are the target format.** PNGs are wired in as an interim. When SVGs are supplied, replace the PNGs and update the `Logo` component's default `src` references. See `docs/brand/logo-guidelines.md`.

## Asset governance

See `docs/brand/asset-governance.md` for the full asset lifecycle: naming, consent, storage, review, and withdrawal procedures.
