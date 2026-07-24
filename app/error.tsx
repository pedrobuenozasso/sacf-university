"use client";

import Link from "next/link";
import { useLocale } from "@/components/locale-provider";

export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const { dict } = useLocale();
  const t = dict.system;

  return (
    <section className="appStatePage" role="alert">
      <div className="appStateIcon" aria-hidden="true">!</div>
      <p className="eyebrow">{t.errorEyebrow}</p>
      <h1>{t.errorTitle}</h1>
      <p>{t.errorBody}</p>
      <div className="actions">
        <button className="button" type="button" onClick={reset}>{t.retry}</button>
        <Link className="buttonGhost" href="/home">{t.backHome}</Link>
      </div>
    </section>
  );
}
