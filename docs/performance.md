# Performance Budgets & Image Guidelines

This document defines the performance targets for the Vantage Foundation Uganda website and documents the image optimization strategy.

## Performance Budgets

### Core Web Vitals Targets

| Metric | Target | Rationale |
|--------|--------|-----------|
| **LCP** (Largest Contentful Paint) | < 2.5s on 3G | Hero image is the LCP element on most pages |
| **CLS** (Cumulative Layout Shift) | < 0.1 | All images use `fill` with aspect-ratio containers |
| **INP** (Interaction to Next Paint) | < 200ms | Minimal client-side JS (7 client components only) |

### Bundle Size Budgets

| Budget | Target | Notes |
|--------|--------|-------|
| JS per route (gzip) | < 150 KB | Next.js + React + minimal client components |
| CSS per route (gzip) | < 30 KB | Tailwind, purged at build |
| Images per page | < 200 KB total | WebP/AVIF, responsive srcset |

### Network Constraints

The site is designed for mobile-first, low-bandwidth users in Uganda. Test under:
- **Slow 3G**: 400 KB/s, 400ms RTT
- **Viewport widths**: 320px, 375px, 768px, 1024px, 1440px

## Image Optimization Strategy

### Formats

All images are served in **WebP** and **AVIF** formats via `next/image`:
- `next.config.ts` sets `images.formats: ["image/webp", "image/avif"]`
- The browser automatically picks the best format it supports
- AVIF provides ~50% smaller files vs JPEG; WebP provides ~30% smaller

### Responsive Sizing

Images use the `sizes` attribute to tell the browser what width the image will be at different breakpoints. This lets the browser pick the right source from the srcset, avoiding downloading unnecessarily large images on mobile.

**Presets** are defined in `lib/image-presets.ts`:

| Preset | Use case | sizes value |
|--------|----------|-------------|
| `hero` | Homepage hero | 100vw on mobile, 1200px on desktop |
| `detailHero` | Project/story detail hero | 100vw on mobile, 1200px on desktop |
| `card` | Card grids (projects, stories) | 100vw mobile, 50vw tablet, 33vw desktop |
| `half` | Two-column layouts | 100vw mobile, 50vw desktop |
| `team` | Team member photos | 50vw mobile, 33vw tablet, 20vw desktop |
| `banner` | Full-width banners | 100vw |

### Blur Placeholders

All images use `placeholder="blur"` with a lightweight SVG-based blur data URL (`lib/blur-placeholder.ts`). This shows a smooth gray placeholder while the image loads, preventing layout shift and improving perceived performance.

For true per-image blur (where the placeholder is a blurred version of the actual image), use Next.js static image imports which generate `blurDataURL` automatically.

### Lazy Loading

- **Above-the-fold images**: `priority={true}` — preloaded by the browser
- **Below-the-fold images**: default `loading="lazy"` (next/image default) — loaded when scrolled into view

### CLS Prevention

All images use `fill` mode within containers with explicit aspect ratios:
- Hero: `aspect-[4/3]`
- Detail heroes: `aspect-[16/9]`
- Cards: `aspect-[16/10]`
- Team photos: fixed `h-24 w-24` (rounded)

This reserves space for the image before it loads, preventing layout shift.

### Focal Point Cropping

The `ImageOrPlaceholder` component accepts an `objectPosition` prop for focal-point-aware cropping:
```tsx
<ImageOrPlaceholder
  src="/images/hero.jpg"
  alt="Community gathering"
  fill
  objectPosition="center top"
/>
```
Use this when the important part of the image is not centered (e.g., faces in the upper third).

## Client-Side JS Audit

Only 7 components are client-side (`"use client"`):

| Component | Why it's client |
|-----------|----------------|
| `Header` | Mobile menu state, `usePathname` |
| `ContactForm` | `useActionState` for server action |
| `DonationForm` | `useState` + `useActionState` |
| `NewsletterForm` | `useActionState` |
| `CopyBankDetails` | `navigator.clipboard` |
| `ProjectList` | `useState` + `useMemo` for filtering |
| `error.tsx` | Required by Next.js error boundary |

All other components are server-rendered. No accidental client components.

## Testing

### Lighthouse

Run Lighthouse in Chrome DevTools (or via CLI):
```bash
npx lighthouse https://vantage-foundation-uganda-website.vercel.app --preset=desktop --output=html --output-path=./lighthouse-report.html
```

Target scores:
- Performance: 90+
- Accessibility: 95+
- Best Practices: 95+
- SEO: 95+

### Throttled Testing

In Chrome DevTools → Network → Throttling → "Slow 3G":
1. Load the homepage
2. Verify hero image loads within 3 seconds
3. Navigate to /projects and verify card images lazy-load on scroll
4. Check no layout shift during image load

### Vercel Speed Insights

Vercel automatically collects Core Web Vitals from real users. View them in:
Vercel Dashboard → Project → Analytics → Speed Insights
