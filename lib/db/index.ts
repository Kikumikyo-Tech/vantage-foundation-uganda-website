import { neon } from "@neondatabase/serverless";

export interface DonationInput {
  name: string;
  email: string;
  phone?: string;
  amount: number;
  currency?: string;
  frequency: string;
  campaign: string;
  transactionReference?: string;
  message?: string;
}

export interface DonationRow extends DonationInput {
  id: number;
  createdAt: Date;
  status: "pending" | "verified" | "rejected";
  adminNotes?: string;
  verifiedAt?: Date;
}

function getSql() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error("DATABASE_URL is not configured");
  }
  return neon(url);
}

export async function createDonation(input: DonationInput): Promise<DonationRow> {
  const sql = getSql();
  const currency = input.currency || "UGX";

  const rows = await sql`
    INSERT INTO donations (
      name, email, phone, amount, currency, frequency, campaign,
      transaction_reference, message, status
    ) VALUES (
      ${input.name}, ${input.email}, ${input.phone || null},
      ${input.amount}, ${currency}, ${input.frequency},
      ${input.campaign}, ${input.transactionReference || null},
      ${input.message || null}, 'pending'
    )
    RETURNING *
  `;

  return mapRow(rows[0]);
}

export async function getDonations(): Promise<DonationRow[]> {
  const sql = getSql();
  const rows = await sql`
    SELECT * FROM donations
    ORDER BY created_at DESC
  `;
  return rows.map(mapRow);
}

export async function updateDonationStatus(
  id: number,
  status: "pending" | "verified" | "rejected",
  adminNotes?: string
): Promise<DonationRow> {
  const sql = getSql();

  const rows = await sql`
    UPDATE donations
    SET
      status = ${status},
      admin_notes = ${adminNotes || null},
      verified_at = CASE WHEN ${status} = 'verified' THEN CURRENT_TIMESTAMP ELSE verified_at END
    WHERE id = ${id}
    RETURNING *
  `;

  return mapRow(rows[0]);
}

function mapRow(row: Record<string, unknown>): DonationRow {
  return {
    id: row.id as number,
    createdAt: row.created_at as Date,
    name: row.name as string,
    email: row.email as string,
    phone: (row.phone as string) || undefined,
    amount: Number(row.amount),
    currency: (row.currency as string) || "UGX",
    frequency: row.frequency as string,
    campaign: row.campaign as string,
    transactionReference: (row.transaction_reference as string) || undefined,
    message: (row.message as string) || undefined,
    status: row.status as "pending" | "verified" | "rejected",
    adminNotes: (row.admin_notes as string) || undefined,
    verifiedAt: row.verified_at ? (row.verified_at as Date) : undefined,
  };
}
