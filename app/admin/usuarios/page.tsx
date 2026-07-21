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
            <span>Grupos</span>
          </div>
          {visibleUsers.map((user) => (
            <div className="tableRow" key={user.id ?? `${user.organizationSlug}-${user.email}`}>
              <div className="userIdentity">
                <strong>{user.name}</strong>
                <p>{user.email}</p>
              </div>
              {scope.isSacfAdmin ? <span>{user.organization}</span> : null}
              <span>{user.role}</span>
              <span className="statusTag">{user.status}</span>
              <span>{user.progress}%</span>
              <div className="userGroupsCell">
                <div className="groupChips">{user.groups?.length ? user.groups.map((group) => <span key={group.id}>{group.name}</span>) : <span className="emptyGroup">Sem grupo</span>}</div>
                {user.id ? <><details className="groupEditorDisclosure"><summary>Editar grupos</summary><form action={updateUserGroups}><input name="userId" type="hidden" value={user.id} /><div className="groupPicker">{groups.filter((group) => group.organizationSlug === user.organizationSlug).map((group) => <label key={group.id}><input name="groupIds" type="checkbox" value={group.id} defaultChecked={user.groups?.some((current) => current.id === group.id)} /> {group.name}</label>)}{groups.filter((group) => group.organizationSlug === user.organizationSlug).length === 0 ? <p className="formHint">Ainda não há grupos nesta empresa.</p> : null}</div><button className="buttonGhost" type="submit">Salvar grupos</button></form></details><details className="groupEditorDisclosure"><summary>Editar usuário</summary><form action={updateUser}><input name="userId" type="hidden" value={user.id} /><label>Nome<input className="field" name="name" defaultValue={user.name} required /></label><label>Papel<select className="field" name="role" defaultValue={user.role === "Admin da empresa" ? "org_admin" : user.role === "Instrutor" ? "instructor" : user.role === "Parceiro externo" ? "external_partner" : "student"}><option value="org_admin">Admin da empresa</option><option value="instructor">Instrutor</option><option value="student">Aluno</option><option value="external_partner">Parceiro externo</option></select></label><label>Status<select className="field" name="status" defaultValue={user.status === "Ativo" ? "active" : user.status === "Bloqueado" ? "blocked" : "invited"}><option value="active">Ativo</option><option value="blocked">Bloqueado</option><option value="invited">Convite pendente</option></select></label><button className="buttonGhost" type="submit">Salvar usuário</button></form></details></> : null}
              </div>
            </div>
          ))}
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
        <div><p className="eyebrow">Grupos de acesso</p><h2>Organize as pessoas por equipe, função ou operação.</h2><p>Os grupos podem ser usados para liberar cursos para várias pessoas de uma vez.</p></div>
        <div className="groupManagementGrid">
          <div className="groupDirectory">{groups.length ? groups.map((group) => <div className="groupDirectoryItem" key={group.id}><strong>{group.name}</strong><span>{group.memberCount} membro{group.memberCount === 1 ? "" : "s"}</span>{scope.isSacfAdmin ? <small>{group.organizationSlug}</small> : null}</div>) : <p className="formHint">Crie o primeiro grupo para começar a organizar a equipe.</p>}</div>
          <form className="createGroupForm" action={createGroup}><label>Nome do grupo<input className="field" name="name" placeholder="Ex.: Técnicos de campo" required /></label>{scope.isSacfAdmin ? <label>Empresa<select className="field" name="organizationSlug" defaultValue="" required><option value="" disabled>Selecione uma empresa</option>{organizations.map((organization) => <option key={organization.slug} value={organization.slug}>{organization.name}</option>)}</select></label> : null}<label>Descrição <span className="formHint">(opcional)</span><input className="field" name="description" placeholder="Ex.: equipe responsável pelas visitas técnicas" /></label><button className="button" type="submit">Criar grupo</button></form>
        </div>
      </section>
    </>
  );
}
