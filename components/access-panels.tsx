"use client";

import Link from "next/link";
import { useSessionUser } from "@/components/use-session-user";
import { useLocale } from "@/components/locale-provider";

export function LoginRequiredPanel({
  title,
  description
}: {
  title?: string;
  description?: string;
}) {
  const { dict } = useLocale();
  const t = dict.accessPanels;
  return (
    <section className="authGate">
      <p className="eyebrow">{t.privateEyebrow}</p>
      <h1>{title ?? t.defaultTitle}</h1>
      <p className="lead">{description ?? t.defaultDescription}</p>
      <Link className="button" href="/login">
        {t.login}
      </Link>
    </section>
  );
}

export function AdminGuard({ children }: { children: React.ReactNode }) {
  const user = useSessionUser();
  const { dict } = useLocale();
  const t = dict.accessPanels;
  const canManage =
    user?.role === "sacf_admin" || user?.role === "org_admin" || user?.role === "instructor";

  if (!user) {
    return <LoginRequiredPanel title={t.adminTitle} description={t.adminDescription} />;
  }

  if (!canManage) {
    return (
      <section className="authGate">
        <p className="eyebrow">{t.permissionEyebrow}</p>
        <h1>{t.permissionTitle}</h1>
        <p className="lead">{t.permissionDescription}</p>
        <Link className="button" href="/login">
          {t.switchProfile}
        </Link>
      </section>
    );
  }

  return <>{children}</>;
}
