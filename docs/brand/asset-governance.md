# Asset Governance

## Asset library structure

```
public/brand/
  logos/            Logo files (primary, horizontal, symbol, variants)
  icons/            General UI icons (SVG)
  programme-icons/  Programme-specific icons
  social/           Social media template exports
  stationery/       Letterhead, business card, email signature
  reports/          Report cover and document template assets
  photography/      Curated/hero selections (full archive in /images/photos)
  mockups/          Merchandise and field-branding mockups

public/images/photos/   Processed field photography (AVIF + WebP)
vantage_photos/         Raw original photography (UUID filenames, not served)
```

## Naming convention

Use descriptive, kebab-case names with the brand prefix and variant suffix.

### Approved names

```
vantage-logo-primary.svg
vantage-logo-primary-dark.svg
vantage-logo-primary-monochrome-black.svg
vantage-logo-primary-monochrome-white.svg
vantage-logo-primary-grayscale.svg
vantage-logo-horizontal.svg
vantage-logo-horizontal-light.svg
vantage-symbol.svg
vantage-symbol-monochrome-white.svg
vantage-programme-icon-health.svg
vantage-social-instagram-profile.png
vantage-foundation-borehole-kasaale-2026-01.webp
```

### Forbidden names

```
IMG_1234.jpg
final-final-logo2.png
new-logo-copy.png
Untitled-1.svg
```

## Storage

- **Served assets:** `public/brand/` and `public/images/photos/` — committed to the repository, deployed with the site
- **Raw originals:** `vantage_photos/` — committed but not served; preserved as the source of truth for reprocessing
- **Never commit:** credentials, unreleased donor data, unconsented photos of identifiable people (the manifest in `content/media.ts` gates publication)

## Consent framework

Every published image of an identifiable person requires consent verification. The `content/media.ts` manifest tracks:

| Field | Values |
|-------|--------|
| `consent` | `verified`, `group-consent`, `none`, `pending` |
| `consentNotes` | Free text — who verified, when, scope |
| `published` | `true` / `false` |

### Rules

- **Children:** require parental/guardian consent; never publish real names
- **Patients:** no visible medical records, conditions, or treatment details
- **Group consent:** acceptable for crowd scenes where no individual is the clear, identifiable subject
- **Pending:** image is not published (`published: false`) until a human reviewer verifies consent

See `docs/safeguarding-and-consent.md` for the full safeguarding policy.

## Lifecycle

1. **Capture** — photographer records location, date, programme, project
2. **Process** — `scripts/process-images.js` strips EXIF, resizes, converts to AVIF + WebP
3. **Manifest** — entry added to `content/media.ts` with alt text and consent status
4. **Review** — human verifies consent and writes descriptive alt text
5. **Publish** — set `published: true` only after consent verification
6. **Withdraw** — any subject can request removal; set `published: false` and document the request

## Approval process for new brand assets

1. Designer creates the asset following the brand guide
2. Asset is named per the convention and placed in the correct `public/brand/` subfolder
3. A reviewer checks: brand consistency, accessibility, clear-space, contrast
4. Approved assets are committed with a descriptive commit message
5. The `/brand-guide` page is updated if the asset introduces a new variant

## What must never change without leadership approval

- The logo symbol and wordmark
- The teal brand identity (`--primary`)
- The organisation name spelling ("Vantage Foundation Uganda")
- The tagline ("Change the World One Advantage at a Time")
- The programme accent colour assignments
- The font choice (Inter)

## Withdrawal procedure

If a subject requests image removal:

1. Set `published: false` in `content/media.ts` for that asset
2. Add a `withdrawalNotes` comment documenting the request and date
3. Run `npm run validate-content` to confirm the manifest is valid
4. Deploy — the image will no longer appear on the site
5. Do not delete the file from `public/images/photos/` (it may be needed for audit); only the manifest gate changes
