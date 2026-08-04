-- Run this SQL against your Neon database once to create the donations table.
-- Do not store payment credentials (PINs, OTPs, card numbers, etc.) here or anywhere.

CREATE TABLE IF NOT EXISTS donations (
  id SERIAL PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  amount NUMERIC(12, 2) NOT NULL,
  currency TEXT DEFAULT 'UGX' NOT NULL,
  frequency TEXT NOT NULL,
  campaign TEXT NOT NULL,
  transaction_reference TEXT,
  message TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  admin_notes TEXT,
  verified_at TIMESTAMP WITH TIME ZONE,
  deleted_at TIMESTAMP WITH TIME ZONE,
  CONSTRAINT status_values CHECK (status IN ('pending', 'verified', 'rejected')),
  CONSTRAINT currency_values CHECK (currency IN ('UGX', 'USD', 'EUR', 'GBP', 'KES'))
);

-- Partial unique index on transaction_reference: non-null references must be
-- unique so duplicate bank-statement references cannot be submitted. NULL
-- references (donor didn't supply one) are allowed multiple times.
CREATE UNIQUE INDEX IF NOT EXISTS idx_donations_transaction_reference_unique
  ON donations (transaction_reference)
  WHERE transaction_reference IS NOT NULL;

-- Migration: add deleted_at column to pre-existing tables (safe to re-run).
-- Runs AFTER CREATE TABLE so fresh installs already have the column,
-- and BEFORE the CREATE INDEX for deleted_at so the index can reference it.
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'donations' AND column_name = 'deleted_at'
  ) THEN
    ALTER TABLE donations ADD COLUMN deleted_at TIMESTAMP WITH TIME ZONE;
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_donations_status ON donations(status);
CREATE INDEX IF NOT EXISTS idx_donations_email ON donations(email);
CREATE INDEX IF NOT EXISTS idx_donations_created_at ON donations(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_donations_deleted_at ON donations(deleted_at);

-- ---------------------------------------------------------------------------
-- media_objects: admin-uploaded media stored in Cloudflare R2.
--
-- Each row records the R2 object key (NOT a signed URL — signed URLs expire,
-- so we store the stable key and mint a fresh presigned GET URL at render
-- time), the original filename, content-type, byte size, alt text, consent
-- classification, and optional programme/project linkage for editorial
-- categorisation. Soft-deleted rows are retained for audit (deleted_at).
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS media_objects (
  id SERIAL PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  -- Stable R2 object key, e.g. "vantage/gallery/abc123-photo.webp".
  -- The browser src is derived from this (r2://<key> for private-bucket mode,
  -- or https://<cdn>/<key> for public-CDN mode). Never store signed URLs here.
  object_key TEXT NOT NULL UNIQUE,
  -- Original client filename (sanitised) for display in the admin UI.
  original_filename TEXT NOT NULL,
  -- MIME type confirmed via R2 HEAD after upload completes.
  content_type TEXT NOT NULL,
  -- Byte size confirmed via R2 HEAD after upload completes.
  byte_size INTEGER NOT NULL,
  -- Image width/height in pixels (NULL for non-image assets like PDFs).
  width INTEGER,
  height INTEGER,
  -- Descriptive alt text (required for images; safeguarding rule: no invented
  -- names for children). Empty string allowed for decorative images.
  alt_text TEXT NOT NULL DEFAULT '',
  -- Optional caption shown below the image on the public site.
  caption TEXT,
  -- Consent classification, mirroring the existing MediaAsset type.
  consent TEXT NOT NULL DEFAULT 'pending',
  -- Free-form notes about consent provenance (e.g. "Cleared by management 2026-07-27").
  consent_notes TEXT,
  -- Optional programme area id this media relates to (health, education, etc.).
  programme TEXT,
  -- Optional project slug this media relates to.
  project_slug TEXT,
  -- Whether the media is published (visible on the public site). Unpublished
  -- media is retained in R2 and the DB but not rendered.
  published BOOLEAN NOT NULL DEFAULT false,
  -- Soft-delete timestamp. Soft-deleted rows are excluded from list queries
  -- but retained for audit; the R2 object is deleted immediately on soft-delete.
  deleted_at TIMESTAMP WITH TIME ZONE,
  CONSTRAINT media_consent_values CHECK (consent IN ('none', 'verified', 'pending', 'group-consent'))
);

CREATE INDEX IF NOT EXISTS idx_media_objects_programme ON media_objects(programme);
CREATE INDEX IF NOT EXISTS idx_media_objects_project_slug ON media_objects(project_slug);
CREATE INDEX IF NOT EXISTS idx_media_objects_published ON media_objects(published);
CREATE INDEX IF NOT EXISTS idx_media_objects_created_at ON media_objects(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_media_objects_deleted_at ON media_objects(deleted_at);

-- ---------------------------------------------------------------------------
-- admins: named admin accounts that replace the single shared ADMIN_SECRET
-- model for daily logins. Passwords are hashed with scrypt (see
-- lib/password.ts) and never stored in plaintext. A disabled admin
-- (disabled_at IS NOT NULL) cannot log in but the row is retained for audit
-- history. The first admin is created via the ADMIN_SECRET bootstrap fallback
-- in the login route (only when zero active admins exist).
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS admins (
  id SERIAL PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  username TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  disabled_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX IF NOT EXISTS idx_admins_username ON admins(username);
CREATE INDEX IF NOT EXISTS idx_admins_disabled_at ON admins(disabled_at);

-- ---------------------------------------------------------------------------
-- audit_log: immutable, append-only record of admin actions. Every
-- state-changing admin operation (donation verification, media CRUD, admin
-- create/disable) writes exactly one row with a before/after
-- JSON snapshot. There is no UPDATE or DELETE path — the table is an
-- immutable record of who did what and when.
--
-- actor_id is either a numeric admin id (matching admins.id) or the literal
-- "bootstrap" for actions taken via the ADMIN_SECRET fallback. actor_kind
-- distinguishes the source: "admin", "bootstrap", or "system".
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS audit_log (
  id SERIAL PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  actor_id TEXT NOT NULL,
  actor_kind TEXT NOT NULL DEFAULT 'admin',
  action TEXT NOT NULL,
  resource_type TEXT NOT NULL,
  resource_id TEXT,
  before JSONB,
  after JSONB,
  ip TEXT,
  CONSTRAINT audit_actor_kind_values CHECK (actor_kind IN ('admin', 'bootstrap', 'system'))
);

CREATE INDEX IF NOT EXISTS idx_audit_log_created_at ON audit_log(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_log_action ON audit_log(action);
CREATE INDEX IF NOT EXISTS idx_audit_log_resource_type ON audit_log(resource_type);
CREATE INDEX IF NOT EXISTS idx_audit_log_actor_id ON audit_log(actor_id);
