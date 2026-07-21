import { notFound } from "next/navigation";
import { requireAdminScope } from "@/lib/admin-scope";
import { prisma } from "@/lib/db";
import { updateOrganizationBranding } from "./actions";

export const dynamic = "force-dynamic";

const locales = [
  ["pt-BR", "Português (Brasil)"], ["en", "English"], ["es", "Español"], ["de", "Deutsch"], ["fr", "Français"]
] as const;

export default async function OrganizationBrandingPage() {
  const scope = await requireAdminScope();
  if (!scope.organizationSlug) notFound();
  const organization = await prisma.organization.findUnique({ where: { slug: scope.organizationSlug }, select: { name: true, logoUrl: true, primaryColor: true, secondaryColor: true, defaultLocale: true, allowedLocales: true } });
  if (!organization) notFound();
  return <>
    <div className="sectionHead"><div><p className="eyebrow">Configuração da empresa</p><h1>Identidade do ambiente</h1><p>Defina a marca e os idiomas disponíveis para as pessoas da {organization.name}.</p></div></div>
    <section className="brandingLayout">
      <form className="detailPanel brandingForm" action={updateOrganizationBranding}>
        <div className="formStatus"><span className="statusDot" /><div><strong>Marca da empresa</strong><small>Aplicada no menu após o próximo login.</small></div></div>
        <h2>Personalização</h2>
        <label>URL da logo <small>Use uma URL HTTPS ou um arquivo enviado ao armazenamento da empresa.</small><input className="field" name="logoUrl" type="url" defaultValue={organization.logoUrl ?? ""} placeholder="https://empresa.com/logo.png" /></label>
        <div className="formGrid"><label>Cor principal<input className="field colorField" name="primaryColor" type="color" defaultValue={organization.primaryColor ?? "#00d1ff"} /></label><label>Cor de apoio<input className="field colorField" name="secondaryColor" type="color" defaultValue={organization.secondaryColor ?? "#6b5cff"} /></label></div>
        <label>Idioma padrão<select className="field" name="defaultLocale" defaultValue={organization.defaultLocale}>{locales.map(([code, label]) => <option key={code} value={code}>{label}</option>)}</select></label>
        <fieldset className="localeChecklist"><legend>Idiomas liberados para a empresa</legend>{locales.map(([code, label]) => <label className="checkItem" key={code}><input name="allowedLocales" type="checkbox" value={code} defaultChecked={organization.allowedLocales.includes(code)} />{label}</label>)}</fieldset>
        <div className="editorFormFooter"><button className="button" type="submit">Salvar identidade</button></div>
      </form>
      <aside className="detailPanel brandingPreview"><p className="eyebrow">Prévia</p><h2>{organization.name}</h2><div className="brandPreviewMark" style={{ background: organization.primaryColor ?? "#00d1ff" }}>{organization.logoUrl ? (
        // Logos use an organization-provided HTTPS or private storage URL.
        // eslint-disable-next-line @next/next/no-img-element
        <img src={organization.logoUrl} alt="Logo da empresa" />
      ) : <span>{organization.name.slice(0, 1)}</span>}</div><p className="formHint">A logo, cores e idiomas ficam restritos ao ambiente da empresa. A marca SACF continua presente na plataforma.</p></aside>
    </section>
  </>;
}
