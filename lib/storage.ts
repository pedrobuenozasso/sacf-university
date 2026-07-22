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

export function isScopedStoragePath(value: string, organizationId: string, scope: "branding" | "avatar" | "course", courseId?: string, userId?: string) {
  const prefix = `gs://${bucketName}/organizations/${organizationId}/`;
  if (!value.startsWith(prefix)) return false;
  if (scope === "branding") return value.startsWith(`${prefix}branding/`);
  if (scope === "avatar") return Boolean(userId) && value.startsWith(`${prefix}users/${userId}/avatar/`);
  return Boolean(courseId) && value.startsWith(`${prefix}courses/${courseId}/`);
}

function objectNameFromStoragePath(storagePath: string) {
  const prefix = `gs://${bucketName}/`;
  if (!storagePath.startsWith(prefix)) return null;
  return storagePath.slice(prefix.length);
}

type UploadKind = "document" | "video" | "image";

const allowedTypes: Record<UploadKind, readonly string[]> = {
  document: ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"],
  image: ["image/jpeg", "image/png", "image/webp"],
  video: ["video/mp4", "video/webm", "video/quicktime"]
};

function hasExpectedSignature(kind: UploadKind, contentType: string, bytes: Buffer) {
  const starts = (...signature: number[]) => signature.every((byte, index) => bytes[index] === byte);
  if (kind === "image") {
    if (contentType === "image/jpeg") return starts(0xff, 0xd8, 0xff);
    if (contentType === "image/png") return starts(0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a);
    return bytes.subarray(0, 4).toString("ascii") === "RIFF" && bytes.subarray(8, 12).toString("ascii") === "WEBP";
  }
  if (kind === "document") {
    if (contentType === "application/pdf") return bytes.subarray(0, 5).toString("ascii") === "%PDF-";
    if (contentType === "application/msword") return starts(0xd0, 0xcf, 0x11, 0xe0, 0xa1, 0xb1, 0x1a, 0xe1);
    return starts(0x50, 0x4b, 0x03, 0x04);
  }
  if (contentType === "video/webm") return starts(0x1a, 0x45, 0xdf, 0xa3);
  return bytes.subarray(4, 8).toString("ascii") === "ftyp";
}

export async function verifyUploadedObject(storagePath: string, kind: UploadKind) {
  const objectName = objectNameFromStoragePath(storagePath);
  if (!objectName) return false;
  const file = getStorage().bucket(bucketName).file(objectName);
  const [metadata] = await file.getMetadata();
  const size = Number(metadata.size ?? 0);
  const contentType = String(metadata.contentType ?? "").toLowerCase().split(";")[0];
  const maxBytes = kind === "video" ? 500 * 1024 * 1024 : kind === "image" ? 8 * 1024 * 1024 : 25 * 1024 * 1024;
  if (!Number.isFinite(size) || size <= 0 || size > maxBytes || !allowedTypes[kind].includes(contentType)) {
    await file.delete({ ignoreNotFound: true });
    return false;
  }
  const [bytes] = await file.download({ start: 0, end: 31 });
  if (!hasExpectedSignature(kind, contentType, bytes)) {
    await file.delete({ ignoreNotFound: true });
    return false;
  }
  return true;
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
