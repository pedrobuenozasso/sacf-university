import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import type { Session } from "next-auth";

export type AdminScope = {
  isSacfAdmin: boolean;
  organizationSlug: string | null;
};

const ADMIN_ROLES = new Set(["sacf_admin", "org_admin", "instructor"]);

function scopeFromSession(session: Session | null): AdminScope {
  return {
    isSacfAdmin: session?.user?.role === "sacf_admin",
    organizationSlug: session?.user?.organizationSlug ?? null
  };
}

// SACF admins operate across every tenant company. Company admins (and other
// managers) only ever act on their own organization's data.
export async function getAdminScope(): Promise<AdminScope> {
  const session = await auth();
  return scopeFromSession(session);
}

// Never rely on the client-side navigation shell for access control. Admin
// routes must reject unauthorized requests before their data is rendered.
export async function requireAdminScope(): Promise<AdminScope> {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");
  if (!ADMIN_ROLES.has(session.user.role ?? "")) redirect("/home");
  return scopeFromSession(session);
}
