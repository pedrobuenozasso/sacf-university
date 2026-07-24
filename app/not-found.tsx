import Link from "next/link";
import { getDictionary } from "@/lib/i18n/get-dictionary";

export default async function NotFoundPage() {
  const { dict } = await getDictionary();
  const t = dict.system;

  return (
    <section className="appStatePage">
      <div className="appStateCode" aria-hidden="true">404</div>
      <p className="eyebrow">{t.notFoundEyebrow}</p>
      <h1>{t.notFoundTitle}</h1>
      <p>{t.notFoundBody}</p>
      <Link className="button" href="/home">{t.backHome}</Link>
    </section>
  );
}
