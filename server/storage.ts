/**
 * Storage helpers — Cloudflare R2 via AWS S3 SDK
 * Credentials are injected via environment variables:
 *   R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET, R2_PUBLIC_URL
 */
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

function getR2Client(): { client: S3Client; bucket: string; publicUrl: string } {
  const accountId = process.env.R2_ACCOUNT_ID;
  const accessKeyId = process.env.R2_ACCESS_KEY_ID;
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
  const bucket = process.env.R2_BUCKET ?? "adneo-media";
  const publicUrl = process.env.R2_PUBLIC_URL ?? "";

  if (!accountId || !accessKeyId || !secretAccessKey) {
    throw new Error(
      "Cloudflare R2 credentials missing: set R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY"
    );
  }

  const client = new S3Client({
    region: "auto",
    endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
    credentials: { accessKeyId, secretAccessKey },
  });

  return { client, bucket, publicUrl };
}

export async function storagePut(
  relKey: string,
  data: Buffer | Uint8Array | string,
  contentType = "application/octet-stream"
): Promise<{ key: string; url: string }> {
  const { client, bucket, publicUrl } = getR2Client();
  const key = relKey.replace(/^\/+/, "");
  const body = typeof data === "string" ? Buffer.from(data) : data;

  await client.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: body,
      ContentType: contentType,
    })
  );

  const accountId = process.env.R2_ACCOUNT_ID ?? "";
  const url = publicUrl
    ? `${publicUrl.replace(/\/+$/, "")}/${key}`
    : `https://${accountId}.r2.cloudflarestorage.com/${bucket}/${key}`;

  return { key, url };
}

export async function storageGet(relKey: string): Promise<{ key: string; url: string }> {
  const key = relKey.replace(/^\/+/, "");
  const publicUrl = process.env.R2_PUBLIC_URL ?? "";
  const bucket = process.env.R2_BUCKET ?? "adneo-media";
  const accountId = process.env.R2_ACCOUNT_ID ?? "";

  const url = publicUrl
    ? `${publicUrl.replace(/\/+$/, "")}/${key}`
    : `https://${accountId}.r2.cloudflarestorage.com/${bucket}/${key}`;

  return { key, url };
}
