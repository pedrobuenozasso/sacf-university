import Link from "next/link";
import { getAdminUsers, getCertificationOverview, getDraftCourseCount, getOrganizations, getTrainingDeadlineOverview } from "@/lib/data";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { interpolate } from "@/lib/i18n/interpolate";
import { requireAdminScope } from "@/lib/admin-scope";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const scope = await requireAdminScope();
  const organizationSlug = scope.isSacfAdmin ? undefined : scope.organizationSlug ?? undefined;
  const [organizations, adminUsers, certifications, deadlines, { dict }] = await Promise.all([
    getOrganizations(organizationSlug),
    getAdminUsers(organizationSlug),
    getCertificationOverview(organizationSlug),
    getTrainingDeadlineOverview(organizationSlug),
    getDictionary(),
  ]);
  const t = dict.admin.overview;
  const draftCourses = await getDraftCourseCount(organizationSlug);

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
        <Link className="metric metricLink" href="/admin/empresas">
          <strong>{organizations.length}</strong>
          <span>{t.companies}</span>
        </Link>
        <Link className="metric metricLink" href="/admin/usuarios">
          <strong>{totalUsers}</strong>
          <span>{t.users}</span>
        </Link>
        <Link className="metric metricLink" href="/admin/cursos">
          <strong>{totalCourses}</strong>
          <span>{t.checklistCourses}</span>
        </Link>
        <Link className="metric metricLink" href="/admin/certificacoes">
          <strong>{totalCertificates}</strong>
          <span>{t.certificates}</span>
        </Link>
        <Link className="metric metricLink" href="/admin/relatorios">
          <strong>{deadlines.overdue}</strong>
          <span>Treinamentos atrasados</span>
        </Link>
        <Link className="metric metricLink" href="/admin/certificacoes">
          <strong>{certifications.expiring + certifications.expired}</strong>
          <span>Certificados em risco</span>
        </Link>
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
              <span>{interpolate(t.queueExpiring, { count: certifications.expiring + certifications.expired || expiring })}</span>
              <span>{t.high}</span>
            </div>
            <div className="checkItem">
              <span>{deadlines.overdue} treinamento(s) obrigatório(s) com prazo vencido</span>
              <Link className="buttonGhost" href="/admin/relatorios">Ver pendências</Link>
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

      <section className="split">
        <div className="detailPanel">
          <div className="sectionHead"><div><p className="eyebrow">Atenção imediata</p><h2>Prazos próximos</h2></div><Link className="buttonGhost" href="/admin/relatorios">Abrir acompanhamento</Link></div>
          <div className="moduleList">
            {deadlines.records.slice(0, 4).map((item) => <div className="moduleItem" key={item.id}><h3>{item.userName} · {item.courseTitle}</h3><p>{item.organizationName} · {item.status === "overdue" ? "Atrasado" : item.status === "due_soon" ? "Vence em breve" : "Agendado"}</p></div>)}
            {!deadlines.records.length ? <p className="formHint">Nenhum prazo pendente no momento.</p> : null}
          </div>
        </div>
        <div className="detailPanel">
          <div className="sectionHead"><div><p className="eyebrow">Certificação</p><h2>Risco de validade</h2></div><Link className="buttonGhost" href="/admin/certificacoes">Ver certificados</Link></div>
          <div className="checklist"><div className="checkItem"><span>Vencem nos próximos 30 dias</span><strong>{certifications.expiring}</strong></div><div className="checkItem"><span>Já vencidos</span><strong>{certifications.expired}</strong></div><div className="checkItem"><span>Revogados</span><strong>{certifications.revoked}</strong></div></div>
        </div>
      </section>
    </>
  );
}
