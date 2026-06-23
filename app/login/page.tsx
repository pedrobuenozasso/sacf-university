"use client";

import { useRouter } from "next/navigation";
import { setMockUser } from "@/components/use-mock-user";
import { mockUsers } from "@/lib/courses";

export default function LoginPage() {
  const router = useRouter();

  function login(userId: string) {
    setMockUser(userId);
    router.push("/home");
  }

  return (
    <section className="loginShell">
      <div className="loginHero">
        <div>
          <p className="eyebrow">SACF University</p>
          <h1>Acesse sua universidade corporativa.</h1>
          <p className="lead">
            Cada conta pertence a uma empresa, grupos e permissoes. No MVP, o acesso e simulado
            para validarmos a experiencia antes de ligar banco e autenticacao real.
          </p>
        </div>

        <form className="loginForm">
          <h2>Entrar</h2>
          <label>
            Email
            <input className="field" placeholder="nome@empresa.com" type="email" />
          </label>
          <label>
            Senha
            <input className="field" placeholder="••••••••" type="password" />
          </label>
          <button className="button" type="button" onClick={() => login("carlos-operador")}>
            Entrar como aluno demo
          </button>
          <button className="buttonGhost fullButton" type="button" onClick={() => login("ana-admin")}>
            Entrar como admin da empresa
          </button>
          <p>Login real sera conectado ao SACF Hub ou provedor de identidade da empresa.</p>
        </form>
      </div>

      <div className="sectionHead compactHead">
        <div>
          <p className="eyebrow">Demonstração</p>
          <h2>Perfis para testar permissões</h2>
          <p>
            Esta área é temporária para o protótipo. Ela mostra como empresa, papel e grupo mudam o
            catálogo de cursos.
          </p>
        </div>
      </div>

      <div className="loginGrid">
        {mockUsers.map((user) => (
          <button className="loginCard" key={user.id} type="button" onClick={() => login(user.id)}>
            <span className="userAvatar">{user.name.slice(0, 1)}</span>
            <strong>{user.name}</strong>
            <small>{user.organization}</small>
            <span className="statusTag">{user.role}</span>
            <p>{user.groups.join(" · ")}</p>
          </button>
        ))}
      </div>
    </section>
  );
}
