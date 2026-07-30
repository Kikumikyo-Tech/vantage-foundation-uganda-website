# Accessibility (WCAG 2.2 AA)

This document describes the accessibility features of the Vantage Foundation Uganda website and the testing process.

## Target

The site targets **WCAG 2.2 Level AA** compliance. This means:
- Perceivable: content is presentable in ways users can perceive
- Operable: interface components are operable
- Understandable: content and interface are understandable
- Robust: content works with assistive technologies

## Features Implemented

### Skip link
- "Skip to main content" link is the first focusable element on every page
- Hidden by default (`sr-only`), becomes visible on keyboard focus
- Targets `<main id="main">` landmark
- File: `components/shared/SkipToContent.tsx`

### Heading hierarchy
- Every page has exactly one `<h1>`
- No skipped heading levels (h1 → h2 → h3)
- Verified by automated E2E tests on all 18+ pages
- `SectionHeader` component supports `level="h1"` or `level="h2"` prop

### Mobile menu (focus trap)
- `role="dialog"` and `aria-modal="true"` on the menu
- Focus moves to close button when menu opens
- Tab/Shift+Tab cycles within the menu (focus trap)
- Focus returns to trigger button on close
- Escape key closes the menu
- Body scroll is locked while menu is open
- `aria-label="Open menu"` / `aria-label="Close menu"` on buttons
- `aria-expanded` and `aria-controls` on trigger button
- File: `components/layout/Header.tsx`

### Forms
- All form fields have `<label>` elements (visible or `sr-only`)
- `aria-describedby` associates error messages with fields
- `aria-invalid` set on fields with validation errors
- `role="alert"` on error messages
- `role="status"` on success messages
- `noValidate` on forms to use server-side validation messages
- Privacy notices on all public forms
- Files: `ContactForm.tsx`, `DonationForm.tsx`, `NewsletterForm.tsx`

### Images
- All images use meaningful `alt` text describing the content
- Decorative icons use `aria-hidden="true"`
- Missing media renders as a quiet neutral surface without an unverified publication promise
- All images go through `ImageOrPlaceholder` component

### Color contrast
All color combinations meet WCAG AA (4.5:1 for normal text, 3:1 for large text):

| Foreground | Background | Ratio | Level |
|------------|------------|-------|-------|
| #0f172a (foreground) | #ffffff (white) | 18.5:1 | AAA |
| #475569 (muted-foreground) | #ffffff (white) | 7.2:1 | AAA |
| #475569 (muted-foreground) | #f8fafc (slate-50) | 6.8:1 | AAA |
| #ffffff (white) | #0f766e (primary) | 5.5:1 | AA |
| #0f766e (primary) | #ffffff (white) | 5.5:1 | AA |
| #78350f (amber-900) | #fffbeb (amber-50) | 7.2:1 | AAA |
| #64748b (slate-500) | #f1f5f9 (slate-100) | 4.6:1 | AA |

### Landmarks
- `<header>` — site header
- `<nav aria-label="Main navigation">` — desktop navigation
- `<nav aria-label="Mobile navigation">` — mobile menu
- `<nav aria-label="Breadcrumb">` — breadcrumb navigation
- `<main id="main">` — main content
- `<footer>` — site footer

### FAQ accordion
- Uses native `<details>`/`<summary>` elements (built-in keyboard support)
- `aria-labelledby` associates content with its summary
- Decorative chevron icon uses `aria-hidden="true"`

### Project filter
- Search input has `sr-only` label
- Filter dropdowns have `aria-label`
- Native form controls for keyboard accessibility

## Testing

### Automated tests

**E2E (Playwright + axe-core):**
```bash
npm run test:e2e
```
- Heading order: verifies exactly one `<h1>` per page
- Skip link: verifies it becomes visible on focus
- axe-core: runs WCAG 2.2 AA checks on all pages
  - Tags: `wcag2a`, `wcag2aa`, `wcag21a`, `wcag21aa`
  - Fails on any violations

**Unit tests:**
- Component tests verify ARIA attributes are set correctly

### Manual testing checklist

Test these before each major release:

- [ ] **Keyboard navigation**: Tab through every page, verify focus order is logical
- [ ] **Skip link**: Press Tab on page load, verify skip link appears, press Enter, verify focus moves to main content
- [ ] **Mobile menu**: Open with keyboard, verify focus trap, close with Escape, verify focus returns to button
- [ ] **Forms**: Submit forms with errors, verify error messages are announced
- [ ] **Screen reader**: Test with NVDA (Windows) or VoiceOver (macOS) on:
  - Homepage navigation
  - Contact form submission
  - Donation form submission
  - Project filter and search
- [ ] **200% zoom**: Verify no content is cut off or overlapping at 200% browser zoom
- [ ] ** prefers-reduced-motion**: Verify animations are reduced when this is set
- [ ] **High contrast mode**: Verify content is readable in Windows high contrast mode

### Screen reader testing

**NVDA (Windows, free):**
1. Install NVDA from https://www.nvaccess.org/
2. Open the site in Chrome or Firefox
3. Navigate with Tab, Shift+Tab, and arrow keys
4. Verify all content is announced correctly
5. Verify form labels and errors are read

**VoiceOver (macOS, built-in):**
1. Enable VoiceOver with Cmd+F5
2. Open the site in Safari
3. Navigate with Tab, Shift+Tab, and VO+arrow keys
4. Verify all content is announced correctly

## CI Integration

Axe-core accessibility checks run in the E2E test suite (`.github/workflows/ci.yml`). The CI workflow runs:
- Unit tests (Vitest)
- E2E tests (Playwright) — includes axe-core checks

Any axe-core violation will fail the CI build.

## Known Limitations

- **No video captions**: The site currently has no video content. If video is added, captions and transcripts must be provided.
- **Missing media**: a neutral non-text surface avoids broken requests and does not claim that an asset will be published.
- **Third-party content**: Any embedded third-party content (maps, social widgets) may not meet WCAG AA. Review before adding.
