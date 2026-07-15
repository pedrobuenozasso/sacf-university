import { getCertificationOverview } from "@/lib/data";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { requireAdminScope } from "@/lib/admin-scope";
import { revokeCertificate, startRecertification } from "./actions";

export const dynamic = "force-dynamic";

export default async function AdminCertificationsPage() {
  const scope = await requireAdminScope();
  const organizationSlug = scope.isSacfAdmin ? undefined : scope.organizationSlug ?? undefined;
  const [overview, { dict, locale }] = await Promise.all([
    getCertificationOverview(organizationSlug),
    getDictionary()
  ]);
  const t = dict.admin.certificacoes;
  const formatDate = (isoDate: string) => new Intl.DateTimeFormat(locale, { dateStyle: "medium" }).format(new Date(isoDate));
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
          <span>{t.expired}</span>
        </div>
        <div className="metric">
          <strong>{overview.revoked}</strong>
          <span>{t.revoked}</span>
        </div>
      </section>

      <div className="tablePanel certificationsTable">
        <div className="tableHead">
          <span>{t.student}</span>
          <span>{t.course}</span>
          <span>{t.validity}</span>
          <span>{t.code}</span>
          <span>{t.status}</span>
        </div>
        {overview.records.map((record) => (
          <div className="tableRow" key={record.id}>
            <div className="certificateIdentity">
              <strong>{record.userName}</strong>
              <p>{record.organizationName}</p>
            </div>
            <span>{record.courseTitle}</span>
            <span>{record.expiresAt ? formatDate(record.expiresAt) : t.noExpiry}</span>
            <span>{record.code}</span>
            <div className="certificateControls">
              <span className="statusTag">{record.status === "valid" ? t.valid : record.status === "expiring" ? t.expiringStatus : record.status === "expired" ? t.expired : t.revoked}</span>
              {record.status !== "revoked" ? (
                <form className="courseRowActions" action={revokeCertificate}>
                  <input name="certificateId" type="hidden" value={record.id} />
                  <button className="tableAction tableActionDanger" type="submit">{t.revoke}</button>
                </form>
              ) : null}
              {record.status === "expired" ? (
                <form className="courseRowActions" action={startRecertification}>
                  <input name="certificateId" type="hidden" value={record.id} />
                  <button className="tableAction" type="submit">{t.recertify}</button>
                </form>
              ) : null}
            </div>
          </div>
        ))}
        {overview.records.length === 0 ? <div className="tableRow"><div><strong>{t.emptyTitle}</strong><p>{t.emptyBody}</p></div></div> : null}
      </div>
    </>
  );
}
