"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { CourseCard } from "@/components/course-card";
import { useSessionUser } from "@/components/use-session-user";
import { canAccessCourse, type Course } from "@/lib/courses";

const ALL = "Todos";

export function CatalogView({ courses }: { courses: Course[] }) {
  const user = useSessionUser();
  const [activeFilter, setActiveFilter] = useState(ALL);

  const accessibleCourses = useMemo(() => {
    if (!user) return [];
    return courses.filter((course) => canAccessCourse(course, user));
  }, [courses, user]);

  const filters = useMemo(() => {
    const verticals = Array.from(new Set(accessibleCourses.map((course) => course.vertical)));
    return [ALL, ...verticals];
  }, [accessibleCourses]);

  const visibleCourses = useMemo(() => {
    if (activeFilter === ALL) return accessibleCourses;
    return accessibleCourses.filter((course) => course.vertical === activeFilter);
  }, [accessibleCourses, activeFilter]);

  const featuredCourse = accessibleCourses.find((course) => course.status === "Em andamento") ?? accessibleCourses[0];
  const completedCourses = accessibleCourses.filter((course) => course.status === "Concluído").length;
  const certificateCourses = accessibleCourses.filter((course) => course.certificate !== "Sem certificado").length;
  const totalLessons = accessibleCourses.reduce((sum, course) => sum + course.lessons, 0);

  return (
    <>
      <section className="libraryHero">
        <div>
          <p className="eyebrow">Biblioteca SACF</p>
          <h1>Cursos oficiais para treinar, certificar e reciclar equipes.</h1>
          <p className="lead">
            Conteúdos assinados pela SACF, organizados por função, risco operacional e validade de
            certificação. Cada empresa libera apenas o que faz sentido para sua operação.
          </p>
          <div className="libraryActions">
            {user ? (
              <Link className="button" href={featuredCourse ? `/catalogo/${featuredCourse.slug}` : "/catalogo"}>
                Ver curso em destaque
              </Link>
            ) : (
              <Link className="button" href="/login">
                Acessar biblioteca
              </Link>
            )}
            <Link className="buttonGhost" href="/certificados">
              Certificados
            </Link>
          </div>
        </div>

        <div className="librarySummary" aria-label="Resumo da biblioteca">
          <span>
            <strong>{user ? accessibleCourses.length : courses.length}</strong>
            cursos liberados
          </span>
          <span>
            <strong>{user ? certificateCourses : courses.length}</strong>
            com certificação
          </span>
          <span>
            <strong>{user ? totalLessons : courses.reduce((sum, course) => sum + course.lessons, 0)}</strong>
            aulas disponíveis
          </span>
          <span>
            <strong>{completedCourses}</strong>
            concluídos
          </span>
        </div>
      </section>

      {user && accessibleCourses.length > 0 ? (
        <section className="sectionHead compactLibraryHead">
          <div>
            <p className="eyebrow">Cursos disponíveis</p>
            <h2>Selecione uma trilha para continuar.</h2>
            <p>Cursos oficiais SACF liberados para este acesso, com progresso e certificação.</p>
          </div>
        </section>
      ) : null}

      {user && accessibleCourses.length > 0 ? (
        <div className="catalogBar libraryCatalogBar">
          <div className="filters">
            {filters.map((filter) => (
              <button
                type="button"
                className="filter"
                key={filter}
                data-active={activeFilter === filter}
                onClick={() => setActiveFilter(filter)}
              >
                {filter}
              </button>
            ))}
          </div>
          <div className="catalogContext">
            <strong>{visibleCourses.length}</strong>
            <span>cursos nesta visão</span>
          </div>
        </div>
      ) : null}

      {!user ? (
        <section className="detailPanel">
          <h2>Cursos protegidos por empresa</h2>
          <p>
            Esta área mostra cursos publicados para a operação da empresa e suas trilhas internas.
          </p>
          <Link className="button" href="/login">
            Entrar
          </Link>
        </section>
      ) : null}

      {user && accessibleCourses.length === 0 ? (
        <section className="detailPanel">
          <h2>Nenhum curso liberado</h2>
          <p>Este usuário ainda não tem cursos vinculados por empresa, grupo ou matrícula direta.</p>
        </section>
      ) : null}

      {user && accessibleCourses.length > 0 && visibleCourses.length === 0 ? (
        <section className="detailPanel">
          <h2>Nenhum curso em “{activeFilter}”</h2>
          <p>Tente outra vertical ou volte para “Todos”.</p>
        </section>
      ) : null}

      <section className="grid">
        {visibleCourses.map((course) => (
          <CourseCard course={course} href={`/catalogo/${course.slug}`} key={course.slug} />
        ))}
      </section>
    </>
  );
}
