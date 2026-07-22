"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { navIcon, type IconKey } from "@/components/nav-icons";
import { clearSessionUser, useSessionUser } from "@/components/use-session-user";
import { LanguageSwitcher } from "@/components/language-switcher";
import { useLocale } from "@/components/locale-provider";
import { appPath } from "@/lib/app-path";
import { mediaUrl } from "@/lib/media-url";
import type { Dictionary } from "@/lib/i18n/dictionaries/types";

type NavItem = { href: string; labelKey: keyof Dictionary["nav"]; icon?: IconKey };

const studentNav: NavItem[] = [
  { href: "/home", labelKey: "home", icon: "home" },
  { href: "/catalogo", labelKey: "catalog", icon: "catalog" },
  { href: "/meus-cursos", labelKey: "myCourses", icon: "myCourses" },
  { href: "/certificados", labelKey: "certificates", icon: "certificates" }
];

const adminNav: NavItem[] = [
  { href: "/admin", labelKey: "adminOverview", icon: "admin" },
  { href: "/admin/empresas", labelKey: "adminCompanies", icon: "building" },
  { href: "/admin/cursos", labelKey: "adminCourses", icon: "catalog" },
  { href: "/admin/usuarios", labelKey: "adminUsers", icon: "users" },
  { href: "/admin/certificacoes", labelKey: "adminCertifications", icon: "certificates" },
  { href: "/admin/relatorios", labelKey: "adminReports", icon: "report" },
  { href: "/admin/identidade", labelKey: "adminSettings", icon: "settings" },
  { href: "/admin/historico", labelKey: "adminAudit", icon: "report" }
];

function isActive(pathname: string, href: string) {
  return href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const user = useSessionUser();
  const pathname = usePathname();
  const { dict } = useLocale();

  if (!user) {
    return (
      <>
        <header className="topbar">
          <Link href="/" className="brand" aria-label="SACF Academy">
            <Image
              className="brandLockup"
              src={appPath("/brand/sacf-academy-horizontal-onDark.png")}
              alt="SACF Academy"
              width={190}
              height={107}
              priority
            />
          </Link>
          <div className="topbarActions">
            <nav className="nav" aria-label={dict.nav.primaryNavigation}>
              <Link href="/">{dict.nav.product}</Link>
              <Link href="/login">{dict.nav.login}</Link>
            </nav>
            <Link href="/cadastro" className="profilePill">
              {dict.nav.requestImplementation}
            </Link>
            <LanguageSwitcher />
          </div>
        </header>
        <main>{children}</main>
        {pathname === "/" ? (
          <footer className="siteFooter">
            <div className="siteFooterMain">
              <Link href="/" className="siteFooterBrand" aria-label="SACF Academy">
                <Image
                  src={appPath("/brand/sacf-academy-horizontal-onDark.png")}
                  alt="SACF Academy"
                  width={158}
                  height={89}
                />
              </Link>
              <nav className="siteFooterNav" aria-label={dict.nav.primaryNavigation}>
                <Link href="/">{dict.nav.product}</Link>
                <Link href="/login">{dict.nav.login}</Link>
                <Link href="/cadastro">{dict.nav.requestImplementation}</Link>
              </nav>
              <LanguageSwitcher variant="links" />
            </div>
            <div className="siteFooterBottom">
              <span>{dict.footer.rights.replace("{year}", String(new Date().getFullYear()))}</span>
              <span>SACF Academy</span>
            </div>
          </footer>
        ) : null}
      </>
    );
  }

  const canManage =
    user.role === "sacf_admin" || user.role === "org_admin" || user.role === "instructor";
  // Company administrators manage their own team and content. The tenant
  // registry belongs exclusively to SACF and is intentionally not exposed in
  // their navigation.
  const items = canManage
    ? user.role === "sacf_admin"
      ? adminNav
      : adminNav.filter((item) => item.href !== "/admin/empresas")
    : studentNav;

  return (
    <div className="appShell" style={{ "--tenant-primary": user.primaryColor ?? undefined, "--tenant-secondary": user.secondaryColor ?? undefined } as React.CSSProperties}>
      <aside className="sidebar" aria-label={dict.nav.primaryNavigation}>
        <Link href="/" className="sidebarBrand" aria-label="SACF Academy">
          {user.logoUrl ? (
            // Tenant logos may come from each company's approved storage URL.
            // eslint-disable-next-line @next/next/no-img-element
            <img className="tenantBrandLogo" src={mediaUrl(user.logoUrl) ?? ""} alt={user.organization} />
          ) : <Image
            className="brandMark"
            src={appPath("/brand/sacf-academy-symbol.png")}
            alt="SACF Academy"
            width={38}
            height={38}
            priority
          />}
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
              {dict.nav[item.labelKey]}
            </Link>
          ))}
        </nav>

        <div className="sidebarUser">
          <LanguageSwitcher />
          <Link href="/perfil" className="sidebarUserLink" data-active={pathname === "/perfil"}>
            <span className="userAvatar">
              {user.avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={mediaUrl(user.avatarUrl) ?? ""} alt="" />
              ) : (
                user.name.slice(0, 1)
              )}
            </span>
            <span>
              <strong>{user.name}</strong>
              <small>
                {user.role === "student"
                  ? dict.nav.student
                  : user.role === "external_partner"
                    ? dict.nav.partner
                    : dict.nav.management}
              </small>
            </span>
          </Link>
          <button type="button" onClick={() => clearSessionUser()} aria-label={dict.nav.logout}>
            {dict.nav.logout}
          </button>
        </div>
      </aside>

      <div className="sidebarMain">{children}</div>
    </div>
  );
}
