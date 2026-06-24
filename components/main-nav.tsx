"use client";

import Link from "next/link";
import { useMockUser } from "@/components/use-mock-user";

const publicNav = [
  { href: "/", label: "Produto" },
  { href: "/login", label: "Login" }
];

const privateNav = [
  { href: "/home", label: "Home" },
  { href: "/catalogo", label: "Catálogo" },
  { href: "/meus-cursos", label: "Meus cursos" },
  { href: "/certificados", label: "Certificados" }
];

export function MainNav() {
  const user = useMockUser();
  const canManage =
    user?.role === "sacf_admin" || user?.role === "org_admin" || user?.role === "instructor";
  const items = user
    ? [...privateNav, ...(canManage ? [{ href: "/admin", label: "Admin" }] : [])]
    : publicNav;

  return (
    <nav className="nav" aria-label="Navegação principal">
      {items.map((item) => (
        <Link key={item.href} href={item.href}>
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
