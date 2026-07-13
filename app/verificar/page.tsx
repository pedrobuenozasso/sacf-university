import { VerifyPasswordForm } from "@/components/verify-password-form";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getCertificateForVerification } from "@/lib/certificates";

function formatDate(isoDate: string) {
  return new Intl.DateTimeFormat("pt-BR", { dateStyle: "long" }).format(new Date(isoDate));
}

function certificateStatusLabel(status: "valid" | "expired" | "revoked") {
  if (status === "revoked") return "Certificado revogado";
  if (status === "expired") return "Certificado vencido";
  return "Certificado válido";
}

export default async function VerifyPage({
  searchParams
}: {
  searchParams: Promise<{ token?: string; email?: string; codigo?: string }>;
}) {
  const { token = "", email = "", codigo = "" } = await searchParams;
  const { dict } = await getDictionary();
  const t = dict.verify;

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
          <h1>Verificar certificado</h1>
          <p className="lead">Confirme a autenticidade de uma certificação emitida pela SACF Academy.</p>
        </div>

        <div className="loginForm">
          <form className="formGrid" action="/verificar" method="get">
            <label htmlFor="codigo">Código do certificado</label>
            <input className="field" defaultValue={codigo} id="codigo" name="codigo" placeholder="SACF-2026-XXXXXXXXXX" required />
            <button className="button" type="submit">Verificar certificado</button>
          </form>

          {codigo && !certificate ? (
            <div className="formHint">Não encontramos um certificado válido com esse código.</div>
          ) : null}

          {certificate ? (
            <div className="detailPanel">
              <p className="eyebrow">{certificateStatusLabel(certificate.status)}</p>
              <h2>{certificate.courseTitle}</h2>
              <p>Emitido para {certificate.recipientName} pela organização {certificate.organizationName}.</p>
              <div className="certificateFoot">
                <span>Código: {certificate.code}</span>
                <span>Emissão: {formatDate(certificate.issuedAt)}</span>
                <span>{certificate.expiresAt ? `Validade: ${formatDate(certificate.expiresAt)}` : "Sem vencimento"}</span>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
