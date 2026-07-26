# Pre-Launch Checklist

This document tracks the final checks before public launch. Run through this checklist after all content is verified and before pointing the custom domain to the site.

## Automated Checks

Run these commands locally before deploying:

```bash
# Lint — 0 errors, 0 warnings
npm run lint

# Type-check — no errors
npm run type-check

# Content validation — all Zod schemas pass
npm run validate-content

# Placeholder check — lists remaining placeholders
npm run check-placeholders

# Broken link check — lists potentially broken internal links
npm run check-links

# Unit tests — all pass
npm test

# E2E tests (requires build first)
npm run build
npm run test:e2e

# Production build — passes with no errors
npm run build
```

## Content Checks

- [ ] No placeholder strings remain in `content/` (run `npm run check-placeholders`)
- [ ] All team member names, photos, and bios are verified (with consent)
- [ ] All partner information is verified (with consent)
- [ ] All impact figures are verified with reporting period and source
- [ ] "10,000+" and "500+" figures verified across Hero, TrustStrip, ImpactSection, impact page
- [ ] All reports are real documents (not placeholders)
- [ ] Mobile Money details are verified
- [ ] Bank account details are verified and approved for publishing
- [ ] Contact details are accurate (Ishaka vs Jinja mismatch resolved)
- [ ] Founding date is accurate (December 2020)
- [ ] Social media accounts are linked correctly
- [ ] All images have meaningful alt text
- [ ] All images have consent clearance (see `docs/safeguarding-and-consent.md`)
- [ ] EXIF metadata stripped from all published images

## Link Checks

- [ ] All internal links work (run `npm run check-links`)
- [ ] All social media links point to correct accounts
- [ ] All external links (partner sites, references) are valid
- [ ] No broken links in footer
- [ ] No broken links in navigation
- [ ] Sitemap.xml is accessible at `/sitemap.xml`
- [ ] Robots.txt is accessible at `/robots.txt`
- [ ] RSS feed is accessible at `/stories/rss.xml`

## SEO Checks

- [ ] Every page has unique title and description
- [ ] Every page has a canonical URL
- [ ] `/admin/*` pages have `noindex`
- [ ] Open Graph images render correctly (share a page on social media to test)
- [ ] JSON-LD structured data validates (test with Google's Rich Results Test)
- [ ] Sitemap submitted to Google Search Console
- [ ] Sitemap submitted to Bing Webmaster Tools

## Accessibility Checks

- [ ] Run axe-core E2E tests: `npx playwright test tests/e2e/accessibility.spec.ts`
- [ ] Keyboard navigation: Tab through every page
- [ ] Skip link works (Tab on page load → Enter → focus moves to main)
- [ ] Mobile menu: focus trap, Escape to close, focus restoration
- [ ] Forms: error messages announced, field-level errors visible
- [ ] Screen reader test (NVDA or VoiceOver) on critical journeys
- [ ] 200% zoom: no content cut off
- [ ] `prefers-reduced-motion`: animations reduced

## Performance Checks

- [ ] Run Lighthouse on production (target: Performance 90+)
  ```bash
  npx lighthouse https://your-site.vercel.app --preset=desktop --output=html --output-path=./lighthouse-report.html
  ```
- [ ] LCP < 2.5s on Slow 3G
- [ ] CLS < 0.1
- [ ] JS bundle < 150 KB gzip per route
- [ ] Images are WebP/AVIF
- [ ] Above-the-fold images have `priority`
- [ ] Below-the-fold images are lazy-loaded

## Security Checks

- [ ] `ADMIN_SECRET` is a strong password (16+ characters)
- [ ] `DATABASE_URL` is set in Vercel env vars
- [ ] `.env.local` is not committed (check `.gitignore`)
- [ ] No secrets in git history (run `git log --all -p | grep -i "secret\|password\|key"` to check)
- [ ] Admin login works with correct password
- [ ] Admin login fails with wrong password
- [ ] Lockout triggers after 5 failed attempts
- [ ] CSRF protection works (try submitting admin form without cookie)
- [ ] Rate limiting works (submit a form 4+ times rapidly)

## Functional Checks

- [ ] Contact form: submit → email received (or fallback message shown)
- [ ] Newsletter form: subscribe → email received (or fallback message)
- [ ] Donation form: submit → record in admin dashboard
- [ ] Donation form: double-click → only one record created (idempotency)
- [ ] Admin dashboard: verify donation → status changes
- [ ] Admin dashboard: reject donation → status changes
- [ ] Admin dashboard: sign out → redirected to login

## Responsive Design Checks

Test at these viewport widths:
- [ ] 320px (small mobile)
- [ ] 375px (iPhone SE)
- [ ] 768px (iPad portrait)
- [ ] 1024px (iPad landscape / small desktop)
- [ ] 1440px (standard desktop)

At each width:
- [ ] Navigation works (desktop nav or mobile menu)
- [ ] No horizontal scroll
- [ ] Text is readable
- [ ] Images are not distorted
- [ ] Forms are usable
- [ ] Buttons are tappable (min 44x44px on mobile)

## Deployment Checks

- [ ] Vercel project configured with correct root directory
- [ ] All environment variables set in Vercel
- [ ] `NEXT_PUBLIC_SITE_URL` matches the production URL
- [ ] Custom domain configured (if applicable)
- [ ] HTTPS is working
- [ ] Security headers are present (check with `curl -I https://your-site.vercel.app`)
- [ ] Database migration run against production Neon
- [ ] Test donation submitted and verified in admin dashboard

## Sign-Off

- [ ] Management has reviewed and approved all public content
- [ ] Legal review of privacy policy, terms, safeguarding policy
- [ ] Final deployment to production
- [ ] DNS propagated (if custom domain)
- [ ] Monitoring in place (Vercel analytics, error alerts)
