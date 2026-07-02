"use client";

import Image from "next/image";
import Link from "next/link";
import { FormEvent, useState } from "react";
import { requestImplementation } from "./actions";

export default function SignupPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    employees: "",
    message: ""
  });
  const [step, setStep] = useState<"form" | "sent">("form");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  function updateField(field: keyof typeof form, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSubmitting(true);

    const result = await requestImplementation(form);

    setSubmitting(false);

    if (!result.ok) {
      setError(result.error);
      return;
    }

    setStep("sent");
  }

  return (
    <section className="loginShell">
      <div className="loginHero implementationHero">
        <div>
          <Image
            className="implementationBrand"
            src="/brand/sacf-academy-horizontal-onDark.png"
            alt="SACF Academy"
            width={420}
            height={237}
            priority
          />
          <p className="eyebrow">Implantação SACF Academy</p>
          <h1>Leve treinamento e certificação para dentro da sua empresa.</h1>
          <p className="lead">
            A SACF configura o ambiente inicial da empresa, cria o administrador responsável e apoia
            a primeira estrutura de cursos, usuários e trilhas obrigatórias.
          </p>
          <div className="implementationSteps">
            <article>
              <span>01</span>
              <strong>Solicitação</strong>
              <p>Você informa os dados da empresa e o tamanho aproximado da equipe.</p>
            </article>
            <article>
              <span>02</span>
              <strong>Implantação assistida</strong>
              <p>A equipe SACF cria o ambiente corporativo e o primeiro admin.</p>
            </article>
            <article>
              <span>03</span>
              <strong>Operação</strong>
              <p>O admin adiciona usuários, organiza grupos e gerencia cursos internos.</p>
            </article>
          </div>
        </div>

        <div className="loginForm">
          <div className="formStatus">
            <span className="statusDot" />
            <div>
              <strong>Solicitar implantação</strong>
              <small>Retorno da equipe SACF para configuração da empresa</small>
            </div>
          </div>

          {step === "form" ? (
            <>
              <h2>Dados da empresa</h2>
              <form onSubmit={handleSubmit}>
                <label>
                  Nome
                  <input
                    className="field"
                    onChange={(event) => updateField("name", event.target.value)}
                    placeholder="Seu nome"
                    type="text"
                    value={form.name}
                    required
                  />
                </label>
                <label>
                  Email corporativo
                  <input
                    className="field"
                    onChange={(event) => updateField("email", event.target.value)}
                    placeholder="nome@empresa.com"
                    type="email"
                    value={form.email}
                    required
                  />
                </label>
                <label>
                  Telefone
                  <input
                    className="field"
                    onChange={(event) => updateField("phone", event.target.value)}
                    placeholder="+55 (00) 00000-0000"
                    type="tel"
                    value={form.phone}
                    required
                  />
                </label>
                <label>
                  Nome da empresa
                  <input
                    className="field"
                    onChange={(event) => updateField("company", event.target.value)}
                    placeholder="Empresa"
                    type="text"
                    value={form.company}
                    required
                  />
                </label>
                <label>
                  Número de funcionários
                  <select
                    className="field"
                    onChange={(event) => updateField("employees", event.target.value)}
                    value={form.employees}
                    required
                  >
                    <option value="">Selecione</option>
                    <option value="1-25">1 a 25</option>
                    <option value="26-100">26 a 100</option>
                    <option value="101-500">101 a 500</option>
                    <option value="501-1000">501 a 1.000</option>
                    <option value="1000+">Mais de 1.000</option>
                  </select>
                </label>
                <label>
                  Observações
                  <textarea
                    className="field"
                    onChange={(event) => updateField("message", event.target.value)}
                    placeholder="Conte rapidamente quais equipes ou treinamentos precisam entrar primeiro."
                    value={form.message}
                  />
                </label>
                {error ? <p className="formError">{error}</p> : null}
                <button className="button fullButton" type="submit" disabled={submitting}>
                  {submitting ? "Enviando..." : "Solicitar implantação"}
                </button>
              </form>
              <p>
                Já tem acesso?{" "}
                <Link href="/login" className="loginInlineLink">
                  Entrar na plataforma
                </Link>
                .
              </p>
            </>
          ) : (
            <>
              <h2>Solicitação enviada</h2>
              <p className="lead">
                Recebemos o pedido de implantação da <strong>{form.company}</strong>. A equipe SACF
                vai avaliar o cenário, criar o ambiente da empresa e liberar o primeiro administrador.
              </p>
              <Link className="button fullButton" href="/login">
                Voltar para o login
              </Link>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
