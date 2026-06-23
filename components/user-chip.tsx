"use client";

import Link from "next/link";
import { clearMockUser, useMockUser } from "@/components/use-mock-user";

export function UserChip() {
  const user = useMockUser();

  function logout() {
    clearMockUser();
  }

  if (!user) {
    return (
      <Link href="/login" className="profilePill">
        Entrar
      </Link>
    );
  }

  return (
    <div className="userChip">
      <span className="userAvatar">{user.name.slice(0, 1)}</span>
      <span>
        <strong>{user.name}</strong>
        <small>{user.organization}</small>
      </span>
      <button type="button" onClick={logout}>
        Sair
      </button>
    </div>
  );
}
