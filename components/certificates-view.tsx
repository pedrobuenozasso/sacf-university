"use client";

import { LoginRequiredPanel } from "@/components/access-panels";
import { useSessionUser } from "@/components/use-session-user";
import { useLocale, interpolate } from "@/components/locale-provider";
import type { UserCertificate } from "@/lib/certificates";

function formatDate(isoDate: string) {
  return new Intl.DateTimeFormat("pt-BR", { dateStyle: "medium" }).format(new Date(isoDate));
}

function statusLabel(status: UserCertificate["status"]) {
  if (status === "revoked") return "Revogado";
  if (status === "expired") return "Vencido";
  return "Válido";
}

export function CertificatesView({ certificates }: { certificates: UserCertificate[] }) {
  const user = useSessionUser();
  const { dict } = useLocale();
  const t = dict.certificatesView;

  if (!user) {
    return <LoginRequiredPanel title={t.loginTitle} />;
  }

  return (
    <>
      <section className="sectionHead">
        <div>
          <p className="eyebrow">{t.eyebrow}</p>
          <h1>{t.title}</h1>
          <p>{t.body}</p>
        </div>
      </section>

      <section className="certificateList">
        {certificates.length === 0 ? (
          <div className="detailPanel">
            <h2>Nenhum certificado emitido ainda.</h2>
            <p>Quando você concluir um curso com certificação habilitada, ele aparecerá aqui.</p>
          </div>
        ) : null}
        {certificates.map((certificate) => (
          <div className="certificateCard" key={certificate.id}>
            <div>
              <p className="eyebrow">{certificate.organizationName} · {certificate.courseVertical}</p>
              <h3>{certificate.courseTitle}</h3>
              <p>Emitido em {formatDate(certificate.issuedAt)}</p>
            </div>
            <div className="certificateMeta">
              <div>
                <strong>{formatDate(certificate.issuedAt)}</strong>
                <span>emissão</span>
              </div>
              <span className="statusTag">{statusLabel(certificate.status)}</span>
            </div>
            <div className="certificateFoot">
              <span>{interpolate(t.code, { code: certificate.code })}</span>
              <span>{certificate.expiresAt ? `Válido até ${formatDate(certificate.expiresAt)}` : "Sem vencimento"}</span>
            </div>
            <div className="certificateActions">
              <span className="buttonGhost">{t.view} disponível após a validação pública</span>
            </div>
          </div>
        ))}
      </section>
    </>
  );
}
