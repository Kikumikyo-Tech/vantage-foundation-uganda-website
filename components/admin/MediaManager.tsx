"use client";

import { useState, useRef, useCallback } from "react";
import type { MediaObjectRow } from "@/lib/db/media";

interface MediaManagerProps {
  csrfToken: string;
  initialItems: MediaObjectRow[];
}

type Status = "idle" | "uploading" | "confirming" | "saving" | "deleting" | "error";

const FOLDERS = [
  { value: "gallery", label: "Gallery" },
  { value: "programmes", label: "Programme" },
  { value: "team", label: "Team" },
  { value: "documents", label: "Document" },
  { value: "logos", label: "Logo" },
  { value: "resources", label: "Resource" },
] as const;

const CONSENT_OPTIONS = [
  { value: "pending", label: "Pending" },
  { value: "verified", label: "Verified" },
  { value: "group-consent", label: "Group consent" },
  { value: "none", label: "No people" },
] as const;

const MAX_BYTES = 10 * 1024 * 1024;

export function MediaManager({ csrfToken, initialItems }: MediaManagerProps) {
  const [items, setItems] = useState<MediaObjectRow[]>(initialItems);
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Upload form state
  const [folder, setFolder] = useState<string>("gallery");
  const [slug, setSlug] = useState("");
  const [altText, setAltText] = useState("");
  const [caption, setCaption] = useState("");
  const [consent, setConsent] = useState<string>("pending");
  const [consentNotes, setConsentNotes] = useState("");
  const [programme, setProgramme] = useState("");
  const [projectSlug, setProjectSlug] = useState("");
  const [published, setPublished] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const resetForm = useCallback(() => {
    setAltText("");
    setCaption("");
    setConsent("pending");
    setConsentNotes("");
    setProgramme("");
    setProjectSlug("");
    setPublished(false);
    setSelectedFile(null);
    setSlug("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  }, []);

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] ?? null;
    setSelectedFile(f);
    if (f && !altText) {
      // Pre-fill alt text with the filename as a helpful starting point.
      // The admin MUST replace this with descriptive alt text before publishing.
      setAltText(`Describe this image: ${f.name}`);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) {
      setMessage("Choose a file first.");
      setStatus("error");
      return;
    }
    if (selectedFile.size > MAX_BYTES) {
      setMessage(`File is ${formatBytes(selectedFile.size)} — the limit is 10 MB.`);
      setStatus("error");
      return;
    }

    setStatus("uploading");
    setMessage("");

    try {
      // 1. Get a presigned PUT URL from the server.
      const presignRes = await fetch("/api/admin/media/presign", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-csrf-token": csrfToken,
        },
        body: JSON.stringify({
          filename: selectedFile.name,
          contentType: selectedFile.type,
          contentLength: selectedFile.size,
          folder,
          slug: slug || undefined,
          csrf_token: csrfToken,
        }),
      });
      if (!presignRes.ok) {
        const data = await presignRes.json().catch(() => ({}));
        throw new Error(data.error || `presign failed (${presignRes.status})`);
      }
      const { uploadUrl, objectKey } = await presignRes.json();

      // 2. Upload the file directly to R2 via the presigned URL.
      setStatus("uploading");
      const putRes = await fetch(uploadUrl, {
        method: "PUT",
        headers: {
          "Content-Type": selectedFile.type,
        },
        body: selectedFile,
      });
      if (!putRes.ok) {
        throw new Error(`R2 PUT failed (${putRes.status})`);
      }

      // 3. Tell the server to confirm the upload and create the DB record.
      setStatus("confirming");
      const createRes = await fetch("/api/admin/media", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-csrf-token": csrfToken,
        },
        body: JSON.stringify({
          objectKey,
          originalFilename: selectedFile.name,
          contentType: selectedFile.type,
          altText: altText || "",
          caption: caption || undefined,
          consent,
          consentNotes: consentNotes || undefined,
          programme: programme || undefined,
          projectSlug: projectSlug || undefined,
          published,
          csrf_token: csrfToken,
        }),
      });
      if (!createRes.ok) {
        const data = await createRes.json().catch(() => ({}));
        throw new Error(data.error || `create failed (${createRes.status})`);
      }
      const { item } = await createRes.json();
      setItems((prev) => [item as MediaObjectRow, ...prev]);
      setMessage(`Uploaded ${item.originalFilename} (id #${item.id}).`);
      setStatus("idle");
      resetForm();
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Upload failed.");
      setStatus("error");
    }
  };

  const handleSaveEdit = async (id: number, fields: Record<string, unknown>) => {
    setStatus("saving");
    setMessage("");
    try {
      const res = await fetch("/api/admin/media", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "x-csrf-token": csrfToken,
        },
        body: JSON.stringify({ id, ...fields, csrf_token: csrfToken }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || `update failed (${res.status})`);
      }
      const { item } = await res.json();
      setItems((prev) => prev.map((it) => (it.id === id ? (item as MediaObjectRow) : it)));
      setEditingId(null);
      setMessage(`Saved changes to #${id}.`);
      setStatus("idle");
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Update failed.");
      setStatus("error");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm(`Delete media #${id}? The R2 object will be removed and the record soft-deleted. This cannot be undone.`)) {
      return;
    }
    setStatus("deleting");
    setMessage("");
    try {
      const res = await fetch("/api/admin/media", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "x-csrf-token": csrfToken,
        },
        body: JSON.stringify({ id, csrf_token: csrfToken }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || `delete failed (${res.status})`);
      }
      setItems((prev) => prev.filter((it) => it.id !== id));
      setMessage(`Deleted #${id}.`);
      setStatus("idle");
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Delete failed.");
      setStatus("error");
    }
  };

  const busy = status === "uploading" || status === "confirming" || status === "saving" || status === "deleting";

  return (
    <div className="mt-8 space-y-8">
      {/* Upload form */}
      <form
        onSubmit={handleUpload}
        className="space-y-4 rounded-xl border border-border bg-white p-6 shadow-sm"
        aria-label="Upload new media"
      >
        <h2 className="text-lg font-semibold">Upload new media</h2>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="block text-sm font-medium">File</span>
            <input
              ref={fileInputRef}
              type="file"
              onChange={onFileChange}
              required
              accept="image/jpeg,image/png,image/webp,image/avif,image/gif,application/pdf"
              className="mt-1.5 block w-full text-sm file:mr-3 file:rounded-lg file:border-0 file:bg-primary file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-primary/90"
            />
            {selectedFile && (
              <span className="mt-1 block text-xs text-muted-foreground">
                {selectedFile.name} — {formatBytes(selectedFile.size)}
              </span>
            )}
          </label>

          <label className="block">
            <span className="block text-sm font-medium">Folder</span>
            <select
              value={folder}
              onChange={(e) => setFolder(e.target.value)}
              className="mt-1.5 block w-full rounded-lg border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {FOLDERS.map((f) => (
                <option key={f.value} value={f.value}>
                  {f.label}
                </option>
              ))}
            </select>
          </label>

          {(folder === "programmes" || folder === "team") && (
            <label className="block">
              <span className="block text-sm font-medium">Slug (optional)</span>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                maxLength={100}
                placeholder="e.g. kasaale-borehole or omara-godfrey"
                className="mt-1.5 block w-full rounded-lg border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </label>
          )}

          <label className="block sm:col-span-2">
            <span className="block text-sm font-medium">
              Alt text <span className="text-destructive">*</span>
              <span className="font-normal text-muted-foreground"> (required for images; describe what is visible)</span>
            </span>
            <textarea
              value={altText}
              onChange={(e) => setAltText(e.target.value)}
              maxLength={500}
              rows={2}
              required
              className="mt-1.5 block w-full rounded-lg border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </label>

          <label className="block sm:col-span-2">
            <span className="block text-sm font-medium">Caption (optional)</span>
            <input
              type="text"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              maxLength={1000}
              className="mt-1.5 block w-full rounded-lg border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </label>

          <label className="block">
            <span className="block text-sm font-medium">Consent</span>
            <select
              value={consent}
              onChange={(e) => setConsent(e.target.value)}
              className="mt-1.5 block w-full rounded-lg border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {CONSENT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="block text-sm font-medium">Consent notes (optional)</span>
            <input
              type="text"
              value={consentNotes}
              onChange={(e) => setConsentNotes(e.target.value)}
              maxLength={1000}
              placeholder="e.g. Cleared by management 2026-07-27"
              className="mt-1.5 block w-full rounded-lg border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </label>

          <label className="block">
            <span className="block text-sm font-medium">Programme (optional)</span>
            <input
              type="text"
              value={programme}
              onChange={(e) => setProgramme(e.target.value)}
              maxLength={100}
              className="mt-1.5 block w-full rounded-lg border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </label>

          <label className="block">
            <span className="block text-sm font-medium">Project slug (optional)</span>
            <input
              type="text"
              value={projectSlug}
              onChange={(e) => setProjectSlug(e.target.value)}
              maxLength={150}
              className="mt-1.5 block w-full rounded-lg border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </label>

          <label className="flex items-center gap-2 sm:col-span-2">
            <input
              type="checkbox"
              checked={published}
              onChange={(e) => setPublished(e.target.checked)}
              className="h-4 w-4 rounded border-border"
            />
            <span className="text-sm font-medium">
              Publish immediately (only do this if consent is verified and alt text is final)
            </span>
          </label>
        </div>

        <button
          type="submit"
          disabled={busy}
          className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary/90 disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
        >
          {status === "uploading" ? "Uploading…" : status === "confirming" ? "Confirming…" : "Upload"}
        </button>
      </form>

      {message && (
        <div
          role={status === "error" ? "alert" : "status"}
          className={`rounded-lg p-4 text-sm ${status === "error" ? "bg-red-50 text-red-800" : "bg-green-50 text-green-800"}`}
        >
          {message}
        </div>
      )}

      {/* Existing media list with inline edit */}
      {items.length === 0 ? (
        <p className="text-sm text-muted-foreground">No media uploaded yet.</p>
      ) : (
        <ul className="space-y-4">
          {items.map((item) => (
            <li key={item.id} className="rounded-xl border border-border bg-white p-4 shadow-sm">
              {editingId === item.id ? (
                <EditForm
                  item={item}
                  onCancel={() => setEditingId(null)}
                  onSave={handleSaveEdit}
                  busy={busy}
                />
              ) : (
                <MediaRow
                  item={item}
                  onEdit={() => setEditingId(item.id)}
                  onDelete={() => handleDelete(item.id)}
                  busy={busy}
                />
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function MediaRow({
  item,
  onEdit,
  onDelete,
  busy,
}: {
  item: MediaObjectRow;
  onEdit: () => void;
  onDelete: () => void;
  busy: boolean;
}) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-4">
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="font-semibold">#{item.id}</span>
          <span className="text-xs text-muted-foreground">{item.contentType}</span>
          <span className="text-xs text-muted-foreground">{formatBytes(item.byteSize)}</span>
          {item.published ? (
            <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-semibold text-green-800">
              published
            </span>
          ) : (
            <span className="rounded-full border border-current px-2 py-0.5 text-xs font-semibold">
              draft
            </span>
          )}
        </div>
        <div className="mt-1 break-all font-mono text-xs text-muted-foreground">{item.objectKey}</div>
        <div className="mt-2 text-sm">
          <div>
            <strong>Alt:</strong> {item.altText || <em className="text-muted-foreground">(empty)</em>}
          </div>
          {item.caption && (
            <div>
              <strong>Caption:</strong> {item.caption}
            </div>
          )}
          <div>
            <strong>Consent:</strong> {item.consent}
            {item.consentNotes && <span className="text-muted-foreground"> — {item.consentNotes}</span>}
          </div>
          {item.programme && (
            <div>
              <strong>Programme:</strong> {item.programme}
            </div>
          )}
          {item.projectSlug && (
            <div>
              <strong>Project:</strong> {item.projectSlug}
            </div>
          )}
        </div>
      </div>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={onEdit}
          disabled={busy}
          className="rounded-lg border border-border bg-white px-3 py-1.5 text-sm font-semibold hover:bg-slate-50 disabled:opacity-50"
        >
          Edit
        </button>
        <button
          type="button"
          onClick={onDelete}
          disabled={busy}
          className="rounded-lg border border-red-300 bg-white px-3 py-1.5 text-sm font-semibold text-red-700 hover:bg-red-50 disabled:opacity-50"
        >
          Delete
        </button>
      </div>
    </div>
  );
}

function EditForm({
  item,
  onCancel,
  onSave,
  busy,
}: {
  item: MediaObjectRow;
  onCancel: () => void;
  onSave: (id: number, fields: Record<string, unknown>) => void;
  busy: boolean;
}) {
  const [altText, setAltText] = useState(item.altText);
  const [caption, setCaption] = useState(item.caption ?? "");
  const [consent, setConsent] = useState(item.consent);
  const [consentNotes, setConsentNotes] = useState(item.consentNotes ?? "");
  const [programme, setProgramme] = useState(item.programme ?? "");
  const [projectSlug, setProjectSlug] = useState(item.projectSlug ?? "");
  const [published, setPublished] = useState(item.published);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSave(item.id, {
          altText,
          caption: caption || null,
          consent,
          consentNotes: consentNotes || null,
          programme: programme || null,
          projectSlug: projectSlug || null,
          published,
        });
      }}
      className="space-y-3"
    >
      <h3 className="text-sm font-semibold">Edit #{item.id}</h3>
      <label className="block">
        <span className="block text-sm font-medium">Alt text</span>
        <textarea
          value={altText}
          onChange={(e) => setAltText(e.target.value)}
          maxLength={500}
          rows={2}
          className="mt-1.5 block w-full rounded-lg border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </label>
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="block">
          <span className="block text-sm font-medium">Caption</span>
          <input
            type="text"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            maxLength={1000}
            className="mt-1.5 block w-full rounded-lg border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </label>
        <label className="block">
          <span className="block text-sm font-medium">Consent</span>
          <select
            value={consent}
            onChange={(e) => setConsent(e.target.value as MediaObjectRow["consent"])}
            className="mt-1.5 block w-full rounded-lg border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          >
            {CONSENT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="block text-sm font-medium">Consent notes</span>
          <input
            type="text"
            value={consentNotes}
            onChange={(e) => setConsentNotes(e.target.value)}
            maxLength={1000}
            className="mt-1.5 block w-full rounded-lg border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </label>
        <label className="block">
          <span className="block text-sm font-medium">Programme</span>
          <input
            type="text"
            value={programme}
            onChange={(e) => setProgramme(e.target.value)}
            maxLength={100}
            className="mt-1.5 block w-full rounded-lg border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </label>
        <label className="block">
          <span className="block text-sm font-medium">Project slug</span>
          <input
            type="text"
            value={projectSlug}
            onChange={(e) => setProjectSlug(e.target.value)}
            maxLength={150}
            className="mt-1.5 block w-full rounded-lg border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </label>
        <label className="flex items-center gap-2 sm:col-span-2">
          <input
            type="checkbox"
            checked={published}
            onChange={(e) => setPublished(e.target.checked)}
            className="h-4 w-4 rounded border-border"
          />
          <span className="text-sm font-medium">Published</span>
        </label>
      </div>
      <div className="flex gap-2">
        <button
          type="submit"
          disabled={busy}
          className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary/90 disabled:opacity-50"
        >
          {busy ? "Saving…" : "Save"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          disabled={busy}
          className="rounded-lg border border-border bg-white px-4 py-2 text-sm font-semibold hover:bg-slate-50 disabled:opacity-50"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
