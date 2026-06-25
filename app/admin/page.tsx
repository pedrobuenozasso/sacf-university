import Link from "next/link";
import { getAdminUsers, getOrganizations } from "@/lib/data";
import { supportedLocales } from "@/lib/i18n";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const [organizations, adminUsers] = await Promise.all([getOrganizations(), getAdminUsers()]);
  const totalUsers = organizations.reduce((sum, org) => sum + org.users, 0);
  const totalCertificates = organizations.reduce((sum, org) => sum + org.certificates, 0);
  const expiring = organizations.reduce((sum, org) => sum + org.expiring, 0);

  return (
    <>
      <div className="sectionHead">
        <div>
          <p className="eyebrow">Admin SACF University</p>
          <h1>Painel de controle para operar empresas, cursos e certificações.</h1>
          <p>
            Visão interna da SACF para acompanhar clientes, conteúdo, alunos, certificados e
            reciclagens.
          </p>
        </div>
        <Link className="button" href="/admin/cursos">
          Novo curso
        </Link>
      </div>

      <section className="metrics">
        <div className="metric">
          <strong>{organizations.length}</strong>
          <span>Empresas</span>
        </div>
        <div className="metric">
          <strong>{totalUsers}</strong>
          <span>Usuários</span>
        </div>
        <div className="metric">
          <strong>{supportedLocales.length}</strong>
          <span>Idiomas previstos</span>
        </div>
        <div className="metric">
          <strong>{totalCertificates}</strong>
          <span>Certificados</span>
        </div>
      </section>

      <section className="split">
        <div className="detailPanel">
          <div className="sectionHead">
            <div>
              <p className="eyebrow">Operação</p>
              <h2>Fila que precisa de atenção</h2>
            </div>
          </div>
          <div className="checklist">
            <div className="checkItem">
              <span>{expiring} certificados vencendo nos próximos 30 dias</span>
              <span>Alto</span>
            </div>
            <div className="checkItem">
              <span>3 usuários ainda não aceitaram convite</span>
              <span>Médio</span>
            </div>
            <div className="checkItem">
              <span>2 cursos aguardando revisão técnica</span>
              <span>Médio</span>
            </div>
            <div className="checkItem">
              <span>Relatório mensal do cliente piloto pronto para envio</span>
              <span>Baixo</span>
            </div>
          </div>
        </div>

        <div className="detailPanel">
          <p className="eyebrow">Usuários recentes</p>
          <div className="moduleList">
            {adminUsers.slice(0, 4).map((user) => (
              <div className="moduleItem" key={user.email}>
                <h3>{user.name}</h3>
                <p>
                  {user.organization} · {user.role} · {user.status}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
