import { AdminGuard } from "@/components/access-panels";
import { requireAdminScope } from "@/lib/admin-scope";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requireAdminScope();

  return (
    <AdminGuard>
      <div className="adminPage">{children}</div>
    </AdminGuard>
  );
}
