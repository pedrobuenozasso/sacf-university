"use client";

import { signOut, useSession } from "next-auth/react";
import type { SessionUser } from "@/lib/courses";
import { appPath } from "@/lib/app-path";

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
  // The server runs behind Traefik on 0.0.0.0:3000. Build the return URL from
  // the browser's public origin so sign-out never exposes that internal host.
  signOut({ callbackUrl: `${window.location.origin}${appPath("/")}` });
}
