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
- `components/admin/` — admin-only client components (media manager)
- `components/ui/` — small primitives (Button, Card, Input, etc.)
- `content/` — all editable content (site config, projects, stories, team, partners, impact, FAQ, reports, donation)
- `lib/` — utilities and content helpers
- `lib/storage/` — Cloudflare R2 client and object-key conventions (server-only)
- `lib/db/` — Neon PostgreSQL queries (`index.ts` = donations, `media.ts` = media objects, `admins.ts` = named admin accounts, `audit.ts` = immutable audit log, `schema.sql` = table definitions)
- `public/images/` — real images go here; placeholder filenames are handled by `ImageOrPlaceholder`
- `types/` — shared TypeScript interfaces

## Editing content
All non-code content lives in the `content/` folder as TypeScript modules. To update a project, story, team member, partner or report, edit the relevant file. Placeholder data is marked with `[...]` or the `placeholder` boolean. Replace placeholder content with verified information before public launch.

## Environment variables
Copy `.env.example` to `.env.local` and set:
- `NEXT_PUBLIC_SITE_URL` — canonical site URL
- `DATABASE_URL` — Neon PostgreSQL connection string (server-side only, never commit)
- `ADMIN_SECRET` — HMAC signing key for session tokens AND the bootstrap fallback password (only usable when zero named admins exist). Rotate to revoke all outstanding sessions.
- `CRON_SECRET` — bearer token required by the `/api/instagram/refresh` cron endpoint. If unset, the endpoint fails closed (503).
- `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM` — optional email server for form notifications
- `R2_ENDPOINT`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_BUCKET_NAME` — Cloudflare R2 object storage (server-only). Same bucket/credentials as the sibling kikumikyo project; Vantage objects live under a `vantage/` prefix. Do not rename these variables or create a new bucket.

## Database setup
1. Create a Neon PostgreSQL database.
2. Run `node scripts/setup-db.mjs` (or paste `lib/db/schema.sql` in the Neon SQL editor) to create the `donations`, `media_objects`, `admins`, and `audit_log` tables. The script is idempotent — safe to re-run after schema updates.
3. Never commit `.env.local` or any real credentials.

## Admin dashboard
- `/admin/login` — sign in with a named admin username + password, or leave username blank and use `ADMIN_SECRET` (bootstrap mode, only when zero named admins exist). The first admin is created via bootstrap; subsequent logins should use named accounts.
- `/admin/donations` — view and verify/reject donor submissions. Donations are stored with status `pending` and are only marked `verified` after an administrator confirms the transfer against the official bank statement. Every status change is written to the immutable `audit_log` with the actor identity, before/after state, and IP.
- `/admin/media` — upload and manage photos, documents, and logos stored in Cloudflare R2. New uploads default to `pending` consent and `unpublished`; set both before publishing. The browser uploads directly to R2 via a presigned PUT URL (issued by `/api/admin/media/presign`), then the server confirms the object via HEAD and records it in the `media_objects` table. R2 object keys are stored (never signed URLs) so the DB stays stable; presigned GET URLs are minted at render time. Create/update/delete actions are written to `audit_log`.
- `/admin/admins` — create and disable named admin accounts. Passwords are hashed with scrypt (`lib/password.ts`). Disabled admins cannot log in but are retained for audit history. Admins cannot disable their own account.
- `/admin/audit` — read-only view of the immutable `audit_log` table. Every state-changing admin action (donation verification, media CRUD, admin create/disable) is recorded with the actor identity, before/after JSON snapshot, and IP address.

## Donor PII retention
Donor personal data (name, email, phone, message) is stored in the `donations` table. Retention and erasure:

- **Soft-delete**: donations can be soft-deleted (`deleted_at` set) via `purgeOldDeletedDonations` in `lib/db/index.ts`. Soft-deleted rows are excluded from list queries but retained for audit.
- **Retention period**: soft-deleted donations are purged after the retention window defined in `purgeOldDeletedDonations`. Verify the retention period matches your NDPR-Uganda / GDPR obligations before launch (typically 6–7 years for financial records, shorter for non-verified intents).
- **Erasure path**: to fully erase a donor's PII, soft-delete the donation row AND remove their data from any email notifications (SMTP logs are outside this system). A dedicated donor-erasure admin tool is a future task; for now, run a SQL `UPDATE donations SET name = '[erased]', email = '[erased]', phone = NULL, message = NULL WHERE id = <id>` after soft-deleting.
- **Privacy notice**: the donation form must display a privacy notice explaining how donor PII is used and stored, mirroring the `FormPrivacyNotice` on the contact form. Verify this is present before launch.
- **Audit log**: the `audit_log` table may contain before/after snapshots that include donor PII (e.g. donation status changes reference the donation). The audit log is append-only and immutable; erasure of donor PII from audit snapshots is a manual SQL operation that should be documented in your retention policy.

## Deployment
This project is configured for Vercel. Set the framework preset to Next.js and, if needed, the root directory to `vantage-website`.

