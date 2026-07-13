import { AdminGuard } from "@/components/access-panels";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminGuard>
      <div className="adminPage">{children}</div>
    </AdminGuard>
  );
}
