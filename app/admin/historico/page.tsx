import { requireAdminScope } from "@/lib/admin-scope";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

const labels: Record<string, string> = {
  "user.invited": "Convite enviado",
  "user.imported": "Usuário importado",
  "user.updated": "Usuário atualizado",
  "user.groups_updated": "Grupos do usuário atualizados",
  "group.created": "Grupo criado",
  "course.created": "Curso criado",
  "course.updated": "Curso atualizado",
  "course.module_created": "Módulo criado",
  "course.lesson_created": "Aula criada",
  "organization.branding_updated": "Identidade atualizada"
};

export default async function AdminAuditPage() {
  const scope = await requireAdminScope();
  if (!scope.organizationSlug) return null;
  const organization = await prisma.organization.findUnique({ where: { slug: scope.organizationSlug }, select: { id: true } });
  if (!organization) return null;
  const events = await prisma.auditEvent.findMany({ where: { organizationId: organization.id }, include: { actorUser: { select: { name: true, email: true } } }, orderBy: { createdAt: "desc" }, take: 100 });
  return <>
    <div className="sectionHead"><div><p className="eyebrow">Governança do ambiente</p><h1>Histórico de alterações</h1><p>Acompanhe os últimos eventos administrativos desta empresa. Os dados de outras empresas não aparecem aqui.</p></div></div>
    <section className="tablePanel auditTable">
      <div className="tableHead"><span>Evento</span><span>Responsável</span><span>Detalhes</span><span>Data</span></div>
      {events.length ? events.map((event) => <div className="tableRow" key={event.id}>
        <strong>{labels[event.action] ?? event.action}</strong>
        <span>{event.actorUser?.name ?? event.actorUser?.email ?? "Sistema"}</span>
        <span className="auditMeta">{event.metadata ? Object.entries(event.metadata as Record<string, unknown>).filter(([key]) => !["groupIds"].includes(key)).map(([key, value]) => `${key}: ${String(value)}`).join(" · ") : "—"}</span>
        <time dateTime={event.createdAt.toISOString()}>{new Intl.DateTimeFormat("pt-BR", { dateStyle: "short", timeStyle: "short" }).format(event.createdAt)}</time>
      </div>) : <div className="emptyAudit"><strong>Nenhum evento registrado ainda.</strong><p>As próximas alterações em pessoas, cursos, grupos e identidade aparecerão aqui.</p></div>}
    </section>
  </>;
}
