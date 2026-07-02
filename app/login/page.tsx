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
  const [showCompanyPrompt, setShowCompanyPrompt] = useState(false);

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
            src="/brand/sacf-academy-symbol.png"
            alt="SACF Academy"
            width={360}
            height={360}
            priority
          />
          <p className="eyebrow">SACF Academy</p>
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
              <strong>Acesso SACF Academy</strong>
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
            Sua empresa ainda não tem acesso?{" "}
            <button
              type="button"
              className="loginInlineLink"
              onClick={() => setShowCompanyPrompt(true)}
            >
              Solicitar implantação
            </button>
            .
          </p>
          <div className="loginContractBox">
            <strong>Primeiro acesso de empresa</strong>
            <span>
              A SACF cria o ambiente corporativo e libera o administrador inicial para configurar
              usuários, cursos e trilhas.
            </span>
            <Link href="/cadastro">Quero contratar para minha empresa</Link>
          </div>
        </form>
      </div>

      {showCompanyPrompt ? (
        <div className="modalBackdrop" role="dialog" aria-modal="true" aria-labelledby="companyPromptTitle">
          <div className="companyPrompt">
            <button
              type="button"
              className="modalClose"
              onClick={() => setShowCompanyPrompt(false)}
              aria-label="Fechar"
            >
              x
            </button>
            <p className="eyebrow">SACF Academy</p>
            <h2 id="companyPromptTitle">Sua empresa quer contratar a plataforma?</h2>
            <p>
              Envie os dados da empresa para a equipe SACF iniciar a implantação, criar o ambiente
              privado e liberar o primeiro administrador.
            </p>
            <div className="productHeroActions">
              <Link className="button" href="/cadastro">
                Solicitar implantação
              </Link>
              <button
                type="button"
                className="buttonGhost"
                onClick={() => setShowCompanyPrompt(false)}
              >
                Continuar no login
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}
