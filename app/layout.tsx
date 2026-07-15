import type { Metadata } from "next";
import { IBM_Plex_Mono, Inter, Space_Grotesk } from "next/font/google";
import { SessionProvider } from "next-auth/react";
import { AppShell } from "@/components/app-shell";
import { LocaleProvider } from "@/components/locale-provider";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { auth } from "@/lib/auth";
import { appPath } from "@/lib/app-path";
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

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const [{ locale, dict }, session] = await Promise.all([getDictionary(), auth()]);

  return (
    <html lang={locale} className={`${spaceGrotesk.variable} ${inter.variable} ${ibmPlexMono.variable}`}>
      <body>
        <div className="shell">
          <LocaleProvider locale={locale} dict={dict}>
            <SessionProvider basePath={appPath("/api/auth")} session={session}>
              <AppShell>{children}</AppShell>
            </SessionProvider>
          </LocaleProvider>
        </div>
      </body>
    </html>
  );
}
