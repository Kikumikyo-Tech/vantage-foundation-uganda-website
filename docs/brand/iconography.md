# Iconography and Illustration

## Icon system

Icons use **Lucide** (`lucide-react`) — outlined, rounded, consistent stroke weight, accessible at small sizes.

### Principles

- Outlined or minimally filled
- Rounded line caps
- Consistent 1.5px stroke weight
- Legible at 16px (sm), 20px (md), 24px (lg), 32px (xl)
- Always paired with a text label for programme categorisation

### Sizes

| Token | Value | Usage |
|-------|-------|-------|
| `--icon-sm` | 1rem (16px) | Inline, dense UI |
| `--icon-md` | 1.25rem (20px) | Default |
| `--icon-lg` | 1.5rem (24px) | Feature cards |
| `--icon-xl` | 2rem (32px) | Hero, section headers |

## Programme icons

| Programme | Lucide icon | Colour |
|-----------|-------------|--------|
| Health | `HeartPulse` | `--programme-health` |
| Education | `GraduationCap` | `--programme-education` |
| Water & WASH | `Droplets` | `--programme-water` |
| Humanitarian | `HandHeart` | `--programme-humanitarian` |
| Youth | `Lightbulb` | `--programme-youth` |
| Research | `Beaker` | `--programme-research` |
| Environment | `Sprout` | `--programme-environment` |
| Alert | `AlertTriangle` | `--programme-alert` |

### Additional UI icons

| Purpose | Lucide icon |
|---------|-------------|
| Donate | `Heart` |
| Volunteer | `Users` |
| Partner | `Handshake` |
| Location | `MapPin` |
| Impact | `TrendingUp` |
| Reports | `FileText` |
| Disability inclusion | `Accessibility` |
| Gender equality | `Users` / `PersonStanding` |
| Climate | `CloudSun` |

## Implementation

- `components/shared/AreaIcon.tsx` maps programme ids to Lucide icons
- Programme colour applied via `programmeTokenForArea()` from `lib/design-tokens.ts`
- Icon badges use a 10% tint of the programme colour as background (`${hex}1a`)

## Consistency rule

Do not mix icon libraries without visual normalisation. If a Lucide icon doesn't fit a need, prefer finding another Lucide icon over importing from a different library. If a custom icon is required, match Lucide's stroke weight, corner radius, and visual weight.

## Illustration

Use illustrations sparingly. Where used:

- Geometric and minimal
- African-context aware and respectful
- Modern flat style (not skeuomorphic, not cartoonish)
- Secondary to real photography — never replace a real photo with an illustration when a suitable photo exists
- Use brand colours only (teal, navy, aqua, programme accents)

Avoid decorative illustrations that don't convey information. Every illustration should earn its place by clarifying something a photo cannot.
