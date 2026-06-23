"use client";

import Link from "next/link";
import { useMemo } from "react";
import { CourseCard } from "@/components/course-card";
import { useMockUser } from "@/components/use-mock-user";
import { canAccessCourse, type Course } from "@/lib/courses";

const filters = ["Todos", "Operador", "Mecanico", "Eletrico", "Treinador", "Com certificado"];

export function CatalogView({ courses }: { courses: Course[] }) {
  const user = useMockUser();

  const visibleCourses = useMemo(() => {
    if (!user) return [];
    return courses.filter((course) => canAccessCourse(course, user));
  }, [courses, user]);

  return (
    <>
      <section className="sectionHead">
        <div>
          <p className="eyebrow">Catalogo privado</p>
          <h1>Aprendizado por funcao, certificacao e prioridade operacional.</h1>
          <p>
            {user
              ? `Voce esta vendo cursos liberados para ${user.organization}, papel ${user.role} e grupos ${user.groups.join(", ")}.`
              : "Entre com um perfil de teste para ver o catalogo filtrado por empresa e grupo."}
          </p>
        </div>
        {!user ? (
          <Link className="button" href="/login">
            Fazer login
          </Link>
        ) : null}
      </section>

      <div className="filters">
        {filters.map((filter) => (
          <span className="filter" key={filter}>
            {filter}
          </span>
        ))}
      </div>

      {!user ? (
        <section className="detailPanel">
          <h2>Catalogo protegido por empresa</h2>
          <p>
            No produto real, esta tela so mostra cursos depois do login. Para o MVP, escolha um
            perfil de teste e veja como cada usuario recebe cursos diferentes.
          </p>
          <Link className="button" href="/login">
            Escolher perfil
          </Link>
        </section>
      ) : null}

      {user && visibleCourses.length === 0 ? (
        <section className="detailPanel">
          <h2>Nenhum curso liberado</h2>
          <p>Este usuario ainda nao tem cursos vinculados por empresa, grupo ou matricula direta.</p>
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
