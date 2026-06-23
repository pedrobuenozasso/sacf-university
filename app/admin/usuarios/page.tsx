import { adminUsers } from "@/lib/courses";

export default function AdminUsersPage() {
  return (
    <>
      <div className="sectionHead">
        <div>
          <p className="eyebrow">Usuarios</p>
          <h1>Convites, papeis e progresso por pessoa.</h1>
          <p>Controle alunos internos, treinadores, administradores e parceiros externos.</p>
        </div>
      </div>

      <section className="split">
        <div className="tablePanel">
          <div className="tableHead">
            <span>Usuario</span>
            <span>Empresa</span>
            <span>Papel</span>
            <span>Status</span>
            <span>Progresso</span>
          </div>
          {adminUsers.map((user) => (
            <div className="tableRow" key={user.email}>
              <div>
                <strong>{user.name}</strong>
                <p>{user.email}</p>
              </div>
              <span>{user.organization}</span>
              <span>{user.role}</span>
              <span className="statusTag">{user.status}</span>
              <span>{user.progress}%</span>
            </div>
          ))}
        </div>

        <form className="detailPanel">
          <h2>Convidar usuario</h2>
          <input className="field" placeholder="Nome" />
          <input className="field" placeholder="Email" />
          <select className="field" defaultValue="">
            <option value="" disabled>
              Papel
            </option>
            <option>Admin da empresa</option>
            <option>Treinador</option>
            <option>Aluno</option>
            <option>Parceiro externo</option>
          </select>
          <button className="button" type="button">
            Enviar convite
          </button>
        </form>
      </section>
    </>
  );
}
