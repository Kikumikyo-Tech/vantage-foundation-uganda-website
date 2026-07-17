<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Vantage Foundation Uganda Website

## Commands
- `npm run dev` — start the Next.js dev server (Turbopack)
- `npm run build` — production build
- `npm run start` — start production server
- `npm run lint` — ESLint
- `npm run type-check` — TypeScript check

## Project structure
- `app/` — Next.js App Router pages and special files (`sitemap.ts`, `robots.ts`, `actions.ts`)
- `components/sections/` — homepage section components
- `components/shared/` — reusable components (forms, cards, image placeholders)
- `components/ui/` — small primitives (Button, Card, Input, etc.)
- `content/` — all editable content (site config, projects, stories, team, partners, impact, FAQ, reports, donation)
- `lib/` — utilities and content helpers
- `public/images/` — real images go here; placeholder filenames are handled by `ImageOrPlaceholder`
- `types/` — shared TypeScript interfaces

## Editing content
All non-code content lives in the `content/` folder as TypeScript modules. To update a project, story, team member, partner or report, edit the relevant file. Placeholder data is marked with `[...]` or the `placeholder` boolean. Replace placeholder content with verified information before public launch.

## Environment variables
Copy `.env.example` to `.env.local` and set:
- `NEXT_PUBLIC_SITE_URL` — canonical site URL
- `DATABASE_URL` — Neon PostgreSQL connection string (server-side only, never commit)
- `ADMIN_SECRET` — password for the donation verification dashboard
- `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM` — optional email server for form notifications

## Database setup
1. Create a Neon PostgreSQL database.
2. Run `node scripts/setup-db.mjs` (or paste `lib/db/schema.sql` in the Neon SQL editor) to create the `donations` table.
3. Never commit `.env.local` or any real credentials.

## Admin dashboard
- `/admin/login` — sign in with `ADMIN_SECRET`.
- `/admin/donations` — view and verify/reject donor submissions. Donations are stored with status `pending` and are only marked `verified` after an administrator confirms the transfer against the official bank statement.

## Deployment
This project is configured for Vercel. Set the framework preset to Next.js and, if needed, the root directory to `vantage-website`.

