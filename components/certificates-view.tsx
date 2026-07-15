"use client";

import { LoginRequiredPanel } from "@/components/access-panels";
import { useSessionUser } from "@/components/use-session-user";
import { useLocale, interpolate } from "@/components/locale-provider";
import type { UserCertificate } from "@/lib/certificates";

export function CertificatesView({ certificates }: { certificates: UserCertificate[] }) {
  const user = useSessionUser();
  const { dict, locale } = useLocale();
  const t = dict.certificatesView;
  const formatDate = (isoDate: string) => new Intl.DateTimeFormat(locale, { dateStyle: "medium" }).format(new Date(isoDate));
  const statusLabel = (status: UserCertificate["status"]) => status === "revoked" ? t.revoked : status === "expired" ? t.expired : t.valid;

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
            <h2>{t.emptyTitle}</h2>
            <p>{t.emptyBody}</p>
          </div>
        ) : null}
        {certificates.map((certificate) => (
          <div className="certificateCard" key={certificate.id}>
            <div>
              <p className="eyebrow">{certificate.organizationName} · {certificate.courseVertical}</p>
              <h3>{certificate.courseTitle}</h3>
              <p>{interpolate(t.issuedOn, { date: formatDate(certificate.issuedAt) })}</p>
            </div>
            <div className="certificateMeta">
              <div>
                <strong>{formatDate(certificate.issuedAt)}</strong>
                <span>{t.issue}</span>
              </div>
              <span className="statusTag">{statusLabel(certificate.status)}</span>
            </div>
            <div className="certificateFoot">
              <span>{interpolate(t.code, { code: certificate.code })}</span>
              <span>{certificate.expiresAt ? interpolate(t.validUntil, { date: formatDate(certificate.expiresAt) }) : t.noExpiry}</span>
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
