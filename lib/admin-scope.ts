import { auth } from "@/lib/auth";

export type AdminScope = {
  isSacfAdmin: boolean;
  organizationSlug: string | null;
};

// SACF admins operate across every tenant company. Company admins (and other
// managers) only ever act on their own organization's data.
export async function getAdminScope(): Promise<AdminScope> {
  const session = await auth();
  const role = session?.user?.role ?? null;
  return {
    isSacfAdmin: role === "sacf_admin",
    organizationSlug: session?.user?.organizationSlug ?? null
  };
}
