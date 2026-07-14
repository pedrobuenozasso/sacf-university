"use client";

import { useRef, useState } from "react";

export function FileUpload({ courseId, inputName, kind, existingUrl }: { courseId: string; inputName: string; kind: "document" | "video"; existingUrl?: string | null }) {
  const input = useRef<HTMLInputElement>(null);
  const [url, setUrl] = useState(existingUrl ?? "");
  const [message, setMessage] = useState("");
  const [uploading, setUploading] = useState(false);
  async function upload(file: File) {
    setUploading(true);
    setMessage("Preparando envio...");
    const response = await fetch("/api/admin/uploads", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ courseId, name: file.name, type: file.type, size: file.size, kind }) });
    const data = await response.json();
    if (!response.ok) { setUploading(false); return setMessage("Arquivo não aceito. Verifique o tipo e o limite de tamanho."); }
    const sent = await fetch(data.url, { method: "PUT", headers: { "content-type": file.type }, body: file });
    if (!sent.ok) { setUploading(false); return setMessage("Não foi possível enviar o arquivo. Tente novamente."); }
    setUrl(data.storagePath); setMessage("Arquivo enviado com segurança."); setUploading(false);
  }
  return <div className="uploadDropzone"><input name={inputName} type="hidden" value={url} /><input accept={kind === "video" ? "video/*" : ".pdf,.doc,.docx"} className="srOnly" onChange={(event) => event.target.files?.[0] && upload(event.target.files[0])} ref={input} type="file" /><button className="buttonGhost" disabled={uploading} onClick={() => input.current?.click()} onDragOver={(event) => event.preventDefault()} onDrop={(event) => { event.preventDefault(); const file = event.dataTransfer.files[0]; if (file) upload(file); }} type="button">{uploading ? "Enviando arquivo..." : "Arraste um arquivo aqui ou escolha no computador"}</button><p aria-live="polite" className="formHint">{kind === "video" ? "Vídeo até 500 MB." : "PDF, DOC ou DOCX até 25 MB."} {message || (url ? "Material vinculado à aula." : "")}</p></div>;
}
