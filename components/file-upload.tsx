"use client";

import { useRef, useState } from "react";

export function FileUpload({ courseId, inputName, kind, existingUrl }: { courseId: string; inputName: string; kind: "document" | "video"; existingUrl?: string | null }) {
  const input = useRef<HTMLInputElement>(null);
  const [url, setUrl] = useState(existingUrl ?? "");
  const [message, setMessage] = useState("");
  async function upload(file: File) {
    setMessage("Preparando envio...");
    const response = await fetch("/api/admin/uploads", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ courseId, name: file.name, type: file.type, size: file.size, kind }) });
    const data = await response.json();
    if (!response.ok) return setMessage("Arquivo não aceito. Verifique o tipo e o limite de tamanho.");
    const sent = await fetch(data.url, { method: "PUT", headers: { "content-type": file.type }, body: file });
    if (!sent.ok) return setMessage("Não foi possível enviar o arquivo. Tente novamente.");
    setUrl(data.storagePath); setMessage("Arquivo enviado com segurança.");
  }
  return <div className="detailPanel"><input name={inputName} type="hidden" value={url} /><input accept={kind === "video" ? "video/*" : ".pdf,.doc,.docx"} className="srOnly" onChange={(event) => event.target.files?.[0] && upload(event.target.files[0])} ref={input} type="file" /><button className="buttonGhost" onClick={() => input.current?.click()} onDragOver={(event) => event.preventDefault()} onDrop={(event) => { event.preventDefault(); const file = event.dataTransfer.files[0]; if (file) upload(file); }} type="button">Arraste um arquivo aqui ou escolha no computador</button><p className="formHint">{kind === "video" ? "Vídeo até 500 MB." : "PDF, DOC ou DOCX até 25 MB."} {message || (url ? "Material vinculado à aula." : "")}</p></div>;
}
