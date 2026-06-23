import { organizations } from "@/lib/courses";

export default function AdminReportsPage() {
  return (
    <>
      <div className="sectionHead">
        <div>
          <p className="eyebrow">Relatorios</p>
          <h1>Indicadores para SACF e para cada empresa.</h1>
          <p>Base para export CSV, relatorio mensal e acompanhamento executivo.</p>
        </div>
      </div>

      <section className="grid">
        <div className="detailPanel">
          <h2>Progresso por empresa</h2>
          <p>Conclusao media, cursos em andamento e alunos atrasados.</p>
          <button className="buttonGhost" type="button">
            Exportar CSV
          </button>
        </div>
        <div className="detailPanel">
          <h2>Certificados</h2>
          <p>Emitidos, vencidos, vencendo e reciclados por periodo.</p>
          <button className="buttonGhost" type="button">
            Exportar CSV
          </button>
        </div>
        <div className="detailPanel">
          <h2>Uso da plataforma</h2>
          <p>Acessos, aulas assistidas, provas realizadas e convites pendentes.</p>
          <button className="buttonGhost" type="button">
            Exportar CSV
          </button>
        </div>
        <div className="detailPanel">
          <h2>Resumo executivo</h2>
          <p>Relatorio mensal para lideranca da empresa cliente.</p>
          <button className="buttonGhost" type="button">
            Gerar previa
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
          <span>Usuarios</span>
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
