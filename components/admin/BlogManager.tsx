"use client";

import { useState, useRef, useCallback } from "react";
import type { BlogPostRow } from "@/lib/db/blog";

interface BlogManagerProps {
  csrfToken: string;
  initialItems: BlogPostRow[];
}

type Status = "idle" | "uploading" | "saving" | "deleting" | "error";

const CATEGORIES = [
  "Health",
  "Education",
  "Humanitarian Action",
  "Community Stories",
  "Foundation News",
  "Research & Learning",
  "Accountability",
] as const;

const CONSENT_OPTIONS = [
  { value: "none", label: "No people" },
  { value: "pending", label: "Pending" },
  { value: "verified", label: "Verified" },
  { value: "group-consent", label: "Group consent" },
] as const;

const MAX_BYTES = 10 * 1024 * 1024;

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function BlogManager({ csrfToken, initialItems }: BlogManagerProps) {
  const [items, setItems] = useState<BlogPostRow[]>(initialItems);
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Create form state
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [slugTouched, setSlugTouched] = useState(false);
  const [category, setCategory] = useState<string>("Foundation News");
  const [summary, setSummary] = useState("");
  const [bodyMd, setBodyMd] = useState("");
  const [author, setAuthor] = useState("");
  const [publishedAt, setPublishedAt] = useState(() => new Date().toISOString().slice(0, 10));
  const [readingTimeMinutes, setReadingTimeMinutes] = useState("");
  const [heroImageAlt, setHeroImageAlt] = useState("");
  const [consentClassification, setConsentClassification] = useState("none");
  const [published, setPublished] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const resetForm = useCallback(() => {
    setTitle("");
    setSlug("");
    setSlugTouched(false);
    setCategory("Foundation News");
    setSummary("");
    setBodyMd("");
    setAuthor("");
    setPublishedAt(new Date().toISOString().slice(0, 10));
    setReadingTimeMinutes("");
    setHeroImageAlt("");
    setConsentClassification("none");
    setPublished(false);
    setSelectedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }, []);

  const onTitleChange = (value: string) => {
    setTitle(value);
    if (!slugTouched) setSlug(slugify(value));
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedFile && selectedFile.size > MAX_BYTES) {
      setMessage(`Hero image is ${formatBytes(selectedFile.size)} — the limit is 10 MB.`);
      setStatus("error");
      return;
    }

    setStatus("uploading");
    setMessage("");

    try {
      let heroImageKey: string | undefined;

      if (selectedFile) {
        // 1. Get a presigned PUT URL from the existing media upload endpoint
        // (folder="blog" keys the object under vantage/blog/{slug}/...).
        const presignRes = await fetch("/api/admin/media/presign", {
          method: "POST",
          headers: { "Content-Type": "application/json", "x-csrf-token": csrfToken },
          body: JSON.stringify({
            filename: selectedFile.name,
            contentType: selectedFile.type,
            contentLength: selectedFile.size,
            folder: "blog",
            slug,
            csrf_token: csrfToken,
          }),
        });
        if (!presignRes.ok) {
          const data = await presignRes.json().catch(() => ({}));
          throw new Error(data.error || `presign failed (${presignRes.status})`);
        }
        const presigned = await presignRes.json();
        heroImageKey = presigned.objectKey;

        // 2. Upload the file directly to R2 via the presigned URL.
        const putRes = await fetch(presigned.uploadUrl, {
          method: "PUT",
          headers: { "Content-Type": selectedFile.type },
          body: selectedFile,
        });
        if (!putRes.ok) throw new Error(`R2 PUT failed (${putRes.status})`);
      }

      // 3. Create the blog post.
      setStatus("saving");
      const createRes = await fetch("/api/admin/blog", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-csrf-token": csrfToken },
        body: JSON.stringify({
          slug,
          title,
          category,
          summary,
          body: bodyMd,
          author: author || undefined,
          publishedAt,
          readingTimeMinutes: readingTimeMinutes ? Number(readingTimeMinutes) : undefined,
          heroImageKey,
          heroImageAlt: heroImageAlt || undefined,
          consentClassification,
          published,
          csrf_token: csrfToken,
        }),
      });
      if (!createRes.ok) {
        const data = await createRes.json().catch(() => ({}));
        throw new Error(data.error || `create failed (${createRes.status})`);
      }
      const { item } = await createRes.json();
      setItems((prev) => [item as BlogPostRow, ...prev]);
      setMessage(`Created "${item.title}" (id #${item.id}).`);
      setStatus("idle");
      resetForm();
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Create failed.");
      setStatus("error");
    }
  };

  const handleSaveEdit = async (id: number, fields: Record<string, unknown>) => {
    setStatus("saving");
    setMessage("");
    try {
      const res = await fetch("/api/admin/blog", {
        method: "PATCH",
        headers: { "Content-Type": "application/json", "x-csrf-token": csrfToken },
        body: JSON.stringify({ id, ...fields, csrf_token: csrfToken }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || `update failed (${res.status})`);
      }
      const { item } = await res.json();
      setItems((prev) => prev.map((it) => (it.id === id ? (item as BlogPostRow) : it)));
      setEditingId(null);
      setMessage(`Saved changes to #${id}.`);
      setStatus("idle");
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Update failed.");
      setStatus("error");
    }
  };

  const handleDelete = async (id: number, title: string) => {
    if (!confirm(`Delete "${title}"? The hero image (if any) will be removed from R2 and the post soft-deleted. This cannot be undone.`)) {
      return;
    }
    setStatus("deleting");
    setMessage("");
    try {
      const res = await fetch("/api/admin/blog", {
        method: "DELETE",
        headers: { "Content-Type": "application/json", "x-csrf-token": csrfToken },
        body: JSON.stringify({ id, csrf_token: csrfToken }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || `delete failed (${res.status})`);
      }
      setItems((prev) => prev.filter((it) => it.id !== id));
      setMessage(`Deleted "${title}".`);
      setStatus("idle");
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Delete failed.");
      setStatus("error");
    }
  };

  const busy = status === "uploading" || status === "saving" || status === "deleting";

  return (
    <div className="mt-8 space-y-8">
      {/* Create form */}
      <form
        onSubmit={handleCreate}
        className="space-y-4 rounded-xl border border-border bg-white p-6 shadow-sm"
        aria-label="Write new post"
      >
        <h2 className="text-lg font-semibold">Write new post</h2>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block sm:col-span-2">
            <span className="block text-sm font-medium">Title</span>
            <input
              type="text"
              value={title}
              onChange={(e) => onTitleChange(e.target.value)}
              maxLength={200}
              required
              className="mt-1.5 block w-full rounded-lg border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </label>

          <label className="block">
            <span className="block text-sm font-medium">Slug</span>
            <input
              type="text"
              value={slug}
              onChange={(e) => {
                setSlug(slugify(e.target.value));
                setSlugTouched(true);
              }}
              maxLength={150}
              required
              pattern="[a-z0-9]+(-[a-z0-9]+)*"
              className="mt-1.5 block w-full rounded-lg border border-border px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </label>

          <label className="block">
            <span className="block text-sm font-medium">Category</span>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="mt-1.5 block w-full rounded-lg border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </label>

          <label className="block sm:col-span-2">
            <span className="block text-sm font-medium">Summary</span>
            <textarea
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              maxLength={500}
              rows={2}
              required
              className="mt-1.5 block w-full rounded-lg border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </label>

          <label className="block sm:col-span-2">
            <span className="block text-sm font-medium">Body (Markdown)</span>
            <textarea
              value={bodyMd}
              onChange={(e) => setBodyMd(e.target.value)}
              rows={10}
              required
              className="mt-1.5 block w-full rounded-lg border border-border px-3 py-2 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </label>

          <label className="block">
            <span className="block text-sm font-medium">Author (optional)</span>
            <input
              type="text"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              maxLength={150}
              className="mt-1.5 block w-full rounded-lg border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </label>

          <label className="block">
            <span className="block text-sm font-medium">Published date</span>
            <input
              type="date"
              value={publishedAt}
              onChange={(e) => setPublishedAt(e.target.value)}
              required
              className="mt-1.5 block w-full rounded-lg border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </label>

          <label className="block">
            <span className="block text-sm font-medium">Reading time, minutes (optional)</span>
            <input
              type="number"
              min={1}
              value={readingTimeMinutes}
              onChange={(e) => setReadingTimeMinutes(e.target.value)}
              className="mt-1.5 block w-full rounded-lg border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </label>

          <label className="block">
            <span className="block text-sm font-medium">Hero image (optional)</span>
            <input
              ref={fileInputRef}
              type="file"
              onChange={(e) => setSelectedFile(e.target.files?.[0] ?? null)}
              accept="image/jpeg,image/png,image/webp,image/avif,image/gif"
              className="mt-1.5 block w-full text-sm file:mr-3 file:rounded-lg file:border-0 file:bg-primary file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-primary/90"
            />
            {selectedFile && (
              <span className="mt-1 block text-xs text-muted-foreground">
                {selectedFile.name} — {formatBytes(selectedFile.size)}
              </span>
            )}
          </label>

          <label className="block">
            <span className="block text-sm font-medium">
              Hero image alt text {selectedFile && <span className="text-destructive">*</span>}
            </span>
            <input
              type="text"
              value={heroImageAlt}
              onChange={(e) => setHeroImageAlt(e.target.value)}
              maxLength={500}
              required={!!selectedFile}
              className="mt-1.5 block w-full rounded-lg border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </label>

          <label className="block">
            <span className="block text-sm font-medium">Hero image consent</span>
            <select
              value={consentClassification}
              onChange={(e) => setConsentClassification(e.target.value)}
              className="mt-1.5 block w-full rounded-lg border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {CONSENT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </label>

          <label className="flex items-center gap-2 sm:col-span-2">
            <input
              type="checkbox"
              checked={published}
              onChange={(e) => setPublished(e.target.checked)}
              className="h-4 w-4 rounded border-border"
            />
            <span className="text-sm font-medium">
              Publish immediately (only do this once the post and any hero image consent are final)
            </span>
          </label>
        </div>

        <button
          type="submit"
          disabled={busy}
          className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary/90 disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
        >
          {status === "uploading" ? "Uploading…" : status === "saving" ? "Saving…" : "Create post"}
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

      {/* Existing posts with inline edit */}
      {items.length === 0 ? (
        <p className="text-sm text-muted-foreground">No posts written yet.</p>
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
                <BlogRow
                  item={item}
                  onEdit={() => setEditingId(item.id)}
                  onDelete={() => handleDelete(item.id, item.title)}
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

function BlogRow({
  item,
  onEdit,
  onDelete,
  busy,
}: {
  item: BlogPostRow;
  onEdit: () => void;
  onDelete: () => void;
  busy: boolean;
}) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-4">
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="font-semibold">#{item.id}</span>
          <span className="text-xs text-muted-foreground">{item.category}</span>
          <span className="text-xs text-muted-foreground">{item.publishedAt}</span>
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
        <div className="mt-1 text-base font-semibold">{item.title}</div>
        <div className="font-mono text-xs text-muted-foreground">/blog/{item.slug}</div>
        <p className="mt-2 text-sm text-muted-foreground">{item.summary}</p>
        {item.heroImageKey && (
          <div className="mt-1 break-all font-mono text-xs text-muted-foreground">
            {item.heroImageKey}
          </div>
        )}
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
  item: BlogPostRow;
  onCancel: () => void;
  onSave: (id: number, fields: Record<string, unknown>) => void;
  busy: boolean;
}) {
  const [title, setTitle] = useState(item.title);
  const [category, setCategory] = useState(item.category);
  const [summary, setSummary] = useState(item.summary);
  const [bodyMd, setBodyMd] = useState(item.body);
  const [author, setAuthor] = useState(item.author ?? "");
  const [publishedAt, setPublishedAt] = useState(item.publishedAt);
  const [readingTimeMinutes, setReadingTimeMinutes] = useState(
    item.readingTimeMinutes?.toString() ?? ""
  );
  const [heroImageAlt, setHeroImageAlt] = useState(item.heroImageAlt ?? "");
  const [consentClassification, setConsentClassification] = useState(item.consentClassification);
  const [published, setPublished] = useState(item.published);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSave(item.id, {
          title,
          category,
          summary,
          body: bodyMd,
          author: author || null,
          publishedAt,
          readingTimeMinutes: readingTimeMinutes ? Number(readingTimeMinutes) : null,
          heroImageAlt: heroImageAlt || null,
          consentClassification,
          published,
        });
      }}
      className="space-y-3"
    >
      <h3 className="text-sm font-semibold">Edit #{item.id}</h3>
      <label className="block">
        <span className="block text-sm font-medium">Title</span>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          maxLength={200}
          className="mt-1.5 block w-full rounded-lg border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </label>
      <label className="block">
        <span className="block text-sm font-medium">Summary</span>
        <textarea
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
          maxLength={500}
          rows={2}
          className="mt-1.5 block w-full rounded-lg border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </label>
      <label className="block">
        <span className="block text-sm font-medium">Body (Markdown)</span>
        <textarea
          value={bodyMd}
          onChange={(e) => setBodyMd(e.target.value)}
          rows={10}
          className="mt-1.5 block w-full rounded-lg border border-border px-3 py-2 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </label>
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="block">
          <span className="block text-sm font-medium">Category</span>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as BlogPostRow["category"])}
            className="mt-1.5 block w-full rounded-lg border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="block text-sm font-medium">Author</span>
          <input
            type="text"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            maxLength={150}
            className="mt-1.5 block w-full rounded-lg border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </label>
        <label className="block">
          <span className="block text-sm font-medium">Published date</span>
          <input
            type="date"
            value={publishedAt}
            onChange={(e) => setPublishedAt(e.target.value)}
            className="mt-1.5 block w-full rounded-lg border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </label>
        <label className="block">
          <span className="block text-sm font-medium">Reading time, minutes</span>
          <input
            type="number"
            min={1}
            value={readingTimeMinutes}
            onChange={(e) => setReadingTimeMinutes(e.target.value)}
            className="mt-1.5 block w-full rounded-lg border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </label>
        <label className="block">
          <span className="block text-sm font-medium">Hero image alt text</span>
          <input
            type="text"
            value={heroImageAlt}
            onChange={(e) => setHeroImageAlt(e.target.value)}
            maxLength={500}
            className="mt-1.5 block w-full rounded-lg border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </label>
        <label className="block">
          <span className="block text-sm font-medium">Hero image consent</span>
          <select
            value={consentClassification}
            onChange={(e) => setConsentClassification(e.target.value as BlogPostRow["consentClassification"])}
            className="mt-1.5 block w-full rounded-lg border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          >
            {CONSENT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
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
