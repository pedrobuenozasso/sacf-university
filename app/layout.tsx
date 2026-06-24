import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { MainNav } from "@/components/main-nav";
import { UserChip } from "@/components/user-chip";
import "./globals.css";

export const metadata: Metadata = {
  title: "SACF University",
  description: "Plataforma corporativa de cursos, certificações e reciclagens."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body>
        <div className="shell">
          <header className="topbar">
            <Link href="/" className="brand" aria-label="SACF University">
              <Image
                className="brandMark"
                src="/brand/sacf-app-icon-v2.png"
                alt="SACF"
                width={42}
                height={42}
                priority
              />
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
