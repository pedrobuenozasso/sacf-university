import type { Metadata } from "next";
import Link from "next/link";
import { MainNav } from "@/components/main-nav";
import { UserChip } from "@/components/user-chip";
import "./globals.css";

export const metadata: Metadata = {
  title: "SACF University",
  description: "Plataforma corporativa de cursos, certificacoes e reciclagens."
};

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
            <MainNav />
            <UserChip />
          </header>
          <main>{children}</main>
        </div>
      </body>
    </html>
  );
}
