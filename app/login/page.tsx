"use client";

import Image from "next/image";
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
          <Image
            className="loginBrand"
            src="/brand/sacf-lockup-dark.jpg"
            alt="SACF"
            width={330}
            height={210}
            priority
          />
          <p className="eyebrow">SACF University</p>
          <h1>Acesse sua universidade corporativa.</h1>
          <p className="lead">
            Cada conta pertence a uma empresa, grupos e permissões. A plataforma direciona o usuário
            para cursos, certificados e relatórios conforme seu papel operacional.
          </p>
        </div>

        <form className="loginForm">
          <div className="formStatus">
            <span className="statusDot" />
            <div>
              <strong>Acesso SACF University</strong>
              <small>Ambiente privado por organização</small>
            </div>
          </div>
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
            Acessar área do aluno
          </button>
          <button className="buttonGhost fullButton" type="button" onClick={() => login("ana-admin")}>
            Acessar administração
          </button>
          <p>Autorização aplicada por empresa, papel e grupos de treinamento.</p>
        </form>
      </div>

      <div className="sectionHead compactHead">
        <div>
          <p className="eyebrow">Acesso operacional</p>
          <h2>Perfis operacionais</h2>
          <p>
            Contas com permissões diferentes acessam ambientes, cursos e relatórios diferentes.
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
            <span className="loginCardAction">Acessar ambiente</span>
          </button>
        ))}
      </div>
    </section>
  );
}
