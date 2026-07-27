# Accessibility

The Vantage Foundation Uganda brand system targets **WCAG 2.2 AA** across all digital and print communications.

## Colour contrast

| Pairing | Ratio | Status |
|---------|-------|--------|
| Dark Navy on White | 16.0:1 | AAA |
| Muted on White | 7.0:1 | AAA |
| Deep Teal on White | 4.6:1 | AA |
| White on Deep Teal | 4.6:1 | AA |
| White on Dark Navy | 16.0:1 | AAA |
| Bright Aqua on White | 1.9:1 | **FAIL — accent only** |

**Rules:**
- Body text: ≥ 4.5:1
- Large text (≥ 24px or ≥ 18.66px bold) and UI components: ≥ 3:1
- Never use Bright Aqua for text or links on white
- Never convey information by colour alone (WCAG 2.2 §1.4.1) — pair programme colours with icons and labels

## Keyboard accessibility

- Visible focus indicators on all interactive elements (`:focus-visible` outline: 2px solid `--primary`, offset 2px)
- Logical tab order following visual order
- Mobile menu traps focus and restores focus on close (implemented in `Header.tsx`)
- Skip-to-content link as the first focusable element

## Semantic structure

- One `<h1>` per page
- Heading levels never skipped (h1 → h2 → h3)
- Landmark elements: `<header>`, `<main id="main">`, `<footer>`, `<nav>` with `aria-label`
- Lists use `<ul>`/`<ol>` with `<li>`
- Forms use `<label>` associated with inputs via `htmlFor`/`id`

## Images

- All meaningful images have descriptive `alt` text
- Decorative images use `alt=""` or `aria-hidden="true"`
- Captions use `<figcaption>`
- No information conveyed by image alone that isn't also in text

## Forms

- Every input has an associated `<label>`
- Errors use `role="alert"` and `aria-live="polite"` for async feedback
- `aria-invalid` set on fields with errors
- Required fields marked with `required` attribute (not just visual)

## Motion

- `prefers-reduced-motion: reduce` disables animations and smooth scroll
- No auto-playing video or audio
- No parallax or motion that triggers vestibular discomfort
- Animations are subtle and brief (≤ 300ms)

## Touch

- Interactive elements ≥ 44×44px touch target
- Adequate spacing between adjacent interactive elements

## Captions and transcripts

- Videos include captions
- Audio content includes transcripts
- Live events provide captioning where feasible

## Testing

Run automated and manual checks before launch:

1. **Automated:** axe-core (Playwright integration in `tests/`), Lighthouse
2. **Keyboard:** navigate every page with Tab/Shift+Tab/Enter/Space/Escape only
3. **Screen reader:** verify landmarks, headings, form labels, link purposes with NVDA or VoiceOver
4. **Zoom:** 200% text zoom — no loss of content or functionality
5. **Reduced motion:** verify with OS reduced-motion setting enabled
6. **High contrast:** verify with Windows High Contrast mode

See `docs/accessibility.md` for the existing site-wide accessibility documentation and the testing checklist.
