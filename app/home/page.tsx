"use client";

import Link from "next/link";
import { useMockUser } from "@/components/use-mock-user";
import { canAccessCourse, courses, organizations } from "@/lib/courses";

export default function HomeDashboardPage() {
  const user = useMockUser();
  const visibleCourses = user ? courses.filter((course) => canAccessCourse(course, user)) : [];
  const currentOrg = user
    ? organizations.find((organization) => organization.slug === user.organizationSlug)
    : null;

  if (!user) {
    return (
      <section className="authGate">
        <p className="eyebrow">Acesso privado</p>
        <h1>Entre para acessar sua universidade corporativa.</h1>
        <p className="lead">
          Cada usuário acessa o ambiente da empresa e visualiza apenas cursos, certificados e
          relatórios liberados para seu perfil.
        </p>
        <Link className="button" href="/login">
          Fazer login
        </Link>
      </section>
    );
  }

  return (
    <>
      <section className="sectionHead">
        <div>
          <p className="eyebrow">Home</p>
          <h1>Bem-vindo, {user.name}.</h1>
          <p>
            Ambiente {user.organization}. Seu acesso atual usa papel {user.role} e grupos{" "}
            {user.groups.join(", ")}.
          </p>
        </div>
        <Link className="button" href="/catalogo">
          Ver catálogo
        </Link>
      </section>

      <section className="tenantBanner">
        <div>
          <span className="statusDot" />
          <p className="eyebrow">Ambiente ativo</p>
          <h2>{currentOrg?.name ?? user.organization}</h2>
          <p>
            Cursos, certificados e relatórios isolados por empresa. Este painel mostra somente o que
            o perfil atual tem permissão para acessar.
          </p>
        </div>
        <div className="tenantStats">
          <span>
            <strong>{currentOrg?.users ?? 0}</strong>
            usuários
          </span>
          <span>
            <strong>{currentOrg?.courses ?? visibleCourses.length}</strong>
            cursos
          </span>
          <span>
            <strong>{currentOrg?.expiring ?? 0}</strong>
            vencendo
          </span>
        </div>
      </section>

      <section className="metrics">
        <div className="metric">
          <strong>{visibleCourses.length}</strong>
          <span>Cursos liberados</span>
        </div>
        <div className="metric">
          <strong>{currentOrg?.certificates ?? 0}</strong>
          <span>Certificados da empresa</span>
        </div>
        <div className="metric">
          <strong>{currentOrg?.expiring ?? 0}</strong>
          <span>Vencendo</span>
        </div>
        <div className="metric">
          <strong>{user.groups.length}</strong>
          <span>Grupos de acesso</span>
        </div>
      </section>

      <section className="split">
        <div className="detailPanel">
          <div className="sectionHead">
            <div>
              <p className="eyebrow">Próximos cursos</p>
              <h2>Continue sua trilha.</h2>
            </div>
            <Link className="buttonGhost" href="/meus-cursos">
              Meus cursos
            </Link>
          </div>
          <div className="moduleList">
            {visibleCourses.slice(0, 3).map((course) => (
              <Link className="moduleItem linkedModule" href={`/aprender/${course.slug}`} key={course.slug}>
                <h3>{course.title}</h3>
                <p>
                  {course.vertical} · {course.duration} · {course.certificate}
                </p>
                <div className="progressTrack">
                  <div className="progressFill" style={{ width: `${course.progress}%` }} />
                </div>
              </Link>
            ))}
          </div>
        </div>

        <aside className="detailPanel">
          <p className="eyebrow">Acesso</p>
          <h2>Como este usuário foi filtrado</h2>
          <div className="checklist">
            <div className="checkItem">
              <span>Empresa</span>
              <span>{user.organization}</span>
            </div>
            <div className="checkItem">
              <span>Papel</span>
              <span>{user.role}</span>
            </div>
            <div className="checkItem">
              <span>Grupos</span>
              <span>{user.groups.length}</span>
            </div>
          </div>
        </aside>
      </section>
    </>
  );
}
