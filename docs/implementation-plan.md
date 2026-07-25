# Vantage Foundation Uganda Website — Implementation Plan

**Source:** GitHub Issue #1 (Devin master task)
**Phase 1 audit:** [`docs/technical-audit.md`](./technical-audit.md)
**Strategy:** Incremental improvement on the existing Next.js 16 architecture (no rewrite — see audit §11 and §13).

This plan is a phased checklist. Each phase is independently shippable. Phases are ordered by dependency and launch-readiness impact. **No phase should be merged to `main` without management approval for any content it depends on (see audit §12).**

---

## Phase 1 — Audit and baseline fixes ✅ (this PR)

- [x] Inspect entire repository (routes, components, APIs, content, assets, env, deployment)
- [x] Install dependencies and record baseline (lint, type-check, build, tests, audit)
- [x] Inspect application at mobile and desktop sizes
- [x] Identify broken, unfinished, duplicated, unsafe, inaccessible, and poorly designed areas
- [x] Check for hard-coded content, placeholders, fake stats, missing images, broken links, exposed secrets, unhandled errors
- [x] Review Neon database and Nodemailer usage
- [x] Write `docs/technical-audit.md` with classified findings
- [x] Write `docs/implementation-plan.md` (this file)
- [x] Recommend incremental improvement vs partial rebuild (recommendation: incremental)
- [x] Apply clearly-safe baseline fixes only:
  - [x] Add `app/not-found.tsx` (branded 404)
  - [x] Fix `ImageOrPlaceholder` to treat missing files as placeholders (stop HTTP 400s)
  - [x] Remove redundant category-matching clause in `app/our-work/page.tsx`
- [x] Open draft pull request (do not merge)

**Blocker for Phase 2:** management answers to audit §12 items 1-3 (impact figures, team names/photos, Mobile Money) and item 8 (photograph consent).

---

## Phase 2 — Content and image foundation (requires management input)

Goal: replace every public placeholder with verified content and authentic, consent-cleared images.

- [ ] **Management approval gate:** collect verified answers to audit §12 items 1-8 and 10-11.
- [ ] Organise `vantage photos/` into `public/images/` by programme/project/year/location, with meaningful filenames.
- [ ] Strip EXIF metadata from all published images (especially GPS).
- [ ] Compress and convert images to WebP/AVIF; define image size presets per usage (hero, card, thumbnail, OG).
- [ ] Write descriptive alt text for every image based on visible content (no invented names for children/vulnerable people).
- [ ] Build a lightweight image/media manifest (TS module or JSON) with fields: filename, alt, caption, credit, date, location, programme, consent status, consent notes.
- [ ] Replace `content/team.ts` placeholders with verified names, roles, bios, and photos (with consent).
- [ ] Replace `content/partners.ts` placeholder with verified partner (or remove if none).
- [ ] Replace `content/impact.ts` `[Number]` placeholders with verified figures and reporting periods.
- [ ] Verify or correct the "10,000+" and "500+" figures across `Hero.tsx`, `TrustStrip.tsx`, `ImpactSection.tsx`, `impact/page.tsx`, and `content/projects.ts`.
- [ ] Replace `content/reports.ts` placeholders with real documents (host in `public/reports/` or external URL).
- [ ] Add verified Mobile Money details to `content/site.ts`.
- [ ] Fix the `contact.address` ("Ishaka, Bushenyi, Uganda") vs `contact.city` ("Jinja") mismatch per management.
- [ ] Add the 5th programme pillar (Youth leadership & community empowerment) to `content/areas.ts` and `types/index.ts`.
- [ ] Add `docs/media-guidelines.md` and `docs/safeguarding-and-consent.md`.

---

## Phase 3 — Information architecture and core pages

Goal: implement the routes the issue requires, with real content and sensible empty states.

- [ ] Add `/about/history`, `/about/team`, `/about/governance` (split from current `/about-us` or add as sections).
- [ ] Add `/programmes` overview and `/programmes/health`, `/programmes/education`, `/programmes/humanitarian-action`, `/programmes/wash`, `/programmes/youth-leadership`.
- [ ] Add `/partners` page (or confirm the decision to fold into `/get-involved`).
- [ ] Add `/volunteer` and `/partner-with-us` (or confirm the decision to fold into `/get-involved` + `/contact`).
- [ ] Add `/gallery` with curated photo stories (not an unstructured dump) backed by the media manifest.
- [ ] Add `/privacy`, `/terms`, `/safeguarding`, `/accessibility` policy pages (flag sections requiring legal approval).
- [ ] Add `app/error.tsx` global error boundary and `app/loading.tsx` for dynamic routes.
- [ ] Add breadcrumbs and breadcrumb structured data.
- [ ] Add article (`Article`) and event (`Event`) structured data where applicable.
- [ ] Add RSS feed for stories (`/stories/rss.xml` or `/feed.xml`).
- [ ] Update `app/sitemap.ts` to include all new routes.
- [ ] Add `docs/content-model.md` documenting the typed content schema.

---

## Phase 4 — Content model and editorial architecture

Goal: make the content system robust enough for non-developer updates and consent-aware media handling.

- [ ] Extend `types/index.ts` `Project` with: `reportingPeriod`, `fundingStatus`, `startDate`, `endDate`, `documents`, `seo` (title, description, ogImage), `published` (boolean), `consent` classification.
- [ ] Extend `types/index.ts` `Story` with: `tags`, `consentClassification`, `relatedProjectSlugs` (already present), `seo`, `published`.
- [ ] Add a `MediaAsset` type and media manifest module.
- [ ] Validate all content modules with Zod schemas at build time (a `lib/validate-content.ts` called from a prebuild script).
- [ ] Add a `published` flag and filter unpublished content from production routes (keep visible in dev).
- [ ] Document the editorial workflow in `docs/editorial-guidelines.md`.
- [ ] Evaluate MDX for long-form story bodies (optional — only if the team needs richer formatting than markdown).

---

## Phase 5 — Forms and email flows

Goal: make every form safe, accessible, and abuse-resistant.

- [ ] Add rate limiting to contact, newsletter, donation-intent, and admin login (in-memory or Upstash Redis if deployed to Vercel).
- [ ] Add CSRF tokens to admin forms (or migrate admin actions to server actions with origin checks).
- [ ] Improve honeypot: add a second honeypot with a realistic field name and a time-trap field.
- [ ] Add per-form field-level error display (currently only a single concatenated message).
- [ ] Add idempotency to donation-intent (prevent duplicate submissions from double-clicks).
- [ ] Sanitise and escape all user-controlled content in email bodies (currently `formatBody` does `Object.entries` join — safe for plain text but should be explicit).
- [ ] Validate `SMTP_FROM` format at startup.
- [ ] Add safe HTML email templates (optional — plain text is currently sent).
- [ ] Add a documented email configuration section to README and `docs/deployment.md`.
- [ ] Add a privacy notice to every form ("We will only use your details to respond to your enquiry…").

---

## Phase 6 — Media optimisation and performance

Goal: mobile-first, low-bandwidth performance.

- [ ] Define image size presets and `sizes` attributes per component (hero, card, thumbnail).
- [ ] Add `placeholder="blur"` with generated blur data URLs for above-the-fold images.
- [ ] Lazy-load all below-the-fold images (default in `next/image` — verify).
- [ ] Set explicit `width`/`height` on all images to prevent CLS.
- [ ] Add focal-point-aware cropping for hero images (using `objectPosition`).
- [ ] Define and document performance budgets (LCP < 2.5s on 3G, JS bundle < 150 KB gzip per route, no layout shift).
- [ ] Audit and reduce client-side JS (only `Header`, `ProjectList`, forms, `CopyBankDetails` are client — verify no accidental client components).
- [ ] Add `next/font` display=swap (already set) and preconnect to Google Fonts.
- [ ] Test under throttled 3G network conditions at 320px, 375px, 768px, 1024px, 1440px.
- [ ] Run Lighthouse and record scores in `docs/deployment.md`.

---

## Phase 7 — Accessibility (WCAG 2.2 AA)

Goal: no major accessibility failures in critical flows.

- [ ] Audit heading order on every page (single h1, no skipped levels).
- [ ] Verify colour contrast for all text on primary, slate-50, white, and amber backgrounds.
- [ ] Add visible focus indicators to all interactive elements (Button has them; verify custom buttons in `DonationForm` and `Header` mobile menu).
- [ ] Trap focus in the mobile menu dialog and restore focus on close.
- [ ] Add `aria-label` to all icon-only buttons and links.
- [ ] Add `aria-describedby` to form fields with hints/errors.
- [ ] Add screen-reader announcements for form submission states (already `role="status"` — verify).
- [ ] Verify keyboard navigation through the project filter, FAQ accordion, and mobile menu.
- [ ] Add captions or transcripts for any video.
- [ ] Test with a screen reader (NVDA or VoiceOver) on critical journeys.
- [ ] Add automated axe-core checks to CI.
- [ ] Document manual testing in `docs/accessibility.md` (new).

---

## Phase 8 — SEO and structured data

Goal: complete, accurate, non-spammy discoverability.

- [ ] Add unique `metadata` to every page (most have it; verify `/projects` and `/stories` index pages have descriptions).
- [ ] Add canonical URLs to all pages.
- [ ] Add Open Graph images per project and per story (currently only the generated default).
- [ ] Add `noindex` to `/admin/*` and any preview/staging routes.
- [ ] Add `Article` structured data to story pages.
- [ ] Add `BreadcrumbList` structured data.
- [ ] Add `Event` structured data where event stories have dates.
- [ ] Verify `sitemap.xml` and `robots.txt` render correctly in production.
- [ ] Add a social sharing image per page (or confirm the generated default is sufficient).
- [ ] Avoid keyword stuffing and fabricated claims (content review).

---

## Phase 9 — Security and privacy

Goal: production-ready security posture.

- [ ] Upgrade `next` to latest 16.x patch (fixes postcss and sharp advisories).
- [ ] Upgrade `nodemailer` to 9.x (fixes 3 high-severity advisories; verify no breaking changes).
- [ ] Run `npm audit` clean (or document accepted residual risk).
- [ ] Add security headers in `next.config.ts`: CSP, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy.
- [ ] Replace admin shared-secret cookie with a signed session token (HMAC of a random session ID using `ADMIN_SECRET` as the key).
- [ ] Add admin login rate limiting and lockout.
- [ ] Add an audit log to donation status changes (who, when, before, after).
- [ ] Add a data retention and deletion policy for the `donations` table (with a `deleted_at` column and a scheduled cleanup).
- [ ] Ensure the privacy policy accurately reflects actual data collection (forms, donations, no analytics yet).
- [ ] Add safeguarding-aware media and data handling guidance to `docs/safeguarding-and-consent.md`.
- [ ] Remove the two large PDFs from `reference/` (requires history rewrite — coordinate with management).
- [ ] Add `docs/deployment.md` with security notes.

---

## Phase 10 — Tests and CI

Goal: confidence without slowing down the team.

- [ ] Add a GitHub Actions CI workflow: install, lint, type-check, build, test.
- [ ] Install Vitest for unit tests; add tests for `lib/utils.ts`, content helpers, and Zod schemas.
- [ ] Add React Testing Library component tests for `ContactForm`, `DonationForm`, `NewsletterForm`, `Header` (mobile menu), `ProjectList` (filtering).
- [ ] Add Playwright E2E tests for the 8 critical journeys in the issue:
  1. Visit homepage and navigate to a programme.
  2. Open a project detail page.
  3. Submit a contact enquiry.
  4. Submit a volunteer enquiry.
  5. Open donation information.
  6. Read an article or story.
  7. Use the site fully on mobile navigation.
  8. Use major flows with keyboard only.
- [ ] Add axe-core accessibility checks to E2E.
- [ ] Add a broken-link checker to CI.
- [ ] Document the test strategy in the README.

---

## Phase 11 — Documentation

Goal: a project-specific, complete README and docs set.

- [ ] Replace the default README with a project-specific one: purpose, stack, architecture, local setup, env vars, commands, content workflow, media workflow, testing, deployment, database/migrations, email config, security notes, troubleshooting.
- [ ] Finalise `docs/technical-audit.md` (update with post-fix status).
- [ ] Finalise `docs/content-model.md`.
- [ ] Finalise `docs/design-system.md` (design tokens, colours, typography, spacing, components).
- [ ] Finalise `docs/media-guidelines.md`.
- [ ] Finalise `docs/deployment.md`.
- [ ] Finalise `docs/editorial-guidelines.md`.
- [ ] Finalise `docs/safeguarding-and-consent.md`.
- [ ] Add `docs/accessibility.md`.

---

## Phase 12 — Pre-launch final checks

- [ ] Confirm no placeholder strings remain in `content/` (grep for `placeholder`, `[`, `]`).
- [ ] Verify all internal and social links.
- [ ] Verify `sitemap.xml` and `robots.txt` in production.
- [ ] Configure Vercel with root directory `vantage-website` and all env vars.
- [ ] Run `node scripts/setup-db.mjs` against production Neon.
- [ ] Test `/admin/login` → `/admin/donations` end-to-end in production.
- [ ] Submit test contact, newsletter, and donation-intent forms; confirm DB writes and/or email fallback.
- [ ] Run Lighthouse on production.
- [ ] Test at 320px, 375px, 768px, 1024px, 1440px.
- [ ] Verify keyboard navigation and 200% zoom.
- [ ] Verify `prefers-reduced-motion`.
- [ ] Get management sign-off on all public content.

---

## Decisions requiring Vantage Foundation management approval

(Tracked in audit §12 and §15. The implementation cannot proceed past Phase 2 without these.)

1. Verified impact figures (10,000+ and 500+) with reporting period and source.
2. Team member names, photos, and bios (with consent).
3. Mobile Money details.
4. Partner list (with consent, especially "Housing Finance Bank").
5. Annual report, financial statements, safeguarding policy, governance manual, Kasaale report documents.
6. Organisation registration number, NGO status, tax-exempt status.
7. Safeguarding policy text and approval.
8. Photograph consent and safeguarding review for the 73 photos in `vantage photos/`.
9. Donor data retention and deletion policy.
10. Bank account details accuracy and approval to publish.
11. Contact details accuracy (Ishaka vs Jinja mismatch).
12. Founding date accuracy (December 2020).
13. Social media accounts to link.
14. Confirmed site domain.
