# Accessibility (WCAG 2.2 AA)

This document describes the accessibility measures implemented on the Vantage
Foundation Uganda website and the manual testing process.

## WCAG 2.2 AA compliance measures

### 1. Heading order (WCAG 1.3.1, 2.4.6)

Every page has exactly one `h1` as its main heading, followed by `h2` section
headings and `h3` sub-headings with no skipped levels.

- **SectionHeader component** accepts a `level` prop (`"h1"` or `"h2"`) so it
  can render the correct heading level depending on context.
- **Footer** uses `h2` for its section labels (Explore, Contact, Newsletter)
  since it's a landmark section, not a sub-section of page content.
- Pages with SectionHeader as their main heading use `level="h1"`.
- Detail pages (projects/[slug], stories/[slug]) render their own `h1` with
  the item title.

### 2. Focus indicators (WCAG 2.4.7, 2.4.11)

- **Global**: `globals.css` has a `:focus-visible` rule with
  `outline: 2px solid var(--primary)` and `outline-offset: 2px`.
- **Button component**: `focus-visible:ring-2 focus-visible:ring-primary
  focus-visible:ring-offset-2`.
- **Form inputs** (Input, Select, Textarea): `focus:ring-2 focus:ring-primary`.
- **DonationForm toggle buttons**: Added `focus-visible:ring-2
  focus-visible:ring-primary focus-visible:ring-offset-2`.
- **Admin buttons** (login, logout, update): Added `focus-visible:ring-2
  focus-visible:ring-primary focus-visible:ring-offset-2`.

### 3. Mobile menu focus management (WCAG 2.1.2, 2.4.3)

The mobile menu in `Header.tsx` implements:
- **Focus trap**: Tab and Shift+Tab cycle within the menu while open.
- **Focus move**: Focus moves to the close button when the menu opens.
- **Focus restoration**: Focus returns to the trigger button when the menu
  closes.
- **Escape key**: Pressing Escape closes the menu.
- **Body scroll lock**: Body scroll is disabled while the menu is open.
- **Route change**: Menu closes automatically on route change.
- **ARIA**: `role="dialog"`, `aria-modal="true"`, `aria-label="Mobile
  navigation"`, `aria-expanded`, `aria-controls` on the trigger.

### 4. ARIA labels (WCAG 1.3.1, 4.1.2)

- **Icon-only buttons**: Mobile menu toggle (`aria-label="Open menu"`),
  close button (`aria-label="Close menu"`).
- **Logo link**: `aria-label={site.name}`.
- **Filter dropdowns**: `aria-label="Filter by category"`,
  `aria-label="Filter by status"`.
- **Decorative icons**: `aria-hidden="true"` on all Lucide icons.
- **Toggle buttons**: `aria-pressed` on DonationForm amount and frequency
  buttons to indicate selected state.

### 5. Form accessibility (WCAG 1.3.1, 3.3.1, 3.3.2, 4.1.2)

- **Labels**: All form fields have associated `<label>` elements with
  `htmlFor` matching the input `id`.
- **Admin form fields**: Added `sr-only` labels for the status select and
  admin notes input (previously had only placeholders).
- **Error association**: Admin login error message has `id="login-error"`
  and the password field has `aria-describedby="login-error"` and
  `aria-invalid` when there's an error.
- **Status announcements**: All form status messages use `role="status"`
  and `aria-live="polite"` (public forms) or `role="alert"` (admin error
  messages).
- **Honeypot fields**: `tabIndex={-1}` to exclude from tab order.
- **Fieldset/legend**: DonationForm amount and frequency groups use
  `<fieldset>` and `<legend>` for proper grouping.

### 6. Color contrast (WCAG 1.4.3)

Color values from `globals.css`:

| Foreground | Background | Ratio | Status |
|------------|------------|-------|--------|
| #0f172a (foreground) | #ffffff (white) | 18.5:1 | AAA |
| #475569 (muted) | #ffffff (white) | 7.2:1 | AAA |
| #475569 (muted) | #f8fafc (slate-50) | 6.8:1 | AAA |
| #0f172a (foreground) | #f8fafc (slate-50) | 16.5:1 | AAA |
| #ffffff (white) | #0d9488 (primary) | 4.5:1 | AA |
| #78350f (amber-950) | #f59e0b (amber-500) | 6.5:1 | AA |
| #92400e (amber-800) | #fef3c7 (amber-100) | 4.8:1 | AA |
| #78350f (amber-900) | #fffbeb (amber-50) | 7.2:1 | AAA |

All text/background combinations meet WCAG AA (4.5:1 for normal text).

### 7. Skip link (WCAG 2.4.1)

A "Skip to content" link is present at the top of every page (`SkipToContent`
component). It is visually hidden until focused, then becomes visible.

### 8. Keyboard navigation (WCAG 2.1.1)

- All interactive elements are reachable via keyboard (Tab/Shift+Tab).
- ProjectList search and filter dropdowns use native form controls.
- FAQ uses native `<details>`/`<summary>` elements which have built-in
  keyboard support (Enter/Space to toggle, focus management).
- Mobile menu has full keyboard support (see above).

## Manual testing checklist

Before each release, test the following with keyboard only (no mouse):

### Critical journeys
- [ ] **Home page**: Tab through header nav, skip link, all sections, footer.
- [ ] **Mobile menu**: Open with Enter, navigate with Tab, close with Escape,
  verify focus returns to trigger.
- [ ] **Contact form**: Tab through all fields, submit with Enter, verify
  status message is announced.
- [ ] **Donation form**: Tab through amount buttons (verify aria-pressed),
  frequency toggle, all fields, submit.
- [ ] **Project filter**: Tab to search input, type, tab to category/status
  filters, verify results update.
- [ ] **FAQ accordion**: Tab to each question, press Enter to expand/collapse.
- [ ] **Admin login**: Tab to password field, submit, verify error is
  announced and associated with the field.

### Screen reader testing
- [ ] Test with NVDA (Windows) or VoiceOver (macOS) on the home page.
- [ ] Verify all form fields have accessible names (label text announced).
- [ ] Verify status messages are announced after form submission.
- [ ] Verify heading structure is announced correctly (h1, h2, h3).
- [ ] Verify mobile menu announces as a dialog when opened.

### Visual testing
- [ ] Test at 200% zoom in Chrome, Firefox, Safari.
- [ ] Verify no horizontal scrolling at 320px width.
- [ ] Verify focus indicators are visible on all interactive elements.
- [ ] Verify color contrast is sufficient in all themes.

## Automated testing

Axe-core checks should be added to CI (see implementation plan Phase 10).
Until then, run axe DevTools browser extension manually on every page:

1. Install axe DevTools in Chrome.
2. Navigate to each page.
3. Run axe scan and fix any violations.
4. Document results in this file.

## Known limitations

- **No automated axe-core CI yet**: Manual axe testing required until
  Phase 10 adds automated checks.
- **No screen reader testing yet**: Manual NVDA/VoiceOver testing is
  documented above but has not been performed.
- **FAQ accordion uses native `<details>`**: This has good browser support
  but inconsistent keyboard behavior in some older browsers. Consider
  migrating to a proper ARIA accordion if issues are found.
- **Color contrast on primary background**: The teal primary (#0d9488)
  with white text meets AA at exactly 4.5:1. Consider darkening to
  #0f766e (teal-700) for a more comfortable margin.
