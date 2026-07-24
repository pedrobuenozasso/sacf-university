import { getAdminGroups, getAdminUsers, getOrganizations } from "@/lib/data";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { requireAdminScope } from "@/lib/admin-scope";
import { InviteUserForm } from "@/components/invite-user-form";
import { UserCsvImport } from "@/components/user-csv-import";
import { createGroup, updateUser, updateUserGroups } from "./actions";

export const dynamic = "force-dynamic";

export default async function AdminUsersPage() {
  const scope = await requireAdminScope();
  const organizationSlug = scope.isSacfAdmin ? undefined : scope.organizationSlug ?? undefined;
  const [visibleUsers, organizations, groups, { dict }] = await Promise.all([
    getAdminUsers(organizationSlug),
    getOrganizations(organizationSlug),
    getAdminGroups(organizationSlug),
    getDictionary(),
  ]);
  const t = dict.admin.usuarios;
  const roleLabel = (role: string) => role === "Admin da empresa" ? t.roleOrgAdmin : role === "Instrutor" ? t.roleInstructor : role === "Parceiro externo" ? t.rolePartner : role === "Aluno" ? t.roleStudent : role;
  const statusLabel = (status: string) => status === "Ativo" ? t.statusActive : status === "Bloqueado" ? t.statusBlocked : t.statusInvited;
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
        <div className="tablePanel usersTable" data-scope={scope.isSacfAdmin ? "sacf" : "organization"}>
          <div className="tableHead">
            <span>{t.user}</span>
            {scope.isSacfAdmin ? <span>{t.company}</span> : null}
            <span>{t.role}</span>
            <span>{t.status}</span>
            <span>{t.progress}</span>
            <span>{t.groups}</span>
          </div>
          {visibleUsers.map((user) => (
            <div className="tableRow" key={user.id ?? `${user.organizationSlug}-${user.email}`}>
              <div className="userIdentity" data-label={t.user}>
                <strong>{user.name}</strong>
                <p>{user.email}</p>
              </div>
              {scope.isSacfAdmin ? <span data-label={t.company}>{user.organization}</span> : null}
              <span data-label={t.role}>{roleLabel(user.role)}</span>
              <span className="statusTag" data-label={t.status}>{statusLabel(user.status)}</span>
              <span data-label={t.progress}>{user.progress}%</span>
              <div className="userGroupsCell" data-label={t.groups}>
                <div className="groupChips">{user.groups?.length ? user.groups.map((group) => <span key={group.id}>{group.name}</span>) : <span className="emptyGroup">{t.noGroup}</span>}</div>
                {user.id ? <><details className="groupEditorDisclosure"><summary>{t.editGroups}</summary><form action={updateUserGroups}><input name="userId" type="hidden" value={user.id} /><div className="groupPicker">{groups.filter((group) => group.organizationSlug === user.organizationSlug).map((group) => <label key={group.id}><input name="groupIds" type="checkbox" value={group.id} defaultChecked={user.groups?.some((current) => current.id === group.id)} /> {group.name}</label>)}{groups.filter((group) => group.organizationSlug === user.organizationSlug).length === 0 ? <p className="formHint">{t.noGroups}</p> : null}</div><button className="buttonGhost" type="submit">{t.saveGroups}</button></form></details><details className="groupEditorDisclosure"><summary>{t.editUser}</summary><form action={updateUser}><input name="userId" type="hidden" value={user.id} /><label>{t.name}<input className="field" name="name" defaultValue={user.name} required /></label><label>{t.role}<select className="field" name="role" defaultValue={user.role === "Admin da empresa" ? "org_admin" : user.role === "Instrutor" ? "instructor" : user.role === "Parceiro externo" ? "external_partner" : "student"}><option value="org_admin">{t.roleOrgAdmin}</option><option value="instructor">{t.roleInstructor}</option><option value="student">{t.roleStudent}</option><option value="external_partner">{t.rolePartner}</option></select></label><label>{t.status}<select className="field" name="status" defaultValue={user.status === "Ativo" ? "active" : user.status === "Bloqueado" ? "blocked" : "invited"}><option value="active">{t.statusActive}</option><option value="blocked">{t.statusBlocked}</option><option value="invited">{t.statusInvited}</option></select></label><button className="buttonGhost" type="submit">{t.saveUser}</button></form></details></> : null}
              </div>
            </div>
          ))}
          {visibleUsers.length === 0 ? <div className="tableEmpty"><strong>{t.emptyTitle}</strong><span>{t.emptyBody}</span></div> : null}
        </div>

        <div className="detailPanel inviteUsersPanel">
          <div className="formStatus">
            <span className="statusDot" />
            <div>
              <strong>{t.inviteTitle}</strong>
              <small>{t.inviteSub}</small>
            </div>
          </div>
          <h2>{t.inviteUser}</h2>
          <InviteUserForm organizations={organizations} showOrgSelect={scope.isSacfAdmin} />
          {!scope.isSacfAdmin ? <><div className="panelDivider" /><UserCsvImport /></> : null}
        </div>
      </section>

      <section className="detailPanel groupManagementPanel">
        <div><p className="eyebrow">{t.groupsEyebrow}</p><h2>{t.groupsTitle}</h2><p>{t.groupsBody}</p></div>
        <div className="groupManagementGrid">
          <div className="groupDirectory">{groups.length ? groups.map((group) => <div className="groupDirectoryItem" key={group.id}><strong>{group.name}</strong><span>{group.memberCount} {group.memberCount === 1 ? t.member : t.members}</span>{scope.isSacfAdmin ? <small>{group.organizationSlug}</small> : null}</div>) : <p className="formHint">{t.firstGroup}</p>}</div>
          <form className="createGroupForm" action={createGroup}><label>{t.groupName}<input className="field" name="name" placeholder={t.groupNamePlaceholder} required /></label>{scope.isSacfAdmin ? <label>{t.company}<select className="field" name="organizationSlug" defaultValue="" required><option value="" disabled>{t.selectCompany}</option>{organizations.map((organization) => <option key={organization.slug} value={organization.slug}>{organization.name}</option>)}</select></label> : null}<label>{t.description} <span className="formHint">({t.optional})</span><input className="field" name="description" placeholder={t.descriptionPlaceholder} /></label><button className="button" type="submit">{t.createGroup}</button></form>
        </div>
      </section>
    </>
  );
}
