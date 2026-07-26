# Colour System

## Primary palette

| Colour | Hex | RGB | HSL | CMYK (approx) | Token |
|--------|-----|-----|-----|----------------|-------|
| Deep Teal | `#007D8A` | 0,125,138 | 186°,100%,27% | 100,9,0,46 | `--primary` |
| Bright Aqua | `#1CC7D6` | 28,199,214 | 186°,77%,47% | 87,7,0,16 | `--primary-light` |
| Ocean Blue | `#005B7A` | 0,91,122 | 196°,100%,24% | 100,25,0,52 | `--primary-dark` |
| Dark Navy | `#08233A` | 8,35,58 | 212°,76%,13% | 86,40,0,77 | `--foreground` |
| White | `#FFFFFF` | 255,255,255 | 0°,0%,100% | 0,0,0,0 | `--background` |
| Charcoal | `#232323` | 35,35,35 | 0°,0%,14% | 0,0,0,86 | `--charcoal` |

## Programme accent colours

| Programme | Hex | Token | Pair with |
|-----------|-----|-------|-----------|
| Health | `#0F9D58` | `--programme-health` | Emerald icon + "Health" label |
| Education | `#2563EB` | `--programme-education` | Royal blue icon + "Education" label |
| Water & WASH | `#38BDF8` | `--programme-water` | Sky blue icon + "Water & WASH" label |
| Humanitarian Assistance | `#F97316` | `--programme-humanitarian` | Orange icon + label |
| Research | `#7C3AED` | `--programme-research` | Purple icon + label |
| Environment & Agriculture | `#15803D` | `--programme-environment` | Forest green icon + label |
| Youth Empowerment | `#06B6D4` | `--programme-youth` | Cyan icon + label |
| Emergency / Critical Alert | `#DC2626` | `--programme-alert` | Red icon + label |

**Rule:** Programme colours are for categorisation only — never as body text on white, and never as the sole means of identifying a programme (WCAG 2.2 §1.4.1). Always pair with an icon and text label.

## Status colours

| Status | Foreground | Background | Token prefix |
|--------|-----------|------------|--------------|
| Success | `#15803D` | `#DCFCE7` | `--success*` |
| Warning | `#B45309` | `#FEF3C7` | `--warning*` |
| Destructive | `#B91C1C` | `#FEE2E2` | `--destructive*` |
| Info | `#005B7A` | `#E0F2FE` | `--info*` |

## Accessibility — contrast ratios

All pairings meet WCAG 2.2 AA (4.5:1 normal text, 3:1 large text and UI).

| Foreground | Background | Ratio | Level |
|------------|------------|-------|-------|
| Dark Navy #08233A | White | 16.0:1 | AAA |
| Muted #4A6072 | White | 7.0:1 | AAA |
| Deep Teal #007D8A | White | 4.6:1 | AA |
| White | Deep Teal #007D8A | 4.6:1 | AA |
| White | Dark Navy #08233A | 16.0:1 | AAA |
| Bright Aqua #1CC7D6 | White | 1.9:1 | **FAIL — accent only** |

> **Bright Aqua must never be used for text or links on white.** It is for fills, decorative elements, and large non-text accents only.

## Colour usage ratio

```
60% white / neutral space
25% teal family (primary, primary-dark, surface)
10% navy / charcoal (text, dark sections)
5%  programme accent colours (categorisation)
```

## Gradients

Use sparingly. Only subtle supporting gradients derived from approved colours:

- `linear-gradient(135deg, #007D8A, #005B7A)` — teal hero backgrounds
- `linear-gradient(135deg, #08233A, #005B7A)` — navy-to-teal dark sections

Never use rainbow gradients, neon gradients, or gradients between unrelated programme colours.

## Implementation

- CSS variables: `app/globals.css` (`:root` + `@theme inline`)
- TypeScript: `lib/design-tokens.ts` (`brandColors`, `semanticColors`, `programmeColours`, `statusColors`)
- Never hard-code hex values in components — always reference a token.
