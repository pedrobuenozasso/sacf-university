import { RequestPasswordResetForm } from "@/components/request-password-reset-form";
import { getDictionary } from "@/lib/i18n/get-dictionary";

export default async function RecoverPasswordPage() {
  const { dict } = await getDictionary();
  const t = dict.passwordReset;
  return <section className="loginShell"><div className="loginHero"><div><p className="eyebrow">SACF Academy</p><h1>{t.requestTitle}</h1><p className="lead">{t.requestLead}</p></div><div className="loginForm"><div className="formStatus"><span className="statusDot" /><div><strong>{t.statusTitle}</strong><small>{t.statusSub}</small></div></div><h2>{t.requestHeading}</h2><RequestPasswordResetForm /></div></div></section>;
}
