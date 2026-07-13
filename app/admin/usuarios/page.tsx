import { getAdminUsers, getOrganizations } from "@/lib/data";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { requireAdminScope } from "@/lib/admin-scope";
import { InviteUserForm } from "@/components/invite-user-form";

export const dynamic = "force-dynamic";

export default async function AdminUsersPage() {
  const scope = await requireAdminScope();
  const organizationSlug = scope.isSacfAdmin ? undefined : scope.organizationSlug ?? undefined;
  const [visibleUsers, organizations, { dict }] = await Promise.all([
    getAdminUsers(organizationSlug),
    getOrganizations(organizationSlug),
    getDictionary(),
  ]);
  const t = dict.admin.usuarios;
  return (
    <>
      <div className="sectionHead">
        <div>
          <p className="eyebrow">{t.eyebrow}</p>
          <h1>{t.title}</h1>
          <p>{t.body}</p>
        </div>
      </div>

      <section className="split">
        <div className="tablePanel">
          <div className="tableHead">
            <span>{t.user}</span>
            <span>{t.company}</span>
            <span>{t.role}</span>
            <span>{t.status}</span>
            <span>{t.progress}</span>
          </div>
          {visibleUsers.map((user) => (
            <div className="tableRow" key={user.email}>
              <div>
                <strong>{user.name}</strong>
                <p>{user.email}</p>
              </div>
              <span>{user.organization}</span>
              <span>{user.role}</span>
              <span className="statusTag">{user.status}</span>
              <span>{user.progress}%</span>
            </div>
          ))}
        </div>

        <div className="detailPanel">
          <div className="formStatus">
            <span className="statusDot" />
            <div>
              <strong>{t.inviteTitle}</strong>
              <small>{t.inviteSub}</small>
            </div>
          </div>
          <h2>{t.inviteUser}</h2>
          <InviteUserForm organizations={organizations} showOrgSelect={scope.isSacfAdmin} />
        </div>
      </section>
    </>
  );
}
