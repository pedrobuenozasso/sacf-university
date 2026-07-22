"use client";

import { useRef, useState } from "react";
import { useLocale } from "@/components/locale-provider";
import { appPath } from "@/lib/app-path";

export function FileUpload({ courseId, inputName, kind, existingUrl, target = "course" }: { courseId?: string; inputName: string; kind: "document" | "video" | "image"; existingUrl?: string | null; target?: "course" | "organization_logo" | "profile_avatar" }) {
  const { dict } = useLocale();
  const t = dict.upload;
  const input = useRef<HTMLInputElement>(null);
  const [url, setUrl] = useState(existingUrl ?? "");
  const [message, setMessage] = useState("");
  const [uploading, setUploading] = useState(false);
  async function upload(file: File) {
    setUploading(true);
    setMessage(t.preparing);
    try {
      const response = await fetch(appPath("/api/admin/uploads"), { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ courseId, name: file.name, type: file.type, size: file.size, kind, target }) });
      const data = await response.json().catch(() => null);
      if (!response.ok || !data?.url || !data?.storagePath) return setMessage(t.rejected);
      const sent = await fetch(data.url, { method: "PUT", headers: { "content-type": file.type }, body: file });
      if (!sent.ok) return setMessage(t.failed);
      setUrl(data.storagePath);
      setMessage(t.completed);
    } catch {
      setMessage(t.failed);
    } finally {
      setUploading(false);
    }
  }
  const accept = kind === "video" ? "video/*" : kind === "image" ? "image/jpeg,image/png,image/webp" : ".pdf,.doc,.docx";
  const limit = kind === "video" ? t.videoLimit : kind === "image" ? "PNG, JPG ou WebP · até 8 MB." : t.documentLimit;
  return <div className="uploadDropzone"><input name={inputName} type="hidden" value={url} /><input accept={accept} className="srOnly" onChange={(event) => event.target.files?.[0] && upload(event.target.files[0])} ref={input} type="file" /><button className="buttonGhost" disabled={uploading} onClick={() => input.current?.click()} onDragOver={(event) => event.preventDefault()} onDrop={(event) => { event.preventDefault(); const file = event.dataTransfer.files[0]; if (file) upload(file); }} type="button">{uploading ? t.sending : t.choose}</button><p aria-live="polite" className="formHint">{limit} {message || (url ? t.linked : "")}</p></div>;
}
