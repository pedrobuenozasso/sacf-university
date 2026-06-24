"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { CourseCard } from "@/components/course-card";
import { useMockUser } from "@/components/use-mock-user";
import { canAccessCourse, type Course } from "@/lib/courses";

const ALL = "Todos";

export function CatalogView({ courses }: { courses: Course[] }) {
  const user = useMockUser();
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

  return (
    <>
      <section className="sectionHead">
        <div>
          <p className="eyebrow">Catálogo privado</p>
          <h1>Aprendizado por função, certificação e prioridade operacional.</h1>
          <p>
            {user
              ? `Você está vendo cursos liberados para ${user.organization}, papel ${user.role} e grupos ${user.groups.join(", ")}.`
              : "Entre para visualizar o catálogo privado da sua empresa."}
          </p>
        </div>
        {!user ? (
          <Link className="button" href="/login">
            Fazer login
          </Link>
        ) : null}
      </section>

      {user && accessibleCourses.length > 0 ? (
        <div className="catalogBar">
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
            <span>cursos liberados</span>
          </div>
        </div>
      ) : null}

      {!user ? (
        <section className="detailPanel">
          <h2>Catálogo protegido por empresa</h2>
          <p>
            Esta área mostra apenas cursos liberados por empresa, grupo, papel ou matrícula direta.
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
