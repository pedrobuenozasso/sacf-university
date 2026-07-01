"use client";

import { signIn } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function loginWithEmail(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSubmitting(true);

    const result = await signIn("credentials", { email, password, redirect: false });

    setSubmitting(false);

    if (result?.error) {
      setError("Email ou senha incorretos.");
      return;
    }

    router.push("/home");
    router.refresh();
  }

  return (
    <section className="loginShell">
      <div className="loginHero">
        <div>
          <Image
            className="loginBrand"
            src="/brand/sacf-lockup-dark.jpg"
            alt="SACF"
            width={330}
            height={210}
            priority
          />
          <p className="eyebrow">SACF University</p>
          <h1>Acesse sua universidade corporativa.</h1>
          <p className="lead">
            Cada conta pertence a uma empresa, grupos e permissões. A plataforma direciona o usuário
            para cursos, certificados e relatórios conforme seu papel operacional.
          </p>
        </div>

        <form className="loginForm" onSubmit={loginWithEmail}>
          <div className="formStatus">
            <span className="statusDot" />
            <div>
              <strong>Acesso SACF University</strong>
              <small>Ambiente privado por organização</small>
            </div>
          </div>
          <h2>Entrar</h2>
          <label>
            Email
            <input
              className="field"
              onChange={(event) => setEmail(event.target.value)}
              placeholder="nome@empresa.com"
              type="email"
              value={email}
              required
            />
          </label>
          <label>
            Senha
            <input
              className="field"
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Senha"
              type="password"
              value={password}
              required
            />
          </label>
          {error ? <p className="formError">{error}</p> : null}
          <button className="button" type="submit" disabled={submitting}>
            {submitting ? "Entrando..." : "Entrar na plataforma"}
          </button>
          <p>
            Ainda não tem senha?{" "}
            <Link href="/cadastro" className="loginInlineLink">
              Confirme seu email corporativo
            </Link>
            .
          </p>
        </form>
      </div>
    </section>
  );
}
