"use client";

import Link from "next/link";
import { useMockUser } from "@/components/use-mock-user";

export function LoginRequiredPanel({
  title = "Entre para continuar.",
  description = "Esta área pertence ao ambiente privado da empresa. Faça login para acessar cursos, certificados e relatórios."
}: {
  title?: string;
  description?: string;
}) {
  return (
    <section className="authGate">
      <p className="eyebrow">Acesso privado</p>
      <h1>{title}</h1>
      <p className="lead">{description}</p>
      <Link className="button" href="/login">
        Fazer login
      </Link>
    </section>
  );
}

export function AdminGuard({ children }: { children: React.ReactNode }) {
  const user = useMockUser();
  const canManage =
    user?.role === "sacf_admin" || user?.role === "org_admin" || user?.role === "instructor";

  if (!user) {
    return (
      <LoginRequiredPanel
        title="Entre como admin da empresa."
        description="O painel administrativo exige uma conta com permissão de empresa ou SACF."
      />
    );
  }

  if (!canManage) {
    return (
      <section className="authGate">
        <p className="eyebrow">Permissão necessária</p>
        <h1>Seu perfil atual não administra cursos.</h1>
        <p className="lead">
          A administração de cursos exige uma conta com permissão de empresa, instrutor ou SACF.
        </p>
        <Link className="button" href="/login">
          Trocar perfil
        </Link>
      </section>
    );
  }

  return <>{children}</>;
}
