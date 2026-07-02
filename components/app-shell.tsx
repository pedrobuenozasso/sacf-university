"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { navIcon, type IconKey } from "@/components/nav-icons";
import { clearSessionUser, useSessionUser } from "@/components/use-session-user";

type NavItem = { href: string; label: string; icon?: IconKey };

const studentNav: NavItem[] = [
  { href: "/home", label: "Home", icon: "home" },
  { href: "/catalogo", label: "Catálogo", icon: "catalog" },
  { href: "/meus-cursos", label: "Meus cursos", icon: "myCourses" },
  { href: "/certificados", label: "Certificados", icon: "certificates" }
];

const adminNav: NavItem[] = [
  { href: "/admin", label: "Visão geral" },
  { href: "/admin/empresas", label: "Empresas" },
  { href: "/admin/cursos", label: "Cursos" },
  { href: "/admin/usuarios", label: "Usuários" },
  { href: "/admin/certificacoes", label: "Certificações" },
  { href: "/admin/relatorios", label: "Relatórios" }
];

function isActive(pathname: string, href: string) {
  return href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const user = useSessionUser();
  const pathname = usePathname();

  if (!user) {
    return (
      <>
        <header className="topbar">
          <Link href="/" className="brand" aria-label="SACF Academy">
            <Image
              className="brandLockup"
              src="/brand/sacf-academy-horizontal-onDark.png"
              alt="SACF Academy"
              width={190}
              height={107}
              priority
            />
          </Link>
          <nav className="nav" aria-label="Navegação principal">
            <Link href="/">Produto</Link>
            <Link href="/login">Login</Link>
          </nav>
          <Link href="/cadastro" className="profilePill">
            Solicitar implantação
          </Link>
        </header>
        <main>{children}</main>
      </>
    );
  }

  const canManage =
    user.role === "sacf_admin" || user.role === "org_admin" || user.role === "instructor";
  const inAdmin = pathname.startsWith("/admin");
  const items = inAdmin ? adminNav : studentNav;

  return (
    <div className="appShell">
      <aside className="sidebar" aria-label="Navegação principal">
        <Link href="/" className="sidebarBrand" aria-label="SACF Academy">
          <Image
            className="brandMark"
            src="/brand/sacf-academy-symbol.png"
            alt="SACF Academy"
            width={38}
            height={38}
            priority
          />
          <span>
            <strong>SACF</strong>
            <small>Academy</small>
          </span>
        </Link>

        <span className="sidebarOrgChip">{user.organization}</span>

        <nav className="sidebarNav">
          {items.map((item) => (
            <Link key={item.href} href={item.href} data-active={isActive(pathname, item.href)}>
              {item.icon ? navIcon(item.icon) : null}
              {item.label}
            </Link>
          ))}
          {!inAdmin && canManage ? (
            <Link href="/admin" data-active={false}>
              {navIcon("admin")}
              Admin
            </Link>
          ) : null}
        </nav>

        <div className="sidebarUser">
          <span className="userAvatar">{user.name.slice(0, 1)}</span>
          <span>
            <strong>{user.name}</strong>
            <small>
              {user.role === "student"
                ? "Aluno"
                : user.role === "external_partner"
                  ? "Parceiro externo"
                  : "Gestão"}
            </small>
          </span>
          <button type="button" onClick={() => clearSessionUser()} aria-label="Sair">
            Sair
          </button>
        </div>
      </aside>

      <div className="sidebarMain">{children}</div>
    </div>
  );
}
