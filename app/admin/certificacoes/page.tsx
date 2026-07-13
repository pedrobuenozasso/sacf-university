import { getCertificationOverview } from "@/lib/data";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { requireAdminScope } from "@/lib/admin-scope";
import { revokeCertificate } from "./actions";

export const dynamic = "force-dynamic";

export default async function AdminCertificationsPage() {
  const scope = await requireAdminScope();
  const organizationSlug = scope.isSacfAdmin ? undefined : scope.organizationSlug ?? undefined;
  const [overview, { dict }] = await Promise.all([
    getCertificationOverview(organizationSlug),
    getDictionary()
  ]);
  const t = dict.admin.certificacoes;
  return (
    <>
      <div className="sectionHead">
        <div>
          <p className="eyebrow">{t.eyebrow}</p>
          <h1>{t.title}</h1>
          <p>{t.body}</p>
        </div>
      </div>

      <section className="metrics">
        <div className="metric">
          <strong>{overview.issued}</strong>
          <span>{t.issued}</span>
        </div>
        <div className="metric">
          <strong>{overview.expiring}</strong>
          <span>{t.expiring}</span>
        </div>
        <div className="metric">
          <strong>{overview.expired}</strong>
          <span>Vencidos</span>
        </div>
        <div className="metric">
          <strong>{overview.revoked}</strong>
          <span>Revogados</span>
        </div>
      </section>

      <div className="tablePanel">
        <div className="tableHead">
          <span>Aluno</span>
          <span>{t.course}</span>
          <span>{t.validity}</span>
          <span>Código</span>
          <span>{t.status}</span>
        </div>
        {overview.records.map((record) => (
          <div className="tableRow" key={record.id}>
            <div>
              <strong>{record.userName}</strong>
              <p>{record.organizationName}</p>
            </div>
            <span>{record.courseTitle}</span>
            <span>{record.expiresAt ? new Intl.DateTimeFormat("pt-BR", { dateStyle: "medium" }).format(new Date(record.expiresAt)) : "Sem vencimento"}</span>
            <span>{record.code}</span>
            <div>
              <span className="statusTag">{record.status === "valid" ? "Válido" : record.status === "expiring" ? "Vencendo" : record.status === "expired" ? "Vencido" : "Revogado"}</span>
              {record.status !== "revoked" ? (
                <form className="courseRowActions" action={revokeCertificate}>
                  <input name="certificateId" type="hidden" value={record.id} />
                  <button type="submit">Revogar</button>
                </form>
              ) : null}
            </div>
          </div>
        ))}
        {overview.records.length === 0 ? <div className="tableRow"><div><strong>Nenhum certificado emitido</strong><p>Os certificados emitidos aparecerão aqui.</p></div></div> : null}
      </div>
    </>
  );
}
