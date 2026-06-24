import { adminUsers } from "@/lib/courses";

export default function AdminUsersPage() {
  return (
    <>
      <div className="sectionHead">
        <div>
          <p className="eyebrow">Usuários</p>
          <h1>Convites, papéis e progresso por pessoa.</h1>
          <p>Controle alunos internos, treinadores, administradores e parceiros externos.</p>
        </div>
      </div>

      <section className="split">
        <div className="tablePanel">
          <div className="tableHead">
            <span>Usuário</span>
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
          <div className="formStatus">
            <span className="statusDot" />
            <div>
              <strong>Convite corporativo</strong>
              <small>Papel, empresa e grupos definem o catálogo do usuário</small>
            </div>
          </div>
          <h2>Convidar usuário</h2>
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
          <p className="formHint">O convite cria vínculo de organização antes do primeiro acesso.</p>
        </form>
      </section>
    </>
  );
}
