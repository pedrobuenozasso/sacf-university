"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { requestPasswordReset } from "@/app/recuperar-senha/actions";
import { useLocale } from "@/components/locale-provider";

export function RequestPasswordResetForm() {
  const { dict } = useLocale();
  const t = dict.passwordReset;
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSubmitting(true);
    const result = await requestPasswordReset(email);
    setSubmitting(false);
    if (!result.ok) return setError(result.error);
    setSent(true);
  }

  if (sent) return <div className="formNotice"><strong>{t.sentTitle}</strong><p>{t.sentBody}</p><Link href="/login">{t.backToLogin}</Link></div>;

  return <form onSubmit={submit}>
    <label>{t.emailLabel}<input className="field" type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder={t.emailPlaceholder} autoComplete="email" required /></label>
    {error ? <p className="formError" role="alert">{error}</p> : null}
    <button className="button fullButton" type="submit" disabled={submitting}>{submitting ? t.sending : t.send}</button>
    <Link className="loginForgotPassword" href="/login">{t.backToLogin}</Link>
  </form>;
}
