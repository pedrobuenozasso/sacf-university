import { Storage } from "@google-cloud/storage";

const bucketName = process.env.GCS_MEDIA_BUCKET ?? "sacf-university-media-cedar-context-456512-b9";

function getStorage() {
  // Hostinger's Docker API accepts only single-line environment values. The
  // production credential is therefore supplied as Base64; local/Vercel can
  // still use the raw JSON value when convenient.
  const credentials =
    process.env.GCS_SERVICE_ACCOUNT_JSON ??
    (process.env.GCS_SERVICE_ACCOUNT_JSON_BASE64
      ? Buffer.from(process.env.GCS_SERVICE_ACCOUNT_JSON_BASE64, "base64").toString("utf8")
      : undefined);
  return credentials ? new Storage({ credentials: JSON.parse(credentials) }) : new Storage();
}

export function isStoragePath(value: string) {
  return value.startsWith("gs://");
}

export async function createUploadUrl(objectName: string, contentType: string) {
  const file = getStorage().bucket(bucketName).file(objectName);
  const [url] = await file.getSignedUrl({ version: "v4", action: "write", expires: Date.now() + 10 * 60_000, contentType });
  return { url, storagePath: `gs://${bucketName}/${objectName}` };
}

export async function createDownloadUrl(storagePath: string) {
  const prefix = `gs://${bucketName}/`;
  if (!storagePath.startsWith(prefix)) return storagePath;
  const [url] = await getStorage().bucket(bucketName).file(storagePath.slice(prefix.length)).getSignedUrl({ version: "v4", action: "read", expires: Date.now() + 60 * 60_000 });
  return url;
}
