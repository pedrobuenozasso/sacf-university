import type { Metadata } from "next";
import Link from "next/link";
import { UserChip } from "@/components/user-chip";
import "./globals.css";

export const metadata: Metadata = {
  title: "SACF University",
  description: "Plataforma corporativa de cursos, certificacoes e reciclagens."
};

const navItems = [
  { href: "/", label: "Inicio" },
  { href: "/catalogo", label: "Catalogo" },
  { href: "/meus-cursos", label: "Meus cursos" },
  { href: "/certificados", label: "Certificados" },
  { href: "/admin", label: "Admin" },
  { href: "/ajuda", label: "Ajuda" }
];

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body>
        <div className="shell">
          <header className="topbar">
            <Link href="/" className="brand" aria-label="SACF University">
              <span className="brandMark">S</span>
              <span>
                <strong>SACF</strong>
                <small>University</small>
              </span>
            </Link>
            <nav className="nav" aria-label="Navegacao principal">
              {navItems.map((item) => (
                <Link key={item.href} href={item.href}>
                  {item.label}
                </Link>
              ))}
            </nav>
            <UserChip />
          </header>
          <main>{children}</main>
        </div>
      </body>
    </html>
  );
}
