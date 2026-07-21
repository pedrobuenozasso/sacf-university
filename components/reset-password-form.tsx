"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { resetPassword } from "@/app/redefinir-senha/actions";
import { useLocale } from "@/components/locale-provider";

export function ResetPasswordForm({ email, token }: { email: string; token: string }) {
  const { dict } = useLocale();
  const t = dict.passwordReset;
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [complete, setComplete] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (password !== confirmation) return setError(t.passwordMismatch);
    setError(null);
    setSubmitting(true);
    const result = await resetPassword(email, token, password);
    setSubmitting(false);
    if (!result.ok) return setError(result.error);
    setComplete(true);
  }

  if (complete) return <div className="formNotice"><strong>{t.completeTitle}</strong><p>{t.completeBody}</p><Link href="/login">{t.login}</Link></div>;
  if (!email || !token) return <p className="formError">{t.invalidLink}</p>;

  return <form onSubmit={submit}>
    <label>{t.emailLabel}<input className="field" type="email" value={email} disabled /></label>
    <label>{t.newPassword}<input className="field" type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder={t.passwordPlaceholder} autoComplete="new-password" minLength={8} required /></label>
    <label>{t.confirmPassword}<input className="field" type="password" value={confirmation} onChange={(event) => setConfirmation(event.target.value)} placeholder={t.confirmPlaceholder} autoComplete="new-password" minLength={8} required /></label>
    {error ? <p className="formError" role="alert">{error}</p> : null}
    <button className="button fullButton" type="submit" disabled={submitting}>{submitting ? t.saving : t.save}</button>
  </form>;
}
