import "server-only";
import { z } from "zod";

/**
 * Cloudflare R2 object storage — the SAME bucket/credentials already used by
 * the sibling kikumikyo project (see that project's lib/env.ts and
 * lib/storage/platform-objects.ts). These variable names are fixed and must
 * not be renamed: R2_ENDPOINT, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY,
 * R2_BUCKET_NAME. Vantage's objects live under a vantage/ prefix within the
 * shared bucket (see lib/storage/vantage-objects.ts) so nothing here
 * collides with kikumikyo's own prefixes.
 */
const objectStorageRuntimeSchema = z.object({
  R2_ENDPOINT: z.string().url().startsWith("https://"),
  R2_ACCESS_KEY_ID: z.string().min(1),
  R2_SECRET_ACCESS_KEY: z.string().min(1),
  R2_BUCKET_NAME: z.string().min(3),
});

export type ObjectStorageRuntimeEnv = z.infer<typeof objectStorageRuntimeSchema>;

function parseEnvironment<T>(schema: z.ZodType<T>, values: unknown, group: string): T {
  const result = schema.safeParse(values);

  if (!result.success) {
    const names = result.error.issues
      .map((issue) => issue.path.join("."))
      .filter(Boolean)
      .join(", ");

    throw new Error(`${group} environment is incomplete: ${names}`);
  }

  return result.data;
}

export function getObjectStorageRuntimeEnv(): ObjectStorageRuntimeEnv {
  return parseEnvironment(
    objectStorageRuntimeSchema,
    {
      R2_ENDPOINT: process.env.R2_ENDPOINT,
      R2_ACCESS_KEY_ID: process.env.R2_ACCESS_KEY_ID,
      R2_SECRET_ACCESS_KEY: process.env.R2_SECRET_ACCESS_KEY,
      R2_BUCKET_NAME: process.env.R2_BUCKET_NAME,
    },
    "Object storage",
  );
}
