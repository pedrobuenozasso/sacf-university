import { organizations } from "@/lib/courses";

export default function AdminCompaniesPage() {
  return (
    <>
      <div className="sectionHead">
        <div>
          <p className="eyebrow">Empresas</p>
          <h1>Clientes e ambientes de treinamento.</h1>
          <p>Cadastro das empresas que usam a SACF University, com isolamento por organizacao.</p>
        </div>
      </div>

      <section className="split">
        <div className="tablePanel">
          <div className="tableHead">
            <span>Empresa</span>
            <span>Status</span>
            <span>Usuarios</span>
            <span>Cursos</span>
            <span>Vencendo</span>
          </div>
          {organizations.map((org) => (
            <div className="tableRow" key={org.slug}>
              <div>
                <strong>{org.name}</strong>
                <p>{org.slug}</p>
              </div>
              <span className="statusTag">{org.status}</span>
              <span>{org.users}</span>
              <span>{org.courses}</span>
              <span>{org.expiring}</span>
            </div>
          ))}
        </div>

        <form className="detailPanel">
          <h2>Adicionar empresa</h2>
          <input className="field" placeholder="Nome da empresa" />
          <input className="field" placeholder="Slug" />
          <input className="field" placeholder="Email do admin" />
          <button className="button" type="button">
            Criar empresa
          </button>
        </form>
      </section>
    </>
  );
}
