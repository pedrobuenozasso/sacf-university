import Link from "next/link";
import { getAdminUsers, getDraftCourseCount, getOrganizations } from "@/lib/data";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { interpolate } from "@/lib/i18n/interpolate";
import { getAdminScope } from "@/lib/admin-scope";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const [allOrganizations, allAdminUsers, { dict }, scope] = await Promise.all([
    getOrganizations(),
    getAdminUsers(),
    getDictionary(),
    getAdminScope()
  ]);
  const t = dict.admin.overview;
  const organizations = scope.isSacfAdmin
    ? allOrganizations
    : allOrganizations.filter((org) => org.slug === scope.organizationSlug);
  const adminUsers = scope.isSacfAdmin
    ? allAdminUsers
    : allAdminUsers.filter((user) => user.organizationSlug === scope.organizationSlug);
  const draftCourses = await getDraftCourseCount(scope.isSacfAdmin ? undefined : scope.organizationSlug ?? undefined);

  const totalUsers = organizations.reduce((sum, org) => sum + org.users, 0);
  const totalCourses = organizations.reduce((sum, org) => sum + org.courses, 0);
  const totalCertificates = organizations.reduce((sum, org) => sum + org.certificates, 0);
  const expiring = organizations.reduce((sum, org) => sum + org.expiring, 0);
  const pendingInvites = adminUsers.filter((user) => user.status === "Pendente").length;

  const primaryOrgName = organizations[0]?.name ?? scope.organizationSlug ?? "";
  const ctaLabel = scope.isSacfAdmin
    ? t.ctaSetupCompany
    : interpolate(t.ctaContinueImplementation, { org: primaryOrgName });
  const ctaHref = scope.isSacfAdmin ? "/admin/empresas" : "/admin/usuarios";

  const checklist = [
    {
      label: t.checklistCompany,
      done: organizations.length > 0,
      detail: scope.isSacfAdmin ? `${organizations.length}` : primaryOrgName
    },
    {
      label: t.checklistAdmin,
      done: true,
      detail: null
    },
    {
      label: t.checklistTeam,
      done: totalUsers > 0,
      detail: interpolate(t.checklistTeamCount, { count: totalUsers })
    },
    {
      label: t.checklistCourses,
      done: totalCourses > 0,
      detail: interpolate(t.checklistCoursesCount, { count: totalCourses })
    },
    {
      label: t.checklistCerts,
      done: totalCertificates > 0,
      detail: interpolate(t.checklistCertsCount, { count: totalCertificates })
    }
  ];

  return (
    <>
      <div className="sectionHead">
        <div>
          <p className="eyebrow">{t.eyebrow}</p>
          <h1>{t.title}</h1>
          <p>{t.body}</p>
        </div>
        <Link className="button" href={ctaHref}>
          {ctaLabel}
        </Link>
      </div>

      <section className="metrics">
        <div className="metric">
          <strong>{organizations.length}</strong>
          <span>{t.companies}</span>
        </div>
        <div className="metric">
          <strong>{totalUsers}</strong>
          <span>{t.users}</span>
        </div>
        <div className="metric">
          <strong>{totalCourses}</strong>
          <span>{t.checklistCourses}</span>
        </div>
        <div className="metric">
          <strong>{totalCertificates}</strong>
          <span>{t.certificates}</span>
        </div>
      </section>

      <section className="detailPanel">
        <div className="sectionHead">
          <div>
            <p className="eyebrow">{t.checklistEyebrow}</p>
            <h2>{t.checklistTitle}</h2>
          </div>
        </div>
        <div className="checklist">
          {checklist.map((item) => (
            <div className="checkItem" key={item.label}>
              <span>
                {item.label}
                {item.detail ? ` · ${item.detail}` : ""}
              </span>
              <span className="statusTag" data-done={item.done}>
                {item.done ? t.statusDone : t.statusPending}
              </span>
            </div>
          ))}
        </div>
      </section>

      <section className="split">
        <div className="detailPanel">
          <div className="sectionHead">
            <div>
              <p className="eyebrow">{t.queueEyebrow}</p>
              <h2>{t.queueTitle}</h2>
            </div>
          </div>
          <div className="checklist">
            <div className="checkItem">
              <span>{interpolate(t.queueExpiring, { count: expiring })}</span>
              <span>{t.high}</span>
            </div>
            <div className="checkItem">
              <span>{interpolate(t.queueInvites, { count: pendingInvites })}</span>
              <span>{t.medium}</span>
            </div>
            <div className="checkItem">
              <span>{interpolate(t.queueDraftCourses, { count: draftCourses })}</span>
              <span>{t.medium}</span>
            </div>
            <div className="checkItem">
              <span>{t.queueReport}</span>
              <span>{t.low}</span>
            </div>
          </div>
        </div>

        <div className="detailPanel">
          <p className="eyebrow">{t.recentUsers}</p>
          <div className="moduleList">
            {adminUsers.slice(0, 4).map((user) => (
              <div className="moduleItem" key={user.email}>
                <h3>{user.name}</h3>
                <p>
                  {user.organization} · {user.role} · {user.status}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
