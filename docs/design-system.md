# Design System

This document describes the design tokens, colors, typography, spacing, and components used on the Vantage Foundation Uganda website.

## Design Tokens

All design tokens are defined as CSS custom properties in `app/globals.css` and mapped to Tailwind CSS utility classes.

### Colors

Brand colors are **teal, white and black**. `--primary` is sampled from the
logo's mid-tone teal; dark sections use Tailwind's native `black`/`white`
(no custom token needed — see below).

| Token | Hex | Tailwind | Usage |
|-------|-----|----------|-------|
| `--background` | `#ffffff` | `bg-white` | Page background |
| `--foreground` | `#000000` | `text-foreground` | Primary text (black) |
| `--primary` | `#0d7280` | `bg-primary`, `text-primary` | Brand color (logo teal) |
| `--primary-dark` | `#0a5964` | `bg-primary-dark` | Hover states |
| `--primary-light` | `#2dd4d4` | `text-primary-light` | Links/accents **on black backgrounds only** — `primary` fails contrast on black |
| `--accent` | `#f59e0b` | `bg-accent` | Highlights (amber-500) |
| `--muted` | `#f5fbfb` | `bg-muted` | Subtle teal-tinted backgrounds |
| `--muted-foreground` | `#3f5566` | `text-muted-foreground` | Secondary text |
| `--border` | `#dceaec` | `border-border` | Borders (teal-tinted) |

Dark sections (footer, "Join the movement" band) use Tailwind's built-in
`bg-black` / `text-white` directly rather than a custom token, since pure
black is already one of the three brand colors.

### Color Contrast

All combinations meet WCAG AA (4.5:1 for normal text):

| Foreground | Background | Ratio | Level |
|------------|------------|-------|-------|
| #000000 | #ffffff | 21.0:1 | AAA |
| #3f5566 | #ffffff | 7.8:1 | AAA |
| #3f5566 | #f5fbfb | 7.4:1 | AAA |
| #ffffff | #0d7280 | 5.6:1 | AA |
| #0d7280 | #ffffff | 5.6:1 | AA |
| #0d7280 | #f5fbfb | 5.4:1 | AA |
| #ffffff | #000000 | 21.0:1 | AAA |
| #2dd4d4 | #000000 | 11.5:1 | AAA |

Note: `#0d7280` (`--primary`) on `#000000` (black) is only 3.7:1 — do not
use `text-primary` for text on black backgrounds; use `text-primary-light`
or `text-white` instead.

## Typography

### Font family

The site uses **Fira Sans** (via `next/font/google`) for all text:
- Display: `swap` (prevents invisible text during load)
- Weights 400/500/600/700 loaded (static weights, not a variable font)
- Defined in `app/layout.tsx`
- Chosen as a free, open-source stand-in for Frutiger (a commercial
  Monotype/Linotype typeface we can't legally bundle without a license) —
  Fira Sans shares Frutiger's clean humanist proportions. If a licensed
  Frutiger font file becomes available, swap it in via `next/font/local`.

### Font sizes

| Element | Class | Size |
|---------|-------|------|
| h1 (hero) | `text-4xl sm:text-5xl lg:text-6xl` | 2.25rem → 3.75rem |
| h1 (page) | SectionHeader `level="h1"` | ~2rem |
| h2 | `text-2xl` or `text-xl` | 1.5rem or 1.25rem |
| h3 | `text-lg` | 1.125rem |
| Body | `text-base` | 1rem |
| Small | `text-sm` | 0.875rem |
| Caption | `text-xs` | 0.75rem |

### Line height

- Headings: `leading-tight` (1.25) or `leading-snug` (1.375)
- Body: `leading-relaxed` (1.625)

## Spacing

The site uses Tailwind's spacing scale (based on 0.25rem = 4px):

| Class | Value | Usage |
|-------|-------|-------|
| `gap-2` | 0.5rem (8px) | Tight gaps between small elements |
| `gap-4` | 1rem (16px) | Standard gap between cards |
| `gap-6` | 1.5rem (24px) | Grid gaps |
| `gap-12` | 3rem (48px) | Section internal spacing |
| `py-16` | 4rem (64px) | Section vertical padding |
| `py-24` | 6rem (96px) | Large section padding |
| `py-32` | 8rem (128px) | Hero section padding |

## Layout

### Container
- `Container` component (`components/shared/Container.tsx`)
- Max width: `max-w-7xl` (80rem / 1280px)
- Horizontal padding: `px-4 sm:px-6 lg:px-8`
- Centered with `mx-auto`

### Grid
- Cards: `grid gap-6 md:grid-cols-2 lg:grid-cols-3`
- Two-column: `grid lg:grid-cols-2 gap-12`
- Five-column (amounts): `grid grid-cols-3 sm:grid-cols-5 gap-2`

## Components

### UI primitives (`components/ui/`)
- **Button**: variants (primary, outline, ghost), sizes (sm, md, lg), can be link or button
- **Card**: rounded-xl, border, shadow-sm, hover:shadow-md
- **Input**: rounded-lg, border, focus:ring-2
- **Select**: styled native select
- **Textarea**: styled native textarea
- **Label**: form label
- **Badge**: variants (default, outline, accent)

### Shared components (`components/shared/`)
- **Container**: max-width wrapper
- **SectionHeader**: eyebrow + title + description, supports `level` prop
- **ImageOrPlaceholder**: next/image with placeholder fallback
- **Breadcrumbs**: nav with aria-label
- **SkipToContent**: accessibility skip link
- **ContactForm**, **DonationForm**, **NewsletterForm**: accessible forms
- **HoneypotFields**: anti-bot fields
- **FieldError**: inline form error
- **FormPrivacyNotice**: privacy link
- **JsonLd**: structured data injection

### Section components (`components/sections/`)
- **Hero**: homepage hero with image and CTAs
- **AboutTeaser**: two-column about preview
- **AreasOfWork**: programme areas grid
- **ImpactSection**: impact stats and SDGs
- **PartnersSection**: partner logos
- **TrustStrip**: trust indicators
- **GetInvolvedSection**: pathways to get involved

## Border Radius

| Class | Value | Usage |
|-------|-------|-------|
| `rounded-lg` | 0.5rem | Inputs, selects |
| `rounded-xl` | 0.75rem | Cards |
| `rounded-2xl` | 1rem | Hero image, large cards |
| `rounded-full` | 9999px | Team photos, pills |

## Shadows

| Class | Usage |
|-------|-------|
| `shadow-sm` | Cards (default) |
| `shadow-md` | Cards on hover |
| `shadow-lg` | Overlays, dropdowns |
| `shadow-xl` | Hero image |

## Focus States

All interactive elements have visible focus indicators:
- `focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2`
- Used on buttons, links, inputs, selects

## Responsive Breakpoints

| Breakpoint | Width | Tailwind prefix |
|------------|-------|-----------------|
| Mobile | < 640px | (default) |
| sm | ≥ 640px | `sm:` |
| md | ≥ 768px | `md:` |
| lg | ≥ 1024px | `lg:` |
| xl | ≥ 1280px | `xl:` |

The site is mobile-first: base styles target mobile, and larger screens add overrides.
