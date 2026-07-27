# Vantage Foundation Uganda — Visual Identity & Brand Audit

**Date:** 2026-07-26
**Auditor:** Devin (automated + manual review)
**Scope:** `vantage-website` repository — frontend, design tokens, assets, content, docs

---

## 1. Executive summary

The repository is a well-engineered Next.js 16 / React 19 / Tailwind v4 marketing and donation-intent site. The codebase is type-clean, lint-clean, accessible-by-design, and has a solid component library, content model, and media manifest. **However, the actual Vantage Foundation Uganda brand identity is entirely absent from the live site.** The real logos sit unused in `vantage_photos/`, while the header, footer, favicon, and OpenGraph image all render a placeholder "V" badge. There is no brand-guide page, no brand asset directory, no programme accent colours, and no visual identity documentation beyond a technical `design-system.md`.

The organisation's photographic archive is a major strategic asset: 89 authentic field photos (boreholes, community gatherings, health outreach, education) are processed into AVIF + WebP with alt text and a consent manifest. These are ready to anchor the visual identity.

The highest-leverage work is: (1) wire the real logo in everywhere, (2) expand the colour system to the full Vantage palette with programme accents, (3) build a live `/brand-guide` page, and (4) write the brand documentation set. Social-media, field-branding, stationery, and report templates are deferred to a follow-up pass.

---

## 2. Current state

### 2.1 Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16.2.12 (App Router, Turbopack) |
| UI | React 19.2.4, TypeScript 5 |
| Styling | Tailwind CSS v4 (CSS-based `@theme` config, no `tailwind.config.*`) |
| Fonts | Inter via `next/font/google` |
| Icons | `lucide-react` ^1.24.0 |
| Forms | React `useActionState` + Next.js Server Actions |
| DB | Neon PostgreSQL (serverless) — `donations` table only |
| Deployment | Vercel |

### 2.2 Design tokens (`app/globals.css`)

A minimal 8-variable token set exists:

```css
:root {
  --background: #ffffff;
  --foreground: #0f172a;
  --primary: #0f766e;      /* teal-700 */
  --primary-dark: #115e59; /* teal-800 */
  --accent: #f59e0b;       /* amber-500 */
  --muted: #f8fafc;
  --muted-foreground: #475569;
  --border: #e2e8f0;
}
```

Mapped into Tailwind via `@theme inline`. No navy, no aqua, no charcoal, no programme accent colours, no semantic success/warning/destructive tokens (those are hardcoded as `bg-green-100`/`bg-red-100` etc. in components).

### 2.3 Logo status — CRITICAL GAP

| Location | Current rendering | Real logo used? |
|----------|------------------|-----------------|
| `components/layout/Header.tsx:85-88` | Placeholder `<span>V</span>` in a teal rounded square | No |
| `components/layout/Footer.tsx:14-16` | Plain text "Vantage Foundation Uganda" | No |
| `app/opengraph-image.tsx:28-43` | Programmatic white square with teal "V" | No |
| `app/favicon.ico` | Exists (256×256) — content unverified | No |
| `app/icon.tsx` / `app/apple-icon.tsx` | Do not exist | No |

Three real logo PNGs exist in `vantage_photos/` but are **not referenced anywhere**:

| File | Dimensions | Likely role |
|------|------------|-------------|
| `vantage foundation uganda primary logo.png` | 1448×1086 | Primary / stacked lockup |
| `vantage foundation logo.png` | 1448×1086 | Alternate primary (visually identical dimensions — needs human diff) |
| `vantage logo.png` | 1721×914 | Horizontal lockup (wide aspect) |

> **Visual confirmation needed:** I cannot render images to verify the visual content, colours, or differences between the two 1448×1086 files. A human must confirm which is canonical. Filenames strongly imply `vantage foundation uganda primary logo.png` is the primary mark.

### 2.4 Photography — STRONG ASSET

- **Raw:** `vantage_photos/` — ~80 JPGs with UUID filenames + 4 `.jpeg.url` files pointing to ChatGPT backend URLs.
- **Processed:** `public/images/photos/` — 89 photos × 2 formats (`.avif` + `.webp`) = 178 files. EXIF/IPTC/ICC metadata stripped, max 1920px, sequential naming `photo-001`…`photo-089`.
- **Manifest:** `content/media.ts` — single source of truth with alt text, consent status, credit, dimensions, original-filename mapping. 89/89 published, consent marked verified.
- **Naming problem:** Raw UUIDs are non-descriptive; processed names are sequential but not semantic (no programme/project/location in the filename). The manifest carries the metadata, so this is acceptable but not ideal for asset management.

### 2.5 Component inventory

- `components/ui/` — 7 primitives: Button, Card, Badge, Input, Label, Select, Textarea
- `components/shared/` — 19 components: Container, SectionHeader, ImageOrPlaceholder, Breadcrumbs, SkipToContent, ContactForm, DonationForm, NewsletterForm, ProjectCard, StoryCard, StatCard, FieldError, FormPrivacyNotice, HoneypotFields, JsonLd, Markdown, CopyBankDetails, AreaIcon
- `components/sections/` — 10 homepage sections: Hero, TrustStrip, AboutTeaser, AreasOfWork, FeaturedProjects, ImpactSection, StoriesSection, GetInvolvedSection, PartnersSection, NewsletterSection
- `components/layout/` — Header, Footer
- `components/gallery/` — GalleryGrid (lightbox)
- `components/projects/` — ProjectList (filterable)

### 2.6 Pages (`app/`)

Home, About Us, Our Work, Projects (+ `[slug]`), Programmes `[slug]`, Impact, Stories (+ `[slug]` + RSS), Gallery, Get Involved, Donate, Contact, FAQ, Reports & Accountability, Privacy, Terms, Safeguarding, Accessibility, Admin (login + donations), API (admin login/logout/verify). Plus `sitemap.ts`, `robots.ts`, `opengraph-image.tsx`, `error.tsx`, `loading.tsx`, `not-found.tsx`.

### 2.7 Existing docs (`docs/`)

11 files: accessibility, content-model, deployment, design-system, editorial-guidelines, implementation-plan, media-guidelines, performance, pre-launch-checklist, safeguarding-and-consent, technical-audit. **No brand identity docs, no logo guidelines, no colour system doc, no brand-guide page.**

### 2.8 Content (`content/`)

12 modules: site, areas, projects, stories, team, partners, impact, reports, faq, donate, media, README. Typed via `types/index.ts`, validated by `lib/validate-content.ts`.

---

## 3. Major inconsistencies

1. **Logo is fake everywhere.** The placeholder "V" badge is the most visible brand element on the site and in social shares, but it is not the real Vantage logo.
2. **Two colour systems coexist.** CSS variables define `--primary: #0f766e` (teal-700), but components also hardcode `bg-slate-800`, `text-amber-950`, `bg-green-100`, `bg-red-100`, `text-slate-500`, etc. — bypassing the token system.
3. **OG image gradient** (`#0d9488`→`#0f766e`) uses a third teal not present in any token.
4. **Email template** (`app/actions.ts:180-196`) uses a fourth palette (`#1c4e64` header, `#374151`/`#4b5563` text) unrelated to the site tokens.
5. **No programme accent colours.** Health, Education, WASH, Humanitarian, Youth, Research are visually indistinguishable — all use the same teal. The `AreaIcon` component switches Lucide icons but not colours.
6. **Tagline mismatch.** `content/site.ts:6` says "Changing the world, one advantage at a time." The brief specifies "Change the World One Advantage at a Time." Minor but should be confirmed.
7. **Values list is truncated.** `content/site.ts:11` lists only 4 values (`["Growth", "Sustainability", "Safety", "Inclusivity"]`) vs. 10 in the brief.
8. **Favicon is unverified.** `app/favicon.ico` exists but no `app/icon.tsx`/`app/apple-icon.tsx` for modern PWA/retina favicons.
9. **No `public/brand/` directory.** Logos, icons, social templates have no home.

---

## 4. Accessibility concerns

- **Good baseline:** Skip link, focus-visible outlines, reduced-motion support, semantic landmarks, aria-labelled mobile menu with focus trap, form error roles.
- **Colour contrast:** Current `--primary` #0f766e on white = 5.5:1 (AA pass for normal text). The new Deep Teal #007D8A on white = ~4.6:1 (AA pass, borderline). Bright Aqua #1CC7D6 on white = ~1.9:1 (**fails** — aqua is an accent only, never text on white). Navy #08233A on white = ~16:1 (AAA). All combinations must be re-verified after migration.
- **Programme colour risk:** If programme accents convey category by colour alone (e.g. a coloured dot), that fails WCAG 2.2 §1.4.1. Always pair colour with an icon or text label.
- **Logo alt text:** The placeholder "V" has no alt — the Link has `aria-label={site.name}` which is acceptable, but a real `<Image>` needs descriptive alt.
- **Brand-guide page:** Must itself meet AA — colour swatches need text labels with contrast ratios, not colour alone.

---

## 5. Missing assets

| Asset | Status | Priority |
|-------|--------|----------|
| Primary logo (SVG) | Not in repo; PNG exists in `vantage_photos/` | Critical |
| Horizontal logo (SVG) | Not in repo; PNG exists | Critical |
| Symbol-only logo (SVG) | Not in repo | Critical |
| Monochrome black / white / grayscale variants | Not in repo | High |
| `app/icon.tsx` (favicon) | Missing | High |
| `app/apple-icon.tsx` | Missing | High |
| Programme icons (consistent set) | Partial — `AreaIcon` uses ad-hoc Lucide icons | Medium |
| `public/brand/` directory | Missing | Critical |
| Social media templates | Missing | Deferred |
| Stationery templates | Missing | Deferred |
| Field signage templates | Missing | Deferred |

---

## 6. Technical limitations

1. **No SVG logos.** PNGs don't scale crisply for favicons or large signage. SVGs are the correct format; user has indicated they will supply SVG files. PNGs will be wired as an interim.
2. **Tailwind v4 CSS-config.** No `tailwind.config.js` — all theme extension happens via `@theme` in `globals.css`. Programme accent colours must be added as `--color-programme-*` tokens to be usable as `bg-programme-health` etc.
3. **No design-tokens.ts.** JS-side access to tokens (for the brand-guide page, charts, email templates) requires either duplicating values or a shared TS module.
4. **Image rendering limitation.** I could not visually verify the 3 logo PNGs or the 89 photos. Logo canonical selection and photo content/consent review require a human.

---

## 7. Recommended improvements & implementation order

### Phase 1 — Audit (this document)
Done.

### Phase 2 — Brand foundations & logo wiring
1. Create `public/brand/logos/` and copy the 3 PNGs with descriptive names (`vantage-logo-primary.png`, `vantage-logo-horizontal.png`, `vantage-symbol.png`). Document SVG replacement as a follow-up.
2. Build a `Logo` component (`components/shared/Logo.tsx`) supporting variant (`primary` | `horizontal` | `symbol`), theme (`light` | `dark`), and size props — SVG-ready, PNG-fallback.
3. Wire `Logo` into Header (horizontal), Footer (primary or horizontal), `app/opengraph-image.tsx` (symbol or primary), and create `app/icon.tsx` + `app/apple-icon.tsx` (symbol).
4. Expand `app/globals.css` tokens to the full Vantage palette: Deep Teal, Bright Aqua, Ocean Blue, Dark Navy, White, Charcoal + 8 programme accents. Add typography scale, spacing, radii, shadows, z-index, breakpoints, transitions tokens.
5. Migrate `--primary` from `#0f766e` to Deep Teal `#007D8A`; update hardcoded `slate`/`amber`/`green`/`red` usages to semantic tokens where practical.
6. Add programme accent tokens and wire them into `AreaIcon` / `AreasOfWork` / `ProjectCard` so each programme has a recognisable colour paired with its icon.

### Phase 3 — Design tokens, brand-guide page & docs
1. Create `lib/design-tokens.ts` (typed single source of truth for JS) and `docs/design-tokens.md`.
2. Build `/brand-guide` route: live visual guide showing logo variants + clear-space + misuse, colour swatches with contrast ratios, typography scale, button/card/icon/image-treatment examples, accessibility guidance. Public but `noindex`.
3. Write `docs/brand/` doc set: brand-foundations, logo-guidelines, colour-system, typography, photography, iconography, voice-and-messaging, accessibility, asset-governance.
4. Add `/brand-guide` to `robots.ts` disallow + exclude from `sitemap.ts`; link in footer.

### Phase 4 — Website application polish (follow-up)
Refine homepage sections, programme pages, project template, impact section to use the new palette and programme accents at full depth.

### Phase 5–7 — Asset management, templates, testing (follow-up)
Social/field/stationery/report templates; full asset rename; comprehensive cross-device and a11y testing.

---

## 8. Items requiring organisational approval

1. **Canonical primary logo** — confirm `vantage foundation uganda primary logo.png` is the official mark and clarify the difference vs. `vantage foundation logo.png`.
2. **True vector SVG logo files** — ✅ **DELIVERED AND ACCEPTED (2026-07-26).**
   A first batch was rejected (raster-wrapped SVGs, 2.4–2.7 MB, no `<path>`).
   A second batch was delivered as true vector SVGs (8 files, under 15 KB each,
   `<path>` geometry, text outlined, correct viewBox, accessible). All 8 variants
   are now in `public/brand/logos/` and wired into the `Logo` component and
   favicon. An earlier batch was rejected (see `docs/brand/logo-guidelines.md`
   § "SVG spec" for the rejection history and prevention checklist).
3. **Tagline wording** — "Change the World One Advantage at a Time" (brief) vs. "Changing the world, one advantage at a time." (current `content/site.ts`).
4. **Full values list** — confirm all 10 values should be surfaced (current site shows 4).
5. **Office location** — `content/site.ts` has a TODO: address says Ishaka/Bushenyi but city says Jinja. Unrelated to branding but blocks launch credibility.
6. **Programme accent colour assignments** — the brief specifies which colour per programme; confirm before rollout (e.g. Health = Emerald, Education = Royal Blue).
7. **Photo consent review** — manifest says 89/89 verified, but a human must visually confirm no children/patients are exposed in ways that require additional consent.

---

## 9. Files touched in this audit

- **Added:** `docs/brand-audit.md` (this file)

No existing files were modified during the audit.
