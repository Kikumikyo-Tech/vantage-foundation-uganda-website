# Design Tokens

The single source of truth for the Vantage Foundation Uganda visual identity system. Tokens are defined as CSS custom properties in `app/globals.css` and mirrored as typed constants in `lib/design-tokens.ts` for JS-side use.

**Principle:** never hard-code colours, spacing, radii, or shadows in components. Always reference a token. If you need a value that doesn't exist, add a token first.

---

## Token sources

| Layer | File | Purpose |
|-------|------|---------|
| CSS (runtime) | `app/globals.css` | `:root` variables + `@theme inline` mapping to Tailwind utilities |
| TypeScript (JS) | `lib/design-tokens.ts` | Typed constants for brand-guide, charts, email, OG image |
| Docs | this file | Human-readable reference |

---

## Colour tokens

### Primary brand palette

| Token | Hex | RGB | Usage |
|-------|-----|-----|-------|
| `--deep-teal` | `#007D8A` | 0,125,138 | Brand anchor (mapped to `--primary`) |
| `--bright-aqua` | `#1CC7D6` | 28,199,214 | Accents only — never body text (contrast 1.9:1 on white) |
| `--ocean-blue` | `#005B7A` | 0,91,122 | Hover/active states (mapped to `--primary-dark`) |
| `--dark-navy` | `#08233A` | 8,35,58 | Body text, dark backgrounds (mapped to `--foreground`, `--navy`) |
| `--white` | `#FFFFFF` | 255,255,255 | Page background |
| `--charcoal` | `#232323` | 35,35,35 | Alternate dark text |

### Semantic surface tokens

| Token | Hex | Tailwind | Usage |
|-------|-----|----------|-------|
| `--background` | `#FFFFFF` | `bg-background` | Page background |
| `--foreground` | `#08233A` | `text-foreground` | Body text |
| `--primary` | `#007D8A` | `bg-primary`, `text-primary` | Buttons, links, brand |
| `--primary-dark` | `#005B7A` | `bg-primary-dark` | Hover/active |
| `--primary-light` | `#1CC7D6` | `bg-primary-light` | Accents (not text on white) |
| `--accent` | `#F59E0B` | `bg-accent` | Warm highlights |
| `--muted` | `#F4F7F9` | `bg-muted` | Subtle surfaces |
| `--muted-foreground` | `#4A6072` | `text-muted-foreground` | Secondary text (7:1 on white) |
| `--border` | `#DCE5EA` | `border-border` | Borders |
| `--surface` | `#F4F7F9` | `bg-surface` | Section backgrounds |
| `--surface-strong` | `#E8EEF2` | `bg-surface-strong` | Cards on muted bg |

### Programme accent colours

Used for categorisation. **Never as body text on white.** Always paired with an icon or text label (WCAG 2.2 §1.4.1 — don't convey information by colour alone).

| Token | Hex | Programme |
|-------|-----|-----------|
| `--programme-health` | `#0F9D58` | Health (emerald) |
| `--programme-education` | `#2563EB` | Education (royal blue) |
| `--programme-water` | `#38BDF8` | Water & WASH (sky blue) |
| `--programme-humanitarian` | `#F97316` | Humanitarian Assistance (warm orange) |
| `--programme-research` | `#7C3AED` | Research (purple) |
| `--programme-environment` | `#15803D` | Environment & Agriculture (forest green) |
| `--programme-youth` | `#06B6D4` | Youth Empowerment (vibrant cyan) |
| `--programme-alert` | `#DC2626` | Emergency / critical alert (red) |

### Status colours

| Token | Hex | Pairing |
|-------|-----|---------|
| `--success` / `--success-bg` / `--success-fg` | `#15803D` / `#DCFCE7` / `#166534` | Success messages |
| `--warning` / `--warning-bg` / `--warning-fg` | `#B45309` / `#FEF3C7` / `#78350F` | Warnings, placeholders |
| `--destructive` / `--destructive-bg` / `--destructive-fg` | `#B91C1C` / `#FEE2E2` / `#7F1D1D` | Errors, destructive actions |
| `--info` / `--info-bg` / `--info-fg` | `#005B7A` / `#E0F2FE` / `#0C4A6E` | Informational |

### Colour usage ratio

```
60% white / neutral space
25% teal family (primary, primary-dark, surface)
10% navy / charcoal (text, dark sections)
5%  programme accents (categorisation only)
```

Gradients are subtle supporting elements only, derived from approved colours (e.g. `linear-gradient(135deg, #007D8A, #005B7A)`).

---

## Typography tokens

Font: **Inter** via `next/font/google`. Fallback: `system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`.

| Token | Size | Weight | Line height | Usage |
|-------|------|--------|-------------|-------|
| `--text-display` | 56px | 700 | 1.1 | Hero headlines |
| `--text-h1` | 40px | 700 | 1.15 | Page titles |
| `--text-h2` | 30px | 600 | 1.2 | Section headings |
| `--text-h3` | 24px | 600 | 1.3 | Subsection headings |
| `--text-h4` | 20px | 600 | 1.4 | Card headings |
| `--text-body-lg` | 18px | 400 | 1.6 | Lead paragraphs |
| `--text-body` | 16px | 400 | 1.625 | Body |
| `--text-body-sm` | 14px | 400 | 1.5 | Small body |
| `--text-caption` | 12px | 400 | 1.4 | Captions, metadata |
| `--text-overline` | 12px | 600 | 1.4 | Eyebrows, labels (tracking 0.08em) |

Max line length for body: **66 characters** (~`max-w-prose`). Avoid excessive uppercase — only for short labels and eyebrows.

---

## Spacing tokens

4px base. Available as `--space-{1,2,3,4,6,8,12,16,20,24,32}`.

| Token | Value | Usage |
|-------|-------|-------|
| `--space-4` | 1rem | Standard gap |
| `--space-6` | 1.5rem | Grid gaps |
| `--space-12` | 3rem | Section internal |
| `--space-16` | 4rem | Section vertical |
| `--space-24` | 6rem | Large section |
| `--space-32` | 8rem | Hero section |

---

## Border radius

| Token | Value | Usage |
|-------|-------|-------|
| `--radius-sm` | 0.375rem | Small chips |
| `--radius-md` | 0.5rem | Inputs |
| `--radius-lg` | 0.75rem | Cards |
| `--radius-xl` | 1rem | Hero, large cards |
| `--radius-2xl` | 1.5rem | Feature panels |
| `--radius-full` | 9999px | Pills, avatars |

---

## Shadows

Navy-tinted (`rgb(8 35 58 / a)`) for brand cohesion.

| Token | Usage |
|-------|-------|
| `--shadow-sm` | Cards (default) |
| `--shadow-md` | Cards on hover |
| `--shadow-lg` | Overlays, dropdowns |
| `--shadow-xl` | Hero image, modals |

---

## Breakpoints

Mobile-first. Tailwind v4 default scale.

| Token | Width | Prefix |
|-------|-------|--------|
| `--bp-sm` | 640px | `sm:` |
| `--bp-md` | 768px | `md:` |
| `--bp-lg` | 1024px | `lg:` |
| `--bp-xl` | 1280px | `xl:` |
| `--bp-2xl` | 1536px | `2xl:` |

---

## Container widths

| Token | Width | Usage |
|-------|-------|-------|
| `--container-md` | 768px | Prose, narrow content |
| `--container-lg` | 1024px | Standard pages |
| `--container-xl` | 1280px | Default site container (`max-w-7xl`) |
| `--container-2xl` | 1440px | Wide galleries |

---

## Transitions

| Token | Duration | Usage |
|-------|----------|-------|
| `--transition-fast` | 150ms | Buttons, inputs |
| `--transition-base` | 200ms | Cards, links |
| `--transition-slow` | 300ms | Modals, overlays |

---

## Z-index scale

| Token | Value | Usage |
|-------|-------|-------|
| `--z-base` | 0 | Default |
| `--z-dropdown` | 1000 | Dropdowns |
| `--z-sticky` | 1020 | Sticky elements |
| `--z-header` | 1030 | Site header |
| `--z-overlay` | 1040 | Overlays |
| `--z-modal` | 1050 | Modals |
| `--z-toast` | 1080 | Toasts |

---

## Image ratios

| Token | Ratio | Usage |
|-------|-------|-------|
| `--ratio-hero` | 16/9 | Hero landscape |
| `--ratio-feature` | 3/2 | Feature landscape |
| `--ratio-card` | 4/3 | Square-ish cards |
| `--ratio-square` | 1/1 | Square cards |
| `--ratio-portrait` | 4/5 | Portrait stories |
| `--ratio-social-portrait` | 9/16 | Social story |
| `--ratio-social-square` | 1/1 | Social square |
| `--ratio-social-landscape` | 1.91/1 | Social landscape / link preview |

---

## Icon sizes

| Token | Value | Usage |
|-------|-------|-------|
| `--icon-sm` | 1rem | Inline |
| `--icon-md` | 1.25rem | Default |
| `--icon-lg` | 1.5rem | Feature |
| `--icon-xl` | 2rem | Hero |

---

## Adding a new token

1. Add the CSS variable to `:root` in `app/globals.css`.
2. If it should be a Tailwind utility, add the mapping in `@theme inline`.
3. Mirror it in `lib/design-tokens.ts`.
4. Document it here.
5. Run `npm run type-check && npm run lint` to verify.
