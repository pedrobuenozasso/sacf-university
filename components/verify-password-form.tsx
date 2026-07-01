"use client";

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { verifyAndSetPassword } from "@/app/verificar/actions";

export function VerifyPasswordForm({ token, email }: { token: string; email: string }) {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("As senhas não coincidem.");
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

    router.push("/home");
    router.refresh();
  }

  if (!token || !email) {
    return (
      <p className="formError">
        Link inválido. Solicite um novo cadastro em{" "}
        <a href="/cadastro">/cadastro</a>.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Email
        <input className="field" type="email" value={email} disabled />
      </label>
      <label>
        Criar senha
        <input
          className="field"
          onChange={(event) => setPassword(event.target.value)}
          placeholder="Mínimo 8 caracteres"
          type="password"
          value={password}
          required
          minLength={8}
        />
      </label>
      <label>
        Confirmar senha
        <input
          className="field"
          onChange={(event) => setConfirmPassword(event.target.value)}
          placeholder="Repita a senha"
          type="password"
          value={confirmPassword}
          required
          minLength={8}
        />
      </label>
      {error ? <p className="formError">{error}</p> : null}
      <button className="button fullButton" type="submit" disabled={submitting}>
        {submitting ? "Confirmando..." : "Confirmar e entrar"}
      </button>
    </form>
  );
}
