import { ResetPasswordForm } from "@/components/reset-password-form";
import { getDictionary } from "@/lib/i18n/get-dictionary";

export default async function ResetPasswordPage({ searchParams }: { searchParams: Promise<{ token?: string; email?: string }> }) {
  const { token = "", email = "" } = await searchParams;
  const { dict } = await getDictionary();
  const t = dict.passwordReset;
  return <section className="loginShell"><div className="loginHero"><div><p className="eyebrow">SACF Academy</p><h1>{t.resetTitle}</h1><p className="lead">{t.resetLead}</p></div><div className="loginForm"><div className="formStatus"><span className="statusDot" /><div><strong>{t.statusTitle}</strong><small>{t.statusSub}</small></div></div><h2>{t.resetHeading}</h2><ResetPasswordForm email={email} token={token} /></div></div></section>;
}
