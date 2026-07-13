import { getCourses, getOrganizations } from "@/lib/data";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getAdminScope } from "@/lib/admin-scope";

export const dynamic = "force-dynamic";

export default async function AdminCertificationsPage() {
  const [allCourses, allOrganizations, { dict }, scope] = await Promise.all([
    getCourses(),
    getOrganizations(),
    getDictionary(),
    getAdminScope()
  ]);
  const t = dict.admin.certificacoes;
  const organizations = scope.isSacfAdmin
    ? allOrganizations
    : allOrganizations.filter((org) => org.slug === scope.organizationSlug);
  const courses = scope.isSacfAdmin
    ? allCourses
    : allCourses.filter(
        (course) =>
          course.organizationSlugs.length === 0 ||
          course.organizationSlugs.includes(scope.organizationSlug ?? "")
      );
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
          <strong>{organizations.reduce((sum, org) => sum + org.certificates, 0)}</strong>
          <span>{t.issued}</span>
        </div>
        <div className="metric">
          <strong>{organizations.reduce((sum, org) => sum + org.expiring, 0)}</strong>
          <span>{t.expiring}</span>
        </div>
        <div className="metric">
          <strong>4</strong>
          <span>{t.activeRules}</span>
        </div>
        <div className="metric">
          <strong>12m</strong>
          <span>{t.defaultValidity}</span>
        </div>
      </section>

      <div className="tablePanel">
        <div className="tableHead">
          <span>{t.course}</span>
          <span>{t.rule}</span>
          <span>{t.validity}</span>
          <span>{t.alerts}</span>
          <span>{t.status}</span>
        </div>
        {courses.map((course) => (
          <div className="tableRow" key={course.slug}>
            <div>
              <strong>{course.title}</strong>
              <p>{course.vertical}</p>
            </div>
            <span>{course.certificate}</span>
            <span>{course.certificate.includes("24") ? t.months24 : t.months12}</span>
            <span>{t.alertDays}</span>
            <span className="statusTag">{t.active}</span>
          </div>
        ))}
      </div>
    </>
  );
}
