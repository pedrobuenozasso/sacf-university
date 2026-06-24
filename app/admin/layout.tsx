import Link from "next/link";
import { AdminGuard } from "@/components/access-panels";

const adminLinks = [
  { href: "/admin", label: "Visão geral" },
  { href: "/admin/empresas", label: "Empresas" },
  { href: "/admin/cursos", label: "Cursos" },
  { href: "/admin/usuarios", label: "Usuários" },
  { href: "/admin/certificacoes", label: "Certificações" },
  { href: "/admin/relatorios", label: "Relatórios" }
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminGuard>
      <section className="adminLayout">
        <aside className="adminRail" aria-label="Menu administrativo">
          {adminLinks.map((link) => (
            <Link href={link.href} key={link.href}>
              {link.label}
            </Link>
          ))}
        </aside>
        <div className="adminContent">{children}</div>
      </section>
    </AdminGuard>
  );
}
