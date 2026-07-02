import type { Metadata } from "next";
import { IBM_Plex_Mono, Inter, Space_Grotesk } from "next/font/google";
import { SessionProvider } from "next-auth/react";
import { AppShell } from "@/components/app-shell";
import { MouseAura } from "@/components/mouse-aura";
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
  title: "SACF Academy",
  description: "Plataforma corporativa de cursos, certificações e reciclagens."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR" className={`${spaceGrotesk.variable} ${inter.variable} ${ibmPlexMono.variable}`}>
      <body>
        <div className="shell">
          <MouseAura />
          <SessionProvider>
            <AppShell>{children}</AppShell>
          </SessionProvider>
        </div>
      </body>
    </html>
  );
}
