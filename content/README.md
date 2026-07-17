# Vantage Foundation Uganda — Content Guide

All editable website content lives in this `content/` folder as TypeScript modules.

## Files

- `site.ts` — global config: name, mission, vision, contact, social links, bank details, navigation.
- `areas.ts` — four thematic areas of work (Health, Education, Humanitarian Aid, Water & Sanitation).
- `projects.ts` — project list and helper functions. Each project has a slug used for its URL (`/projects/{slug}`).
- `stories.ts` — story/blog list and helper functions. Each story has a slug (`/stories/{slug}`).
- `team.ts` — team members.
- `partners.ts` — partners and collaborators.
- `impact.ts` — impact statistics, outputs, outcomes, long-term goals, regions and SDG numbers.
- `reports.ts` — downloadable reports and documents (set `url` when available).
- `faq.ts` — frequently asked questions.
- `donate.ts` — suggested donation amounts and campaign options.

## Placeholders

Content that still needs to be verified is marked with `[placeholder text]` or the `placeholder: true` flag. Before launching, replace these with accurate, consent-approved information.

## Images

- Real images should be placed in `public/images/`.
- Update the `heroImage`, `photo` or `logo` paths in the content files to point to those images.
- If an image path contains `placeholder` or is missing, the `ImageOrPlaceholder` component will show a styled placeholder.

## Markdown

Long-form body content for projects and stories supports Markdown. Keep formatting simple: paragraphs, headings, lists and links.

## Donations and Neon PostgreSQL

- Donor submissions are saved in a Neon PostgreSQL `donations` table defined in `lib/db/schema.sql`.
- New donations are inserted with `status = 'pending'`.
- A Vantage administrator reviews them at `/admin/donations` and marks them `verified` or `rejected` after comparing the transfer to the official bank statement.
- The database connection string is stored only in the server-side `DATABASE_URL` environment variable.
