"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useLocale } from "@/components/locale-provider";
import { requestImplementation } from "./actions";

export default function SignupPage() {
  const { dict } = useLocale();
  const t = dict.signup;
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
          <p className="eyebrow">{t.eyebrow}</p>
          <h1>{t.title}</h1>
          <p className="lead">{t.lead}</p>
          <div className="implementationSteps">
            <article>
              <span>01</span>
              <strong>{t.step1Title}</strong>
              <p>{t.step1Body}</p>
            </article>
            <article>
              <span>02</span>
              <strong>{t.step2Title}</strong>
              <p>{t.step2Body}</p>
            </article>
            <article>
              <span>03</span>
              <strong>{t.step3Title}</strong>
              <p>{t.step3Body}</p>
            </article>
          </div>
          <p className="implementationTrust">Implantação orientada pela equipe SACF. Sem necessidade de configuração técnica pela sua empresa.</p>
        </div>

        <div className="loginForm">
          <div className="formStatus">
            <span className="statusDot" />
            <div>
              <strong>{t.statusTitle}</strong>
              <small>{t.statusSub}</small>
            </div>
          </div>

          {step === "form" ? (
            <>
              <h2>{t.formTitle}</h2>
              <form onSubmit={handleSubmit}>
                <label>
                  {t.nameLabel}
                  <input
                    className="field"
                    onChange={(event) => updateField("name", event.target.value)}
                    placeholder={t.namePlaceholder}
                    type="text"
                    value={form.name}
                    required
                  />
                </label>
                <label>
                  {t.emailLabel}
                  <input
                    className="field"
                    onChange={(event) => updateField("email", event.target.value)}
                    placeholder={t.emailPlaceholder}
                    type="email"
                    value={form.email}
                    required
                  />
                </label>
                <label>
                  {t.phoneLabel}
                  <input
                    className="field"
                    onChange={(event) => updateField("phone", event.target.value)}
                    placeholder={t.phonePlaceholder}
                    type="tel"
                    value={form.phone}
                    required
                  />
                </label>
                <label>
                  {t.companyLabel}
                  <input
                    className="field"
                    onChange={(event) => updateField("company", event.target.value)}
                    placeholder={t.companyPlaceholder}
                    type="text"
                    value={form.company}
                    required
                  />
                </label>
                <label>
                  {t.employeesLabel}
                  <select
                    className="field"
                    onChange={(event) => updateField("employees", event.target.value)}
                    value={form.employees}
                    required
                  >
                    <option value="">{t.employeesSelect}</option>
                    <option value="1-25">{t.employees1}</option>
                    <option value="26-100">{t.employees2}</option>
                    <option value="101-500">{t.employees3}</option>
                    <option value="501-1000">{t.employees4}</option>
                    <option value="1000+">{t.employees5}</option>
                  </select>
                </label>
                <label>
                  {t.messageLabel}
                  <textarea
                    className="field"
                    onChange={(event) => updateField("message", event.target.value)}
                    placeholder={t.messagePlaceholder}
                    value={form.message}
                  />
                </label>
                {error ? <p className="formError">{error}</p> : null}
                <button className="button fullButton" type="submit" disabled={submitting}>
                  {submitting ? t.submitting : t.submit}
                </button>
              </form>
              <p>
                {t.haveAccess}{" "}
                <Link href="/login" className="loginInlineLink">
                  {t.login}
                </Link>
                .
              </p>
            </>
          ) : (
            <>
              <h2>{t.sentTitle}</h2>
              <p className="lead">
                {t.sentBody.split("{company}")[0]}
                <strong>{form.company}</strong>
                {t.sentBody.split("{company}")[1]}
              </p>
              <Link className="button fullButton" href="/login">
                {t.backToLogin}
              </Link>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
