import type { Metadata } from "next";
import { IBM_Plex_Mono, Inter, Space_Grotesk } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import { MainNav } from "@/components/main-nav";
import { UserChip } from "@/components/user-chip";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-display"
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-body"
});

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono"
});

export const metadata: Metadata = {
  title: "SACF University",
  description: "Plataforma corporativa de cursos, certificações e reciclagens."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR" className={`${spaceGrotesk.variable} ${inter.variable} ${ibmPlexMono.variable}`}>
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
