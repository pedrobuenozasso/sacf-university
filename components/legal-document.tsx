import Link from "next/link";
import { getDictionary } from "@/lib/i18n/get-dictionary";

export async function LegalDocument({
  active,
  title,
  description,
  children
}: {
  active: "terms" | "privacy" | "lgpd";
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  const { dict } = await getDictionary();
  const t = dict.legal;

  return (
    <section className="legalPage">
      <header className="legalHero">
        <p className="eyebrow">SACF Academy · {t.legalDocuments}</p>
        <h1>{title}</h1>
        <p>{description}</p>
        <div className="legalMeta">
          <span>{t.updated}</span>
          <span>{t.officialVersion}</span>
        </div>
      </header>

      <nav className="legalTabs" aria-label={t.legalDocuments}>
        <Link aria-current={active === "terms" ? "page" : undefined} href="/termos">{t.terms}</Link>
        <Link aria-current={active === "privacy" ? "page" : undefined} href="/privacidade">{t.privacy}</Link>
        <Link aria-current={active === "lgpd" ? "page" : undefined} href="/lgpd">{t.lgpd}</Link>
      </nav>

      <article className="legalContent">{children}</article>

      <aside className="legalContact">
        <div>
          <p className="eyebrow">{t.privacyChannel}</p>
          <h2>privacy@sacf.io</h2>
          <p>{t.contactBody}</p>
        </div>
        <a className="buttonGhost" href="mailto:privacy@sacf.io">{t.contactAction}</a>
      </aside>
    </section>
  );
}
