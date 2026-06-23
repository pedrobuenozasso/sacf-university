import Link from "next/link";

const adminLinks = [
  { href: "/admin", label: "Visao geral" },
  { href: "/admin/empresas", label: "Empresas" },
  { href: "/admin/cursos", label: "Cursos" },
  { href: "/admin/usuarios", label: "Usuarios" },
  { href: "/admin/certificacoes", label: "Certificacoes" },
  { href: "/admin/relatorios", label: "Relatorios" }
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
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
  );
}
