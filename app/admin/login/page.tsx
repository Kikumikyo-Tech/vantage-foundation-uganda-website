import { Container } from "@/components/shared/Container";

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <section className="py-16 md:py-24">
      <Container className="max-w-md">
        <h1 className="text-2xl font-bold">Admin login</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Enter the administrator password to view and verify donations.
        </p>

        <form
          method="post"
          action="/api/admin/login"
          className="mt-6 space-y-4 rounded-xl border border-border bg-white p-6 shadow-sm"
        >
          <div>
            <label htmlFor="password" className="block text-sm font-medium">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="mt-1.5 block w-full rounded-lg border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <button
            type="submit"
            className="w-full rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary/90"
          >
            Sign in
          </button>
          {error === "rate-limited" && (
            <p className="text-sm text-red-600">
              Too many login attempts. Please wait a minute and try again.
            </p>
          )}
          {error && error !== "rate-limited" && (
            <p className="text-sm text-red-600">Incorrect password. Please try again.</p>
          )}
        </form>
      </Container>
    </section>
  );
}
