"use client";

import { signOut, useSession } from "next-auth/react";
import type { SessionUser } from "@/lib/courses";

export function useSessionUser(): SessionUser | null {
  const { data } = useSession();
  if (!data?.user) return null;

  return {
    id: data.user.id,
    name: data.user.name ?? data.user.email ?? "Usuário",
    email: data.user.email ?? "",
    organization: data.user.organizationName ?? "Sem empresa",
    organizationSlug: data.user.organizationSlug ?? "",
    role: (data.user.role ?? "student") as SessionUser["role"],
    groups: data.user.groups
  };
}

export function clearSessionUser() {
  signOut({ callbackUrl: "/" });
}
