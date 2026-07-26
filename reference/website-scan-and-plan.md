# Vantage Foundation Uganda Website — Scan & Plan

Date: 2026-07-17
Project: `vantage-website` (Next.js 16 App Router, React 19, Tailwind 4, TypeScript)

## How we are now

### What's working

- Clean tech stack and build hygiene: `npm run type-check` and `npm run lint` pass.
- Content is centralized in `content/` TypeScript modules, making future edits straightforward.
- Reusable UI components and a semantic layout (`<header>`, `<main>`, `<footer>`) with sticky header, mobile menu, and skip-to-content link.
- The homepage clearly states the purpose and offers two primary CTAs above the fold: "Explore Our Impact" and "Support Our Work".
- SEO plumbing is present: layout metadata, JSON-LD organization schema, `sitemap.ts`, `robots.ts`, and a generated `opengraph-image.tsx`.
- Forms (contact, newsletter, donation intent) use server actions, Zod validation, honeypot fields, and success/error states.
- `ImageOrPlaceholder` ensures missing images degrade gracefully without breaking layouts.

### What's missing or still placeholder

- `public/images/` is empty. All project, story, partner, and team photos currently point to `placeholder-*.jpg` files.
- Team member names and photos are placeholders (`content/team.ts`).
- One partner is a placeholder (`content/partners.ts`).
- Two impact statistics are still `[Number]` placeholders (`content/impact.ts`).
- All downloadable reports are `placeholder: true` (`content/reports.ts`).
- Mobile Money instructions in `content/site.ts` are placeholder text.
- No custom 404 page (`app/not-found.tsx` is missing).
- No page-level metadata; every page falls back to the default layout title/description.
- Analytics and privacy handling are not yet configured.
- A production build (`npm run build`) has not been run yet.

## Plan to get launch-ready

### 1. Content & images (must do before launch)

- Collect real photos, compress and convert to WebP/AVIF, and place them in `public/images/`.
- Update `content/projects.ts`, `content/stories.ts`, `content/team.ts`, and `content/partners.ts` with verified names, bios, descriptions, and image paths.
- Replace the `[Number]` impact placeholders with verified figures in `content/impact.ts`.
- Replace placeholder report entries with real reports in `content/reports.ts` (attach `url` when documents are available).
- Add real Mobile Money instructions to `content/site.ts`.

### 2. UX & trust polish

- Add `app/not-found.tsx` for a custom 404 experience.
- Add `metadata` exports to top-level pages for unique titles and descriptions.
- Double-check mobile contrast, focus visibility, and button hover/focus states.
- Add a cookie/privacy notice if analytics are introduced.

### 3. Functional verification

- Copy `.env.example` to `.env.local` and set:
  - `NEXT_PUBLIC_SITE_URL`
  - `DATABASE_URL`
  - `ADMIN_SECRET`
  - SMTP values if email notifications are needed
- Run `node scripts/setup-db.mjs` against the Neon database and test `/admin/login` → `/admin/donations`.
- Submit test contact, newsletter, and donation-intent forms and confirm database writes and/or email fallback.

### 4. Performance & accessibility pass

- Run `npm run build` and test the production build locally or on a Vercel preview.
- Audit with Lighthouse for LCP, INP, CLS, contrast, and alt text.
- Test at 320px, 375px, 768px, 1024px, and 1440px widths.
- Verify keyboard navigation, 200% zoom, and `prefers-reduced-motion` handling.

### 5. Pre-launch final checks

- Confirm no placeholder strings remain in `content/` (grep for `placeholder` or `\[.*\]`).
- Verify all internal and social links.
- Confirm `sitemap.xml` and `robots.txt` render correctly.
- Configure Vercel with the root directory set to `vantage-website`.
