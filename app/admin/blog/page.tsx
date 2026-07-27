import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { verifySessionToken, sessionCookieName } from "@/lib/session";
import { getCsrfTokenFromRequest, CSRF_FIELD_NAME } from "@/lib/csrf";
import { getBlogPosts } from "@/lib/db/blog";
import { Container } from "@/components/shared/Container";
import { Badge } from "@/components/ui/Badge";
import { BlogManager } from "@/components/admin/BlogManager";

export const metadata: Metadata = {
  title: "Blog",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function AdminBlogPage({
  searchParams,
}: {
  searchParams: Promise<{ created?: string; updated?: string; deleted?: string; error?: string }>;
}) {
  const { created, updated, deleted, error } = await searchParams;
  const cookieStore = await cookies();

  if (!verifySessionToken(cookieStore.get(sessionCookieName)?.value)) {
    redirect("/admin/login");
  }

  const csrfToken = await getCsrfTokenFromRequest();

  let items: Awaited<ReturnType<typeof getBlogPosts>> = [];
  let dbError = "";
  try {
    items = await getBlogPosts();
  } catch {
    dbError =
      "Could not load posts. Check that DATABASE_URL is set and the blog_posts table exists (run `node scripts/setup-db.mjs`).";
  }

  return (
    <section className="py-12 md:py-16">
      <Container>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Blog</h1>
            <p className="text-sm text-muted-foreground">
              Write and manage blog posts. New posts default to a{" "}
              <strong>draft</strong> — set <strong>published</strong> once
              the post and any hero image consent are final.
            </p>
          </div>
          <nav className="flex gap-2" aria-label="Admin navigation">
            <a
              href="/admin/media"
              className="rounded-lg border border-border bg-white px-4 py-2 text-sm font-semibold hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            >
              Media library
            </a>
            <a
              href="/admin/donations"
              className="rounded-lg border border-border bg-white px-4 py-2 text-sm font-semibold hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            >
              Donations
            </a>
            <form method="post" action="/api/admin/logout">
              <input type="hidden" name={CSRF_FIELD_NAME} value={csrfToken} />
              <button
                type="submit"
                className="rounded-lg border border-border bg-white px-4 py-2 text-sm font-semibold hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              >
                Log out
              </button>
            </form>
          </nav>
        </div>

        {created && (
          <div role="status" className="mt-4 rounded-lg bg-green-50 p-4 text-sm text-green-800">
            Post created. Review it before publishing.
          </div>
        )}
        {updated && (
          <div role="status" className="mt-4 rounded-lg bg-green-50 p-4 text-sm text-green-800">
            Post updated successfully.
          </div>
        )}
        {deleted && (
          <div role="status" className="mt-4 rounded-lg bg-slate-50 p-4 text-sm text-slate-700">
            Post deleted. Its hero image (if any) was removed from R2 and the record soft-deleted.
          </div>
        )}
        {error && (
          <div role="alert" className="mt-4 rounded-lg bg-red-50 p-4 text-sm text-red-800">
            {error === "csrf" && "Security check failed. Please reload the page."}
            {error === "unauthorized" && "Your session expired. Please log in again."}
            {error === "rate-limited" && "Too many requests. Please wait a minute."}
            {error === "object-not-found" && "The hero image was not found in R2. Try uploading again."}
            {error === "duplicate" && "A post with this slug already exists."}
            {error === "db" && "Database error. Check DATABASE_URL and the blog_posts table."}
            {error === "not-found" && "Post not found."}
            {error === "invalid" && "Invalid input."}
          </div>
        )}
        {dbError && (
          <div role="alert" className="mt-4 rounded-lg bg-amber-50 p-4 text-sm text-amber-900">
            {dbError}
          </div>
        )}

        <BlogManager csrfToken={csrfToken} initialItems={items} />

        {items.length > 0 && (
          <div className="mt-8 overflow-x-auto rounded-xl border border-border bg-white shadow-sm">
            <table className="min-w-full divide-y divide-border">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    ID
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Title / slug
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Category
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Published
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {items.map((item) => (
                  <tr key={item.id} className="align-top">
                    <td className="whitespace-nowrap px-4 py-3 text-sm">#{item.id}</td>
                    <td className="px-4 py-3 text-sm">
                      {item.title}
                      <div className="font-mono text-xs text-muted-foreground">/blog/{item.slug}</div>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-sm">{item.category}</td>
                    <td className="whitespace-nowrap px-4 py-3 text-sm">
                      {item.published ? (
                        <Badge variant="success">published</Badge>
                      ) : (
                        <Badge variant="outline">draft</Badge>
                      )}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-sm text-muted-foreground">
                      {item.publishedAt}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Container>
    </section>
  );
}
