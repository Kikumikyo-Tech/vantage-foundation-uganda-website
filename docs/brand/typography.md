# Typography

## Primary font

**Inter** — loaded via `next/font/google` with `display: swap` and a variable axis for optimal performance.

```ts
// app/layout.tsx
const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
```

## Fallback stack

```
var(--font-inter), system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif
```

For email templates (where web fonts are unreliable): `Arial, Helvetica, sans-serif`.

## Proprietary font note

Frutiger is the organisation's preferred typeface but is **not bundled or redistributed**. Inter is the licensed-for-web substitute. Do not commit proprietary font files to the repository.

## Type scale

| Style | Size | Weight | Line height | Tracking | Max length | Usage |
|-------|------|--------|-------------|----------|------------|-------|
| Display | 56px | 700 | 1.1 | -0.02em | 20 words | Hero headlines |
| H1 | 40px | 700 | 1.15 | -0.02em | 12 words | Page titles |
| H2 | 30px | 600 | 1.2 | -0.01em | 12 words | Section headings |
| H3 | 24px | 600 | 1.3 | 0 | 12 words | Subsection headings |
| H4 | 20px | 600 | 1.4 | 0 | — | Card headings |
| Body large | 18px | 400 | 1.6 | 0 | 66 chars | Lead paragraphs |
| Body | 16px | 400 | 1.625 | 0 | 66 chars | Standard body |
| Body small | 14px | 400 | 1.5 | 0 | — | Secondary info |
| Caption | 12px | 400 | 1.4 | 0.02em | — | Captions, metadata |
| Overline | 12px | 600 | 1.4 | 0.08em | — | Eyebrows, labels (uppercase) |
| Button | 14px | 600 | — | 0 | — | Button labels |
| Data label | 12px | 600 | — | 0.04em | — | Stat labels (uppercase) |

## Hierarchy rules

- One H1 per page.
- Never skip heading levels (H1 → H2 → H3, not H1 → H3).
- Use semantic HTML (`<h1>`, `<h2>`, etc.), not styled `<div>`s.
- Body text max line length ~66 characters (`max-w-prose` or `max-w-2xl`).

## Uppercase

Use uppercase **only** for:
- Short labels and eyebrows (overline style)
- Navigation categories
- Data labels on statistics
- Restrained brand moments

Avoid uppercase for long headings or body text — it reduces readability and feels shouty.

## Responsive behaviour

- Display: 56px desktop, 48px tablet, 40px mobile
- H1: 40px desktop, 36px tablet, 32px mobile
- H2: 30px desktop, 26px tablet, 24px mobile
- Body: 16px at all breakpoints (never below 16px for body)

## Quotes

Use italic for pull quotes. Attribute with an em-dash and the source. Never use straight quotes for typography — use curly quotes (&ldquo; &rdquo;).

## Report footnotes

Use superscript numbers in body, with the footnote at the page bottom in caption style (12px, muted-foreground).
