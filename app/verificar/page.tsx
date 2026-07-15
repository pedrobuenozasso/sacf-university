import { VerifyPasswordForm } from "@/components/verify-password-form";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getCertificateForVerification } from "@/lib/certificates";
import { interpolate } from "@/lib/i18n/interpolate";

export default async function VerifyPage({
  searchParams
}: {
  searchParams: Promise<{ token?: string; email?: string; codigo?: string }>;
}) {
  const { token = "", email = "", codigo = "" } = await searchParams;
  const { dict, locale } = await getDictionary();
  const t = dict.verify;
  const verification = dict.certificateVerification;
  const formatDate = (isoDate: string) => new Intl.DateTimeFormat(locale, { dateStyle: "long" }).format(new Date(isoDate));
  const certificateStatusLabel = (status: "valid" | "expired" | "revoked") => status === "revoked" ? verification.revoked : status === "expired" ? verification.expired : verification.valid;

  // Keep the invitation password flow on the same stable URL.
  if (token && email) {
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

  const certificate = codigo ? await getCertificateForVerification(codigo) : null;

  return (
    <section className="loginShell verificationShell">
      <div className="loginHero">
        <div>
          <p className="eyebrow">SACF Academy</p>
          <h1>{verification.title}</h1>
          <p className="lead">{verification.lead}</p>
        </div>

        <div className="loginForm">
          <form className="formGrid" action="/verificar" method="get">
            <label htmlFor="codigo">{verification.codeLabel}</label>
            <input className="field" defaultValue={codigo} id="codigo" name="codigo" placeholder="SACF-2026-XXXXXXXXXX" required />
            <button className="button" type="submit">{verification.verify}</button>
          </form>

          {codigo && !certificate ? (
            <div className="formHint">{verification.notFound}</div>
          ) : null}

          {certificate ? (
            <div className="detailPanel">
              <p className="eyebrow">{certificateStatusLabel(certificate.status)}</p>
              <h2>{certificate.courseTitle}</h2>
              <p>{interpolate(verification.issuedFor, { name: certificate.recipientName, organization: certificate.organizationName })}</p>
              <div className="certificateFoot">
                <span>{interpolate(verification.code, { code: certificate.code })}</span>
                <span>{interpolate(verification.issueDate, { date: formatDate(certificate.issuedAt) })}</span>
                <span>{certificate.expiresAt ? interpolate(verification.validity, { date: formatDate(certificate.expiresAt) }) : verification.noExpiry}</span>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
