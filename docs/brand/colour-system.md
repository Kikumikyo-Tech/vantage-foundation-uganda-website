# Colour System

Exactly three dominant colours across the site, roughly a third each: teal,
white, and black/dark charcoal. Confirmed by the founder 2026-07-27.

## Primary palette

| Colour | Hex | RGB | Token | Role |
|--------|-----|-----|-------|------|
| Teal Primary | `#008F95` | 0,143,149 | `--deep-teal` | Large text/surfaces only — see Accessibility below |
| Teal Dark | `#006B70` | 0,107,112 | `--primary` | Buttons, links, brand — the default interactive/text teal |
| Teal Light | `#DDF5F4` | 221,245,244 | `--primary-light` | Pale wash for tinted backgrounds/badges — never text |
| Black | `#050708` | 5,7,8 | `--foreground` / `--navy` | Body text, deepest dark sections |
| Dark Charcoal | `#0B1B22` | 11,27,34 | `--charcoal` | Secondary dark sections/cards on black |
| White | `#FFFFFF` | 255,255,255 | `--background` | — |
| Soft White | `#F7FAFA` | 247,250,250 | `--muted` / `--surface` | Section backgrounds |
| Neutral Border | `#DCE5E5` | 220,229,229 | `--border` | — |

**`--primary` is Teal Dark, not Teal Primary.** Teal Primary (`#008F95`) only
reaches 3.9:1 contrast on white — short of WCAG AA's 4.5:1 for normal text —
so it's reserved for large text/surfaces (24px+, which only needs 3:1, e.g.
the big programme hero headings). Teal Dark (`#006B70`) reaches 6.3:1 and
backs every button, link and piece of body-sized text.

## Programme accent colours

Categorisation only, always paired with an icon or text label (WCAG 2.2
§1.4.1). Kept within the teal/black brand system — no unrelated hues
(orange, purple, sky blue, cyan). `--programme-alert` stays red: it's a
functional safety/status colour, not a decorative brand accent.

| Programme | Hex | Token |
|-----------|-----|-------|
| Health (Vantage Care) | `#008F95` | `--programme-health` |
| Education (KikumiKyo Academy) | `#006B70` | `--programme-education` |
| Water & WASH | `#0B1B22` | `--programme-water` |
| Humanitarian Assistance | `#050708` | `--programme-humanitarian` |
| Research | `#008F95` | `--programme-research` |
| Environment & Agriculture | `#006B70` | `--programme-environment` |
| Youth Empowerment | `#0B1B22` | `--programme-youth` |
| Emergency / Critical Alert | `#DC2626` | `--programme-alert` |

## Status colours

Functional/semantic — not decorative brand accents, so these are exempt
from the teal/black-only rule (a destructive action must read as red
regardless of brand palette).

| Status | Foreground | Background | Token prefix |
|--------|-----------|------------|--------------|
| Success | `#15803D` | `#DCFCE7` | `--success*` |
| Warning | `#B45309` | `#FEF3C7` | `--warning*` |
| Destructive | `#B91C1C` | `#FEE2E2` | `--destructive*` |
| Info | `#006B70` | `#E0F2FE` | `--info*` |

## Accessibility — contrast ratios

| Foreground | Background | Ratio | Level |
|------------|------------|-------|-------|
| Black #050708 | White | ~19.7:1 | AAA |
| Muted #475569 | White | ~7.5:1 | AAA |
| Teal Dark #006B70 | White | 6.3:1 | AA (normal text) |
| White | Teal Dark #006B70 | 6.3:1 | AA (normal text) |
| White | Black #050708 | ~19.7:1 | AAA |
| Teal Primary #008F95 | White | 3.9:1 | **Large text/UI only (3:1)** — fails normal text |
| Teal Light #DDF5F4 | White | ~1.1:1 | **FAIL — decorative fills only, never text** |

> **Teal Primary must not be used for normal-sized body text, links, or
> button labels on white/soft-white** — use Teal Dark for those. Teal
> Primary is fine for large headings (24px+) and non-text fills. Teal Light
> is a pale wash for tinted backgrounds only, never text.

## Colour usage ratio

```
~33% white / neutral space
~33% teal (Teal Dark for text/UI, Teal Primary for large surfaces)
~33% black / dark charcoal (text, dark sections)
```

## Gradients

Use sparingly. Only subtle supporting gradients derived from approved colours:

- `linear-gradient(135deg, #008F95, #006B70)` — teal hero backgrounds
- `linear-gradient(135deg, #050708, #006B70)` — black-to-teal dark sections

Never use rainbow gradients, neon gradients, or gradients between unrelated programme colours.

## Implementation

- CSS variables: `app/globals.css` (`:root` + `@theme inline`)
- TypeScript: `lib/design-tokens.ts` (`brandColors`, `semanticColors`, `programmeColours`, `statusColors`)
- Never hard-code hex values in components — always reference a token.
