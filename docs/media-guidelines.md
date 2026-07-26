# Media Guidelines

This document describes how images are processed, stored, and managed on the
Vantage Foundation Uganda website.

## Image processing pipeline

All raw photos in `vantage photos/` are processed through
`scripts/process-images.js` before being published:

1. **Metadata stripping**: All EXIF, IPTC, ICC, and XMP metadata is removed.
   This includes GPS coordinates, camera serial numbers, timestamps, and
   software fingerprints. This is a critical safeguarding measure — GPS
   coordinates in photos of vulnerable people can reveal their location.

2. **Resizing**: Images are resized to a maximum of 1920px on the longest
   side, preserving aspect ratio. This is sufficient for full-bleed hero
   images on retina displays while keeping file sizes reasonable.

3. **Format conversion**: Each image is converted to:
   - **WebP** (quality 82) — primary format, supported by all modern browsers
   - **AVIF** (quality 60) — next-generation format, 30-50% smaller than WebP

4. **Output**: Processed images are saved to `public/images/photos/` with
   sequential filenames (`photo-001.webp` through `photo-089.webp`).

5. **Manifest generation**: `scripts/generate-media-manifest.js` creates
   `content/media.ts` with one `MediaAsset` entry per image.

### Running the pipeline

```bash
# Process all photos in "vantage photos/"
node scripts/process-images.js

# Regenerate content/media.ts from the manifest template
node scripts/generate-media-manifest.js

# Validate all content (including media manifest)
npm run validate-content
```

### Results (initial run)

- 89 photos processed
- 50.8 MB → 19.7 MB WebP (61% reduction)
- All metadata stripped (no GPS, no camera info, no dates)
- All entries have `consent: "pending"` and `published: false`

## Image size presets

The following presets should be used when displaying images:

| Usage | Max width | `sizes` attribute | Priority |
|-------|-----------|-------------------|----------|
| Hero (full-bleed) | 1920px | `100vw` (mobile), `50vw` (desktop) | `priority` |
| Project/story card | 800px | `33vw` (desktop), `50vw` (tablet), `100vw` (mobile) | lazy |
| Thumbnail | 400px | `25vw` (desktop), `50vw` (mobile) | lazy |
| OG image | 1200x630px | N/A (not rendered in page) | N/A |

## Next.js Image component

All images should be rendered through `next/image` (via `ImageOrPlaceholder`)
which provides:
- Automatic responsive `srcset` generation
- Lazy loading for below-the-fold images
- Automatic format negotiation (WebP/AVIF)
- Prevention of layout shift with explicit `width`/`height`

## Folder structure

```
public/images/
  photos/           # All processed photos (photo-001.webp, etc.)
    photo-001.webp
    photo-001.avif
    ...
  og/               # Open Graph images (1200x630px)
  placeholder-*.jpg # Placeholder images for missing content
```

When human reviewers categorize photos by programme/project, they may
reorganize `public/images/photos/` into subdirectories:
```
public/images/
  projects/
    kasaale-borehole/
    savegirl-uganda/
    ...
  stories/
  team/
  partners/
  general/
```

## Human review checklist

Before setting `published: true` for any photo in `content/media.ts`:

1. **View the photo** and write descriptive alt text based on visible content.
   - Do NOT invent names for children or vulnerable people.
   - Use "a young student" not "Jane, 14".
   - Describe what is happening, not who is in the photo.

2. **Verify consent** for all identifiable individuals:
   - Is there written consent on file? → `consent: "verified"`
   - Is it a wide shot where individuals are not identifiable? → `consent: "group-consent"`
   - Are there no people featured? → `consent: "none"`
   - Is consent still being sought? → `consent: "pending"` (do NOT publish)

3. **Categorize** the photo:
   - Set `programme` to the area id (health, education, humanitarian, water, youth-leadership)
   - Set `projectSlug` if the photo relates to a specific project
   - Set `caption`, `credit`, `date`, and `location` where known

4. **Safeguarding review** for photos featuring children:
   - Could this photo put the child at risk of identification or harm?
   - Is the child in a dignified pose and context?
   - Is the child adequately clothed?
   - Would the child or their guardian be comfortable with this photo being
     publicly visible on the internet?

If any answer is "no" or "unsure", do NOT publish the photo.

## Backup

The original raw photos in `vantage photos/` should be backed up securely
and not committed to the git repository (they contain personal data and
are large). The processed WebP/AVIF files in `public/images/photos/` are
committed to the repository.
