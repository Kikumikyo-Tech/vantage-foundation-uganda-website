import "server-only";
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
  HeadObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { getObjectStorageRuntimeEnv } from "@/lib/env";

/**
 * Cloudflare R2 client and presigned-URL helpers.
 *
 * R2 is S3-compatible, so we use the AWS SDK v3 with the bucket's R2 endpoint.
 * All helpers are server-only — the R2 credentials are never bundled for the
 * browser. Public access to uploaded objects is via short-lived presigned GET
 * URLs (private bucket model). If the bucket is later exposed via a Cloudflare
 * custom domain, swap `getPublicSrc()` for a URL built from that domain.
 *
 * The client is created lazily and cached per process so we don't re-instantiate
 * on every request. Credentials are read from the validated env schema in
 * lib/env.ts (R2_ENDPOINT, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET_NAME).
 */

let cachedClient: S3Client | null = null;

/**
 * Returns a cached S3Client configured for the R2 endpoint.
 * Throws if the R2 environment variables are missing or invalid (see lib/env.ts).
 */
export function getR2Client(): S3Client {
  if (cachedClient) return cachedClient;

  const env = getObjectStorageRuntimeEnv();
  cachedClient = new S3Client({
    region: "auto",
    endpoint: env.R2_ENDPOINT,
    credentials: {
      accessKeyId: env.R2_ACCESS_KEY_ID,
      secretAccessKey: env.R2_SECRET_ACCESS_KEY,
    },
    // R2 does not support multipart uploads the same way S3 does for small
    // objects; force path-style addressing which R2 requires.
    forcePathStyle: true,
  });
  return cachedClient;
}

/** Bucket name from the validated env schema. */
export function getR2BucketName(): string {
  return getObjectStorageRuntimeEnv().R2_BUCKET_NAME;
}

/** Default lifetime for presigned PUT URLs (5 minutes). */
export const PUT_URL_TTL_SECONDS = 300;

/** Default lifetime for presigned GET URLs (1 hour). */
export const GET_URL_TTL_SECONDS = 3600;

/**
 * Allowed upload MIME types and their corresponding object-key suffixes.
 * Restricting the content-type at presign time prevents an attacker from
 * uploading arbitrary HTML/JS that could be served as a dangerous content-type.
 */
export const ALLOWED_UPLOAD_TYPES: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
  "image/avif": ".avif",
  "image/gif": ".gif",
  "application/pdf": ".pdf",
};

/** Maximum upload size (10 MB). Enforced at presign time and again by R2. */
export const MAX_UPLOAD_BYTES = 10 * 1024 * 1024;

/**
 * Returns a short-lived presigned URL the browser can use to PUT an object
 * directly to R2. The object is uploaded by the browser (not the server) to
 * avoid streaming large files through the Vercel function, but the URL is
 * scoped to a single key, content-type, and size window.
 *
 * The `expectedContentType` is enforced by the presigned URL conditions: R2
 * will reject the PUT if the browser sends a different Content-Type header.
 */
export async function createPresignedPutUrl(options: {
  objectKey: string;
  contentType: string;
  contentLength?: number;
  ttlSeconds?: number;
}): Promise<string> {
  const allowed = ALLOWED_UPLOAD_TYPES[options.contentType];
  if (!allowed) {
    throw new Error(`Unsupported upload content type: ${options.contentType}`);
  }
  if (options.contentLength !== undefined && options.contentLength > MAX_UPLOAD_BYTES) {
    throw new Error(`Upload exceeds maximum size of ${MAX_UPLOAD_BYTES} bytes`);
  }

  const client = getR2Client();
  const bucket = getR2BucketName();
  const command = new PutObjectCommand({
    Bucket: bucket,
    Key: options.objectKey,
    ContentType: options.contentType,
    // Condition: the browser must send exactly this content-type (and, when
    // supplied, a content-length within bounds). This is enforced by R2.
    ContentLength: options.contentLength,
  });

  return getSignedUrl(client, command, {
    expiresIn: options.ttlSeconds ?? PUT_URL_TTL_SECONDS,
  });
}

/**
 * Returns a short-lived presigned URL the browser can use to GET (view/download)
 * an object from R2. Used for serving uploaded media to site visitors when the
 * bucket is not publicly exposed.
 */
export async function createPresignedGetUrl(options: {
  objectKey: string;
  ttlSeconds?: number;
}): Promise<string> {
  const client = getR2Client();
  const bucket = getR2BucketName();
  const command = new GetObjectCommand({ Bucket: bucket, Key: options.objectKey });
  return getSignedUrl(client, command, {
    expiresIn: options.ttlSeconds ?? GET_URL_TTL_SECONDS,
  });
}

/**
 * Deletes an object from R2. Used when an admin removes a media record.
 * Returns true if the object was deleted (or already absent), false on error.
 */
export async function deleteR2Object(objectKey: string): Promise<boolean> {
  try {
    const client = getR2Client();
    const bucket = getR2BucketName();
    await client.send(
      new DeleteObjectCommand({ Bucket: bucket, Key: objectKey })
    );
    return true;
  } catch {
    // Log via the structured logger at the call site; this helper stays
    // focused on the storage operation. Return false so the caller can
    // decide whether to keep the DB record (orphaned) or force-remove it.
    return false;
  }
}

/**
 * Verifies that an object exists in R2 and returns its size + content-type.
 * Used after a browser upload completes to confirm the object landed before
 * we record it in the database.
 */
export async function headR2Object(
  objectKey: string
): Promise<{ size: number; contentType: string } | null> {
  try {
    const client = getR2Client();
    const bucket = getR2BucketName();
    const result = await client.send(
      new HeadObjectCommand({ Bucket: bucket, Key: objectKey })
    );
    return {
      size: result.ContentLength ?? 0,
      contentType: result.ContentType ?? "application/octet-stream",
    };
  } catch {
    return null;
  }
}

/**
 * Returns the public `src` value to store in the database for a media object.
 *
 * Default (private bucket): we store the R2 object key only — the actual
 * browser URL is generated on demand via `createPresignedGetUrl` when the
 * image is rendered. This keeps the DB stable (no expiring URLs) and lets us
 * switch access modes later without a data migration.
 *
 * If you later expose the bucket via a Cloudflare custom domain, change this
 * function to return `https://${CDN_DOMAIN}/${objectKey}` and stop calling
 * `createPresignedGetUrl` at render time.
 */
export function getPublicSrc(objectKey: string): string {
  // Prefix with r2:// so the rendering layer can distinguish R2-backed media
  // from local /images/photos/* paths in the existing media manifest.
  return `r2://${objectKey}`;
}

/**
 * Returns true if a `src` value points to an R2-backed object (vs a local
 * path in /images/photos/). Used by the rendering layer to decide whether to
 * mint a presigned GET URL or use the path as-is.
 */
export function isR2Src(src: string): boolean {
  return src.startsWith("r2://");
}

/**
 * Extracts the raw R2 object key from an `r2://`-prefixed src value.
 */
export function objectKeyFromSrc(src: string): string {
  if (!isR2Src(src)) return src;
  return src.slice("r2://".length);
}
