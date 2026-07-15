"use client";

import { signIn, useSession } from "next-auth/react";
import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useLocale } from "@/components/locale-provider";
import { appPath } from "@/lib/app-path";

export default function LoginPage() {
  const router = useRouter();
  const { status } = useSession();
  const { dict } = useLocale();
  const t = dict.login;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [demoLoading, setDemoLoading] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const demoLoginEnabled = process.env.NODE_ENV !== "production" && process.env.NEXT_PUBLIC_DEMO_LOGIN_ENABLED === "true";

  useEffect(() => {
    if (status === "authenticated") router.replace("/home");
  }, [router, status]);

  if (status === "authenticated") return null;

  async function loginWithEmail(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSubmitting(true);

    const result = await signIn("credentials", { email, password, redirect: false });

    setSubmitting(false);

    if (result?.error) {
      setError(t.error);
      return;
    }

    window.location.href = appPath("/home");
  }

  async function loginAsDemo(role: "sacf_admin" | "org_admin" | "student") {
    setDemoLoading(role);
    const result = await signIn("demo", { role, redirect: false });
    if (result?.error) {
      setDemoLoading(null);
      setError(t.error);
      return;
    }
    window.location.href = appPath("/home");
  }

  return (
    <section className="loginShell">
      <div className="loginHero">
        <div>
          <p className="eyebrow">SACF Academy</p>
          <h1>{t.title}</h1>
          <p className="lead">{t.lead}</p>
          <p className="loginTrust">{t.trust}</p>
        </div>

        <form className="loginForm" onSubmit={loginWithEmail}>
          <div className="formStatus">
            <span className="statusDot" />
            <div>
              <strong>{t.statusTitle}</strong>
              <small>{t.statusSub}</small>
            </div>
          </div>
          <h2>{t.heading}</h2>
          <label>
            {t.emailLabel}
            <input
              className="field"
              onChange={(event) => setEmail(event.target.value)}
              placeholder={t.emailPlaceholder}
              type="email"
              autoComplete="email"
              value={email}
              required
            />
          </label>
          <label>
            {t.passwordLabel}
            <div className="passwordFieldWrap">
              <input
                className="field"
                onChange={(event) => setPassword(event.target.value)}
                placeholder={t.passwordPlaceholder}
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                value={password}
                required
              />
              <button
                type="button"
                className="passwordToggle"
                data-visible={showPassword}
                onClick={() => setShowPassword((value) => !value)}
                aria-label={showPassword ? t.hidePassword : t.showPassword}
                aria-pressed={showPassword}
              >
                <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path
                    className="passwordToggleLid"
                    d="M2 12C2 12 5.5 5.5 12 5.5C18.5 5.5 22 12 22 12"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                  />
                  <path
                    d="M2 12C2 12 5.5 18.5 12 18.5C18.5 18.5 22 12 22 12"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                  />
                  <circle className="passwordTogglePupil" cx="12" cy="12" r="3.2" fill="currentColor" />
                  <line
                    className="passwordToggleSlash"
                    x1="4"
                    y1="4"
                    x2="20"
                    y2="20"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            </div>
          </label>
          {error ? <p className="formError" role="alert" aria-live="polite">{error}</p> : null}
          <button className="button" type="submit" disabled={submitting}>
            {submitting ? t.submitting : t.submit}
          </button>
          <div className="loginContractBox">
            <strong>{t.contractTitle}</strong>
            <span>{t.contractBody}</span>
            <Link href="/cadastro">{t.contractLink}</Link>
          </div>

          {demoLoginEnabled ? (
            <div className="loginDemoBox">
              <small>{t.demoLabel}</small>
              <div className="loginDemoActions">
                <button
                  type="button"
                  className="buttonGhost"
                  disabled={demoLoading !== null}
                  onClick={() => loginAsDemo("sacf_admin")}
                >
                  {demoLoading === "sacf_admin" ? "..." : t.demoSacfAdmin}
                </button>
                <button
                  type="button"
                  className="buttonGhost"
                  disabled={demoLoading !== null}
                  onClick={() => loginAsDemo("org_admin")}
                >
                  {demoLoading === "org_admin" ? "..." : t.demoOrgAdmin}
                </button>
                <button
                  type="button"
                  className="buttonGhost"
                  disabled={demoLoading !== null}
                  onClick={() => loginAsDemo("student")}
                >
                  {demoLoading === "student" ? "..." : t.demoStudent}
                </button>
              </div>
            </div>
          ) : null}
        </form>
      </div>
    </section>
  );
}
