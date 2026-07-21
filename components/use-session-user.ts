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
    avatarUrl: data.user.image ?? null,
    organization: data.user.organizationName ?? "Sem empresa",
    logoUrl: data.user.organizationLogoUrl ?? null,
    primaryColor: data.user.organizationPrimaryColor ?? null,
    secondaryColor: data.user.organizationSecondaryColor ?? null,
    organizationSlug: data.user.organizationSlug ?? "",
    role: (data.user.role ?? "student") as SessionUser["role"],
    groups: data.user.groups
  };
}

export function clearSessionUser() {
  signOut({ callbackUrl: "/" });
}
