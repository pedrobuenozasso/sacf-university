import { getOrganizations } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function AdminReportsPage() {
  const organizations = await getOrganizations();
  return (
    <>
      <div className="sectionHead">
        <div>
          <p className="eyebrow">Relatórios</p>
          <h1>Indicadores para SACF e para cada empresa.</h1>
          <p>Base para export CSV, relatório mensal e acompanhamento executivo.</p>
        </div>
      </div>

      <section className="grid">
        <div className="detailPanel reportCard">
          <span className="reportStatus">Semanal</span>
          <h2>Progresso por empresa</h2>
          <p>Conclusão média, cursos em andamento e alunos atrasados.</p>
          <button className="buttonGhost" type="button">
            Exportar CSV
          </button>
        </div>
        <div className="detailPanel reportCard">
          <span className="reportStatus">Crítico</span>
          <h2>Certificados</h2>
          <p>Emitidos, vencidos, vencendo e reciclados por período.</p>
          <button className="buttonGhost" type="button">
            Exportar CSV
          </button>
        </div>
        <div className="detailPanel reportCard">
          <span className="reportStatus">Operação</span>
          <h2>Uso da plataforma</h2>
          <p>Acessos, aulas assistidas, provas realizadas e convites pendentes.</p>
          <button className="buttonGhost" type="button">
            Exportar CSV
          </button>
        </div>
        <div className="detailPanel reportCard">
          <span className="reportStatus">Executivo</span>
          <h2>Resumo executivo</h2>
          <p>Relatório mensal para liderança da empresa cliente.</p>
          <button className="buttonGhost" type="button">
            Gerar prévia
          </button>
        </div>
      </section>

      <div className="sectionHead">
        <div>
          <h2>Empresas monitoradas</h2>
        </div>
      </div>
      <div className="tablePanel">
        <div className="tableHead">
          <span>Empresa</span>
          <span>Status</span>
          <span>Usuários</span>
          <span>Certificados</span>
          <span>Vencendo</span>
        </div>
        {organizations.map((org) => (
          <div className="tableRow" key={org.slug}>
            <div>
              <strong>{org.name}</strong>
              <p>{org.slug}</p>
            </div>
            <span>{org.status}</span>
            <span>{org.users}</span>
            <span>{org.certificates}</span>
            <span>{org.expiring}</span>
          </div>
        ))}
      </div>
    </>
  );
}
