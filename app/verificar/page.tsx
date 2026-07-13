import { VerifyPasswordForm } from "@/components/verify-password-form";
import { getDictionary } from "@/lib/i18n/get-dictionary";

export default async function VerifyPage({
  searchParams
}: {
  searchParams: Promise<{ token?: string; email?: string }>;
}) {
  const { token = "", email = "" } = await searchParams;
  const { dict } = await getDictionary();
  const t = dict.verify;

  return (
    <section className="loginShell">
      <div className="loginHero">
        <div>
          <p className="eyebrow">SACF Academy</p>
          <h1>{t.title}</h1>
          <p className="lead">{t.lead}</p>
        </div>

        <div className="loginForm">
          <div className="formStatus">
            <span className="statusDot" />
            <div>
              <strong>{t.statusTitle}</strong>
              <small>{t.statusSub}</small>
            </div>
          </div>
          <h2>{t.heading}</h2>
          <VerifyPasswordForm token={token} email={email} />
        </div>
      </div>
    </section>
  );
}
