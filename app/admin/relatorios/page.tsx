import { getOrganizations } from "@/lib/data";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { requireAdminScope } from "@/lib/admin-scope";

export const dynamic = "force-dynamic";

export default async function AdminReportsPage() {
  const scope = await requireAdminScope();
  const organizationSlug = scope.isSacfAdmin ? undefined : scope.organizationSlug ?? undefined;
  const [organizations, { dict }] = await Promise.all([
    getOrganizations(organizationSlug),
    getDictionary()
  ]);
  const t = dict.admin.relatorios;
  return (
    <>
      <div className="sectionHead">
        <div>
          <p className="eyebrow">{t.eyebrow}</p>
          <h1>{t.title}</h1>
          <p>{t.body}</p>
        </div>
      </div>

      <section className="grid">
        <div className="detailPanel reportCard">
          <span className="reportStatus">{t.weekly}</span>
          <h2>{t.progressTitle}</h2>
          <p>{t.progressBody}</p>
          <button className="buttonGhost" type="button">
            {t.exportCsv}
          </button>
        </div>
        <div className="detailPanel reportCard">
          <span className="reportStatus">{t.critical}</span>
          <h2>{t.certificatesTitle}</h2>
          <p>{t.certificatesBody}</p>
          <button className="buttonGhost" type="button">
            {t.exportCsv}
          </button>
        </div>
        <div className="detailPanel reportCard">
          <span className="reportStatus">{t.operation}</span>
          <h2>{t.usageTitle}</h2>
          <p>{t.usageBody}</p>
          <button className="buttonGhost" type="button">
            {t.exportCsv}
          </button>
        </div>
        <div className="detailPanel reportCard">
          <span className="reportStatus">{t.executive}</span>
          <h2>{t.execSummaryTitle}</h2>
          <p>{t.execSummaryBody}</p>
          <button className="buttonGhost" type="button">
            {t.generatePreview}
          </button>
        </div>
      </section>

      <div className="sectionHead">
        <div>
          <h2>{t.monitoredCompanies}</h2>
        </div>
      </div>
      <div className="tablePanel">
        <div className="tableHead">
          <span>{t.company}</span>
          <span>{t.status}</span>
          <span>{t.users}</span>
          <span>{t.certificates}</span>
          <span>{t.expiring}</span>
        </div>
        {organizations.map((org) => (
          <div className="tableRow" key={org.slug}>
            <div>
              <strong>{org.name}</strong>
              <p>{org.slug}</p>
            </div>
            <span>{org.status}</span>
            <span>{org.users}</span>
            <span>{org.certificates}</span>
            <span>{org.expiring}</span>
          </div>
        ))}
      </div>
    </>
  );
}
