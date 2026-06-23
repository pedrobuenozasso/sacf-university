"use client";

import { useRouter } from "next/navigation";
import { setMockUser } from "@/components/use-mock-user";
import { mockUsers } from "@/lib/courses";

export default function LoginPage() {
  const router = useRouter();

  function login(userId: string) {
    setMockUser(userId);
    router.push("/catalogo");
  }

  return (
    <section className="loginShell">
      <div className="detailPanel">
        <p className="eyebrow">Login mockado</p>
        <h1>Escolha um perfil para testar os acessos.</h1>
        <p className="lead">
          Por enquanto nao tem banco nem senha. Cada perfil simula uma empresa, papel e grupo
          diferente para validarmos a logica do MVP.
        </p>
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
