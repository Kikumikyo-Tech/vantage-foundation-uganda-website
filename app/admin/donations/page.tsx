import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { getDonations, DonationRow } from "@/lib/db";
import { Container } from "@/components/shared/Container";
import { Badge } from "@/components/ui/Badge";

export default async function AdminDonationsPage({
  searchParams,
}: {
  searchParams: Promise<{ updated?: string; error?: string }>;
}) {
  const { updated, error } = await searchParams;
  const cookieStore = await cookies();

  if (
    !process.env.ADMIN_SECRET ||
    cookieStore.get("vantage_admin")?.value !== process.env.ADMIN_SECRET
  ) {
    redirect("/admin/login");
  }

  let donations: DonationRow[] = [];
  let dbError = "";

  try {
    donations = await getDonations();
  } catch {
    dbError = "Could not load donations. Please check that DATABASE_URL is set correctly.";
  }

  const statusVariant = (
    status: DonationRow["status"]
  ): "success" | "warning" | "destructive" => {
    switch (status) {
      case "verified":
        return "success";
      case "rejected":
        return "destructive";
      default:
        return "warning";
    }
  };

  return (
    <section className="py-12 md:py-16">
      <Container>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Donation verifications</h1>
            <p className="text-sm text-muted-foreground">
              Verify each donation against the official bank statement before marking it successful.
            </p>
          </div>
          <form method="post" action="/api/admin/logout">
            <button
              type="submit"
              className="rounded-lg border border-border bg-white px-4 py-2 text-sm font-semibold hover:bg-slate-50"
            >
              Log out
            </button>
          </form>
        </div>

        {updated && (
          <div className="mt-4 rounded-lg bg-green-50 p-4 text-sm text-green-800">
            Donation status updated successfully.
          </div>
        )}
        {error && (
          <div className="mt-4 rounded-lg bg-red-50 p-4 text-sm text-red-800">
            Could not update donation status. {error === "invalid" && "Invalid input."}{" "}
            {error === "db" && "Database error."}
          </div>
        )}
        {dbError && (
          <div className="mt-4 rounded-lg bg-amber-50 p-4 text-sm text-amber-900">
            {dbError}
          </div>
        )}

        <div className="mt-8 overflow-x-auto rounded-xl border border-border bg-white shadow-sm">
          <table className="min-w-full divide-y divide-border">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  ID
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Date
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Donor
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Amount
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Campaign
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Reference
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {donations.map((donation) => (
                <tr key={donation.id} className="align-top">
                  <td className="whitespace-nowrap px-4 py-3 text-sm">#{donation.id}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-sm text-muted-foreground">
                    {new Date(donation.createdAt).toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <div className="font-medium">{donation.name}</div>
                    <div className="text-muted-foreground">{donation.email}</div>
                    {donation.phone && (
                      <div className="text-muted-foreground">{donation.phone}</div>
                    )}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-sm">
                    {Math.round(donation.amount).toLocaleString()} {donation.currency}
                    <div className="text-xs text-muted-foreground">{donation.frequency}</div>
                  </td>
                  <td className="px-4 py-3 text-sm">{donation.campaign}</td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">
                    {donation.transactionReference || "—"}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-sm">
                    <Badge variant={statusVariant(donation.status)}>{donation.status}</Badge>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <form method="post" action="/api/admin/verify" className="space-y-2">
                      <input type="hidden" name="id" value={donation.id} />
                      <select
                        name="status"
                        defaultValue={donation.status}
                        className="block w-full rounded-lg border border-border px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                      >
                        <option value="pending">Pending</option>
                        <option value="verified">Verified</option>
                        <option value="rejected">Rejected</option>
                      </select>
                      <input
                        name="adminNotes"
                        type="text"
                        placeholder="Admin notes"
                        defaultValue={donation.adminNotes || ""}
                        className="block w-full rounded-lg border border-border px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                      <button
                        type="submit"
                        className="rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-white hover:bg-primary/90"
                      >
                        Update
                      </button>
                    </form>
                  </td>
                </tr>
              ))}
              {donations.length === 0 && !dbError && (
                <tr>
                  <td
                    colSpan={8}
                    className="px-4 py-8 text-center text-sm text-muted-foreground"
                  >
                    No donations yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Container>
    </section>
  );
}
