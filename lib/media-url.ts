import { appPath } from "@/lib/app-path";

/** Private GCS files are served through the authenticated media endpoint. */
export function mediaUrl(value: string | null | undefined) {
  if (!value) return null;
  return value.startsWith("gs://") ? `${appPath("/api/media")}?path=${encodeURIComponent(value)}` : value;
}
