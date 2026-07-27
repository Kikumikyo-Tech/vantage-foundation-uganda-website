# Photography Direction

Authentic Vantage Foundation Uganda photography is the organisation's primary visual asset. The archive in `content/media.ts` (89 photos) anchors the visual identity.

## Preferred imagery

Prioritise photographs showing:
- Real communities
- Volunteers in action
- Field implementation (borehole drilling, water access)
- Health and education activities
- Students learning, facilitators teaching
- Community gatherings
- Humanitarian distribution
- Partnerships
- Smiles and positive interaction
- Visible results and before-and-after progress

## Principles

Images should feel:
- Natural
- Respectful
- Active
- Hopeful
- Documentary
- Locally grounded
- Emotionally honest
- Non-exploitative

## Avoid

- Excessive stock photography
- Pity-based imagery
- Dehumanising close-ups
- Images that expose vulnerable people unnecessarily
- Heavy filters, extreme saturation, excessive HDR
- Misleading staging
- Poor-quality screenshots
- Images that reveal private medical information
- Images without appropriate consent

## Crop presets

| Preset | Ratio | Usage |
|--------|-------|-------|
| Hero landscape | 16:9 | Homepage hero, page headers |
| Feature landscape | 3:2 | Story cards, feature images |
| Square card | 4:3 | Project cards, programme cards |
| Square | 1:1 | Gallery thumbnails, social square |
| Portrait story | 4:5 | Story features, profile stories |
| Report banner | 16:9 | Report covers and section banners |
| Social portrait | 9:16 | Instagram/Facebook stories |
| Social square | 1:1 | Instagram posts |
| Social landscape | 1.91:1 | Link previews, Twitter/X, LinkedIn |
| Thumbnail | 1:1 | Gallery thumbnails |

## Treatment standards

- **Brightness:** natural, slightly lifted shadows — never crushed
- **Contrast:** moderate — avoid HDR-style local contrast
- **Colour temperature:** warm-neutral (~5200K daylight); avoid cold blue casts
- **Overlays:** navy or teal at 30-50% opacity for text-on-image; never rainbow
- **Text placement:** always on an overlay panel or solid area, never over busy detail
- **Rounded corners:** `rounded-xl` (1rem) for cards, `rounded-2xl` for hero
- **Captions:** caption style (12px, muted-foreground), include credit where available

## Responsive loading

- Use `next/image` via `ImageOrPlaceholder` for all images
- AVIF + WebP served automatically (files in `public/images/photos/`)
- `sizes` attribute set via `lib/image-presets.ts` presets
- `placeholder="blur"` with shared blur data URL
- Lazy-loaded by default; `priority` only for above-the-fold hero images

## Asset taxonomy

Organise and tag photographs by:

```
programme/        health, education, water, humanitarian, youth, research
project/          kasaale-borehole, home-of-hope-jinja, ...
year/             2024, 2025, 2026
location/         kasaale, jinja, ishaka, ...
photographer/     name or "staff" or "volunteer"
consent-status/   verified, group-consent, none, pending
orientation/      landscape, portrait, square
usage-rights/     public, internal-only, partner-restricted
```

The manifest in `content/media.ts` carries these fields. The raw archive uses UUID filenames (legacy); processed files use `photo-001`…`photo-089` sequential naming with metadata in the manifest.

## Consent and safeguarding

See [safeguarding-and-consent.md](../safeguarding-and-consent.md) and [asset-governance.md](./asset-governance.md) for the full consent framework. Key rules:

- Every identifiable person requires consent verification before publication
- Children require parental/guardian consent
- No real names of children in captions or alt text
- Medical privacy: no visible medical records, conditions, or treatment details
- Withdrawal: any subject can request removal at any time
