import Link from "next/link";
import { adminUsers, courses, organizations } from "@/lib/courses";

export default function AdminPage() {
  const totalUsers = organizations.reduce((sum, org) => sum + org.users, 0);
  const totalCertificates = organizations.reduce((sum, org) => sum + org.certificates, 0);
  const expiring = organizations.reduce((sum, org) => sum + org.expiring, 0);

  return (
    <>
      <div className="sectionHead">
        <div>
          <p className="eyebrow">Admin SACF University</p>
          <h1>Painel de controle para operar empresas, cursos e certificacoes.</h1>
          <p>
            Visao interna da SACF para acompanhar clientes, conteudo, alunos, certificados e
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
          <span>Usuarios</span>
        </div>
        <div className="metric">
          <strong>{courses.length}</strong>
          <span>Cursos ativos</span>
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
              <p className="eyebrow">Operacao</p>
              <h2>Fila que precisa de atencao</h2>
            </div>
          </div>
          <div className="checklist">
            <div className="checkItem">
              <span>{expiring} certificados vencendo nos proximos 30 dias</span>
              <span>Alto</span>
            </div>
            <div className="checkItem">
              <span>3 usuarios ainda nao aceitaram convite</span>
              <span>Medio</span>
            </div>
            <div className="checkItem">
              <span>2 cursos aguardando revisao tecnica</span>
              <span>Medio</span>
            </div>
            <div className="checkItem">
              <span>Relatorio mensal da Zasso pronto para envio</span>
              <span>Baixo</span>
            </div>
          </div>
        </div>

        <div className="detailPanel">
          <p className="eyebrow">Usuarios recentes</p>
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
