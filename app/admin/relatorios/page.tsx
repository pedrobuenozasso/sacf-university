import { getOrganizations, getTrainingDeadlineOverview } from "@/lib/data";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { requireAdminScope } from "@/lib/admin-scope";

export const dynamic = "force-dynamic";

export default async function AdminReportsPage() {
  const scope = await requireAdminScope();
  const organizationSlug = scope.isSacfAdmin ? undefined : scope.organizationSlug ?? undefined;
  const [organizations, deadlines, { dict, locale }] = await Promise.all([
    getOrganizations(organizationSlug),
    getTrainingDeadlineOverview(organizationSlug),
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
          <span className="actionHint">{t.dataAvailable}</span>
        </div>
        <div className="detailPanel reportCard">
          <span className="reportStatus">{t.critical}</span>
          <h2>{t.certificatesTitle}</h2>
          <p>{t.certificatesBody}</p>
          <span className="actionHint">{t.dataAvailable}</span>
        </div>
        <div className="detailPanel reportCard">
          <span className="reportStatus">{t.operation}</span>
          <h2>{t.usageTitle}</h2>
          <p>{t.usageBody}</p>
          <span className="actionHint">{t.dataAvailable}</span>
        </div>
        <div className="detailPanel reportCard">
          <span className="reportStatus">{t.executive}</span>
          <h2>{t.execSummaryTitle}</h2>
          <p>{t.execSummaryBody}</p>
          <span className="actionHint">{t.executiveView}</span>
        </div>
      </section>

      <section className="metrics">
        <div className="metric"><strong>{deadlines.overdue}</strong><span>{t.overdueTrainings}</span></div>
        <div className="metric"><strong>{deadlines.dueSoon}</strong><span>{t.dueInSevenDays}</span></div>
        <div className="metric"><strong>{deadlines.records.length}</strong><span>{t.withDeadline}</span></div>
      </section>

      <div className="tablePanel deadlinesTable">
        <div className="tableHead"><span>{t.student}</span><span>{t.course}</span><span>{t.company}</span><span>{t.deadline}</span><span>{t.status}</span></div>
        {deadlines.records.map((record) => (
          <div className="tableRow" key={record.id}>
            <div><strong>{record.userName}</strong></div><span>{record.courseTitle}</span><span>{record.organizationName}</span>
            <span>{new Intl.DateTimeFormat(locale, { dateStyle: "medium" }).format(new Date(record.dueDate))}</span>
            <span className="statusTag">{record.status === "overdue" ? t.overdue : record.status === "due_soon" ? t.dueSoon : t.onTime}</span>
          </div>
        ))}
        {deadlines.records.length === 0 ? <div className="tableRow tableEmpty"><div><strong>{t.noDeadlines}</strong><p>{t.noDeadlinesBody}</p></div></div> : null}
      </div>

      <div className="sectionHead">
        <div>
          <h2>{t.monitoredCompanies}</h2>
        </div>
      </div>
      <div className="tablePanel companiesTable">
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
