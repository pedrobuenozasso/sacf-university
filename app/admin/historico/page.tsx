import { requireAdminScope } from "@/lib/admin-scope";
import { prisma } from "@/lib/db";
import { getDictionary } from "@/lib/i18n/get-dictionary";

export const dynamic = "force-dynamic";

export default async function AdminAuditPage() {
  const scope = await requireAdminScope();
  if (!scope.organizationSlug) return null;
  const organization = await prisma.organization.findUnique({ where: { slug: scope.organizationSlug }, select: { id: true } });
  if (!organization) return null;
  const [events, { dict, locale }] = await Promise.all([
    prisma.auditEvent.findMany({ where: { organizationId: organization.id }, include: { actorUser: { select: { name: true, email: true } } }, orderBy: { createdAt: "desc" }, take: 100 }),
    getDictionary()
  ]);
  const t = dict.admin.historico;
  const labels: Record<string, string> = {
    "user.invited": t.userInvited, "user.imported": t.userImported, "user.updated": t.userUpdated,
    "user.groups_updated": t.userGroupsUpdated, "group.created": t.groupCreated,
    "course.created": t.courseCreated, "course.updated": t.courseUpdated,
    "course.module_created": t.moduleCreated, "course.lesson_created": t.lessonCreated,
    "organization.branding_updated": t.brandingUpdated
  };
  return <>
    <div className="sectionHead"><div><p className="eyebrow">{t.eyebrow}</p><h1>{t.title}</h1><p>{t.body}</p></div></div>
    <section className="tablePanel auditTable">
      <div className="tableHead"><span>{t.event}</span><span>{t.actor}</span><span>{t.details}</span><span>{t.date}</span></div>
      {events.length ? events.map((event) => <div className="tableRow" key={event.id}>
        <strong>{labels[event.action] ?? event.action}</strong>
        <span>{event.actorUser?.name ?? event.actorUser?.email ?? t.system}</span>
        <span className="auditMeta">{event.metadata ? Object.entries(event.metadata as Record<string, unknown>).filter(([key]) => !["groupIds"].includes(key)).map(([key, value]) => `${key}: ${String(value)}`).join(" · ") : "—"}</span>
        <time dateTime={event.createdAt.toISOString()}>{new Intl.DateTimeFormat(locale, { dateStyle: "short", timeStyle: "short" }).format(event.createdAt)}</time>
      </div>) : <div className="emptyAudit"><strong>{t.emptyTitle}</strong><p>{t.emptyBody}</p></div>}
    </section>
  </>;
}
