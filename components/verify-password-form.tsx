"use client";

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { verifyAndSetPassword } from "@/app/verificar/actions";
import { useLocale } from "@/components/locale-provider";

export function VerifyPasswordForm({ token, email }: { token: string; email: string }) {
  const router = useRouter();
  const { dict } = useLocale();
  const t = dict.verify;
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError(t.passwordMismatch);
      return;
    }

    setSubmitting(true);
    const result = await verifyAndSetPassword(email, token, password);

    if (!result.ok) {
      setSubmitting(false);
      setError(result.error);
      return;
    }

    const signInResult = await signIn("credentials", { email, password, redirect: false });
    setSubmitting(false);

    if (signInResult?.error) {
      router.push("/login");
      return;
    }

    window.location.href = "/home";
  }

  if (!token || !email) {
    return <p className="formError">{t.invalidLink}</p>;
  }

  return (
    <form onSubmit={handleSubmit}>
      <label>
        {t.emailLabel}
        <input className="field" type="email" value={email} disabled />
      </label>
      <label>
        {t.passwordLabel}
        <input
          className="field"
          onChange={(event) => setPassword(event.target.value)}
          placeholder={t.passwordPlaceholder}
          type="password"
          value={password}
          required
          minLength={8}
        />
      </label>
      <label>
        {t.confirmLabel}
        <input
          className="field"
          onChange={(event) => setConfirmPassword(event.target.value)}
          placeholder={t.confirmPlaceholder}
          type="password"
          value={confirmPassword}
          required
          minLength={8}
        />
      </label>
      {error ? <p className="formError">{error}</p> : null}
      <button className="button fullButton" type="submit" disabled={submitting}>
        {submitting ? t.submitting : t.submit}
      </button>
    </form>
  );
}
