import { getOrganizations } from "@/lib/data";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { requireAdminScope } from "@/lib/admin-scope";
import { createOrganization } from "./actions";

export const dynamic = "force-dynamic";

export default async function AdminCompaniesPage() {
  const scope = await requireAdminScope();
  const organizationSlug = scope.isSacfAdmin ? undefined : scope.organizationSlug ?? undefined;
  const [visibleOrganizations, { dict }] = await Promise.all([
    getOrganizations(organizationSlug),
    getDictionary()
  ]);
  const t = dict.admin.empresas;
  return (
    <>
      <div className="sectionHead">
        <div>
          <p className="eyebrow">{t.eyebrow}</p>
          <h1>{t.title}</h1>
          <p>{t.body}</p>
        </div>
      </div>

      <section className={scope.isSacfAdmin ? "split" : undefined}>
        <div className="tablePanel companiesTable">
          <div className="tableHead">
            <span>{t.company}</span>
            <span>{t.status}</span>
            <span>{t.users}</span>
            <span>{t.courses}</span>
            <span>{t.expiring}</span>
          </div>
          {visibleOrganizations.map((org) => (
            <div className="tableRow" key={org.slug}>
              <div>
                <strong>{org.name}</strong>
                <p>{org.slug}</p>
              </div>
              <span className="statusTag">{org.status}</span>
              <span>{org.seatLimit ? `${org.users} / ${org.seatLimit}` : org.users}</span>
              <span>{org.courses}</span>
              <span>{org.expiring}</span>
            </div>
          ))}
        </div>

        {scope.isSacfAdmin ? (
          <form className="detailPanel" action={createOrganization}>
            <div className="formStatus">
              <span className="statusDot" />
              <div>
                <strong>{t.newEnvTitle}</strong>
                <small>{t.newEnvSub}</small>
              </div>
            </div>
            <h2>{t.addCompany}</h2>
            <label>Nome da empresa<input className="field" name="name" placeholder={t.namePlaceholder} required /></label>
            <label>Identificador da empresa<small>Usado internamente na URL e nas permissões.</small><input className="field" name="slug" placeholder={t.slugPlaceholder} /></label>
            <label>Email do administrador inicial<input className="field" name="adminEmail" type="email" placeholder={t.adminEmailPlaceholder} /></label>
            <label>Limite de usuários <small>Opcional. Deixe em branco para não limitar.</small><input className="field" name="seatLimit" type="number" min={1} step={1} placeholder={t.seatLimitPlaceholder} /></label>
            <button className="button" type="submit">
              {t.createCompany}
            </button>
            <p className="formHint">{t.hint}</p>
            <p className="formHint">{t.seatLimitHint}</p>
          </form>
        ) : null}
      </section>
    </>
  );
}
