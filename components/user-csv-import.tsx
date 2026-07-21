"use client";

import { useRef, useState, useTransition } from "react";
import { importUsersFromCsv, type CsvUserRow } from "@/app/admin/usuarios/actions";

function parseCsv(text: string): CsvUserRow[] {
  const lines = text.replace(/^\uFEFF/, "").split(/\r?\n/).filter((line) => line.trim());
  if (lines.length < 2) return [];
  const delimiter = lines[0].includes(";") ? ";" : ",";
  const columns = lines[0].split(delimiter).map((value) => value.trim().toLowerCase().replace(/^"|"$/g, ""));
  const indexOf = (...names: string[]) => columns.findIndex((column) => names.includes(column));
  const nameIndex = indexOf("nome", "name");
  const emailIndex = indexOf("email", "e-mail");
  const roleIndex = indexOf("papel", "role", "função", "funcao");
  const groupIndex = indexOf("grupo", "group", "vertical", "equipe", "team");
  const jobTitleIndex = indexOf("cargo", "jobtitle", "job_title", "função", "funcao");
  if (nameIndex < 0 || emailIndex < 0) return [];
  return lines.slice(1).map((line) => {
    const values = line.split(delimiter).map((value) => value.trim().replace(/^"|"$/g, ""));
    return { name: values[nameIndex] ?? "", email: values[emailIndex] ?? "", role: roleIndex >= 0 ? values[roleIndex] : "student", group: groupIndex >= 0 ? values[groupIndex] : "", jobTitle: jobTitleIndex >= 0 ? values[jobTitleIndex] : "" };
  });
}

export function UserCsvImport() {
  const fileInput = useRef<HTMLInputElement>(null);
  const [rows, setRows] = useState<CsvUserRow[]>([]);
  const [message, setMessage] = useState("");
  const [pending, startTransition] = useTransition();
  function selectFile(file?: File) {
    if (!file) return;
    file.text().then((text) => {
      const parsed = parseCsv(text);
      setRows(parsed);
      setMessage(parsed.length ? `${parsed.length} linha${parsed.length === 1 ? "" : "s"} pronta${parsed.length === 1 ? "" : "s"} para revisão e convite.` : "Não foi possível ler o arquivo. A primeira linha deve conter nome e email.");
    }).catch(() => setMessage("Não foi possível ler o arquivo CSV."));
  }
  function importRows() {
    startTransition(async () => {
      const result = await importUsersFromCsv(rows);
      setMessage(result.ok ? `${result.message} ${result.created} novo${result.created === 1 ? "" : "s"} cadastro${result.created === 1 ? "" : "s"}; ${result.groupsCreated} grupo${result.groupsCreated === 1 ? "" : "s"} criado${result.groupsCreated === 1 ? "" : "s"}.` : result.message);
      if (result.ok) setRows([]);
    });
  }
  return <div className="csvImport">
    <div><strong>Importar usuários por CSV</strong><p>Colunas obrigatórias: <code>nome</code> e <code>email</code>. Opcionais: <code>papel</code>, <code>grupo</code> e <code>cargo</code>.</p></div>
    <input className="srOnly" ref={fileInput} type="file" accept=".csv,text/csv" onChange={(event) => selectFile(event.target.files?.[0])} />
    <div className="actions noTopMargin"><button className="buttonGhost" type="button" onClick={() => fileInput.current?.click()}>Selecionar CSV</button>{rows.length ? <button className="button" disabled={pending} type="button" onClick={importRows}>{pending ? "Enviando convites…" : `Importar ${rows.length} usuário${rows.length === 1 ? "" : "s"}`}</button> : null}</div>
    <p className="formHint" aria-live="polite">{message || "Cada pessoa recebe um convite seguro para criar a própria senha."}</p>
  </div>;
}
