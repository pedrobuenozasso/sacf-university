"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { requestSignup } from "./actions";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [step, setStep] = useState<"form" | "sent">("form");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSubmitting(true);

    const result = await requestSignup(email);

    setSubmitting(false);

    if (!result.ok) {
      setError(result.error);
      return;
    }

    setStep("sent");
  }

  return (
    <section className="loginShell">
      <div className="loginHero">
        <div>
          <p className="eyebrow">SACF University</p>
          <h1>Confirme seu email corporativo.</h1>
          <p className="lead">
            O domínio do seu email (ex.: @suaempresa.com) direciona seu acesso para o ambiente da
            empresa certa. Enviamos um link de confirmação — clique nele para criar sua senha.
          </p>
        </div>

        <div className="loginForm">
          <div className="formStatus">
            <span className="statusDot" />
            <div>
              <strong>Novo acesso</strong>
              <small>Verificação por email corporativo</small>
            </div>
          </div>

          {step === "form" ? (
            <>
              <h2>Cadastrar</h2>
              <form onSubmit={handleSubmit}>
                <label>
                  Email corporativo
                  <input
                    className="field"
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="nome@empresa.com"
                    type="email"
                    value={email}
                    required
                  />
                </label>
                {error ? <p className="formError">{error}</p> : null}
                <button className="button fullButton" type="submit" disabled={submitting}>
                  {submitting ? "Enviando..." : "Enviar link de confirmação"}
                </button>
              </form>
              <p>
                Já tem senha?{" "}
                <Link href="/login" className="loginInlineLink">
                  Entrar
                </Link>
                .
              </p>
            </>
          ) : (
            <>
              <h2>Verifique seu email</h2>
              <p className="lead">
                Se <strong>{email}</strong> for um email válido, enviamos um link de confirmação.
                Ele expira em 30 minutos.
              </p>
              <p>
                Não recebeu?{" "}
                <button
                  type="button"
                  className="loginInlineLink"
                  onClick={() => setStep("form")}
                >
                  Tentar outro email
                </button>
                .
              </p>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
