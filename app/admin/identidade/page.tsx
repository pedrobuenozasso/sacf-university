import { notFound } from "next/navigation";
import { requireAdminScope } from "@/lib/admin-scope";
import { prisma } from "@/lib/db";
import { mediaUrl } from "@/lib/media-url";
import { FileUpload } from "@/components/file-upload";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { updateOrganizationBranding } from "./actions";

export const dynamic = "force-dynamic";

const locales = [
  ["pt-BR", "Português (Brasil)"], ["en", "English"], ["es", "Español"], ["de", "Deutsch"], ["fr", "Français"]
] as const;

export default async function OrganizationBrandingPage() {
  const scope = await requireAdminScope();
  if (!scope.organizationSlug) notFound();
  const [organization, { dict }] = await Promise.all([
    prisma.organization.findUnique({ where: { slug: scope.organizationSlug }, select: { name: true, logoUrl: true, primaryColor: true, secondaryColor: true, defaultLocale: true, allowedLocales: true } }),
    getDictionary()
  ]);
  if (!organization) notFound();
  const t = dict.admin.identidade;
  return <>
    <div className="sectionHead"><div><p className="eyebrow">{t.eyebrow}</p><h1>{t.title}</h1><p>{t.body.replace("{company}", organization.name)}</p></div></div>
    <section className="brandingLayout">
      <form className="detailPanel brandingForm" action={updateOrganizationBranding}>
        <div className="formStatus"><span className="statusDot" /><div><strong>{t.brandTitle}</strong><small>{t.brandSub}</small></div></div>
        <h2>{t.customization}</h2>
        <label>{t.logoLabel} <small>{t.logoHint}</small><FileUpload inputName="logoUrl" kind="image" target="organization_logo" existingUrl={organization.logoUrl} /></label>
        <label>{t.logoUrlLabel} <small>{t.logoUrlHint}</small><input className="field" name="externalLogoUrl" type="url" defaultValue={organization.logoUrl?.startsWith("https://") ? organization.logoUrl : ""} placeholder="https://company.com/logo.png" /></label>
        <div className="formGrid"><label>{t.primaryColor}<input className="field colorField" name="primaryColor" type="color" defaultValue={organization.primaryColor ?? "#00d1ff"} /></label><label>{t.secondaryColor}<input className="field colorField" name="secondaryColor" type="color" defaultValue={organization.secondaryColor ?? "#6b5cff"} /></label></div>
        <label>{t.defaultLanguage}<select className="field" name="defaultLocale" defaultValue={organization.defaultLocale}>{locales.map(([code, label]) => <option key={code} value={code}>{label}</option>)}</select></label>
        <fieldset className="localeChecklist"><legend>{t.allowedLanguages}</legend>{locales.map(([code, label]) => <label className="checkItem" key={code}><input name="allowedLocales" type="checkbox" value={code} defaultChecked={organization.allowedLocales.includes(code)} />{label}</label>)}</fieldset>
        <div className="editorFormFooter"><button className="button" type="submit">{t.save}</button></div>
      </form>
      <aside className="detailPanel brandingPreview"><p className="eyebrow">{t.preview}</p><h2>{organization.name}</h2><div className="brandPreviewMark" style={{ background: organization.primaryColor ?? "#00d1ff" }}>{organization.logoUrl ? (
        // Logos use an organization-provided HTTPS or private storage URL.
        // eslint-disable-next-line @next/next/no-img-element
        <img src={mediaUrl(organization.logoUrl) ?? ""} alt={t.logoAlt} />
      ) : <span>{organization.name.slice(0, 1)}</span>}</div><p className="formHint">{t.previewHint}</p></aside>
    </section>
  </>;
}
