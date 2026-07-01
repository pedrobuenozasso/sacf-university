"use client";

import { CourseCard } from "@/components/course-card";
import { LoginRequiredPanel } from "@/components/access-panels";
import { useSessionUser } from "@/components/use-session-user";
import { canAccessCourse, type Course } from "@/lib/courses";

export function MyCoursesView({ courses }: { courses: Course[] }) {
  const user = useSessionUser();

  if (!user) {
    return <LoginRequiredPanel title="Entre para ver seus cursos." />;
  }

  const visibleCourses = courses.filter((course) => canAccessCourse(course, user));

  return (
    <>
      <section className="sectionHead">
        <div>
          <p className="eyebrow">Meus cursos</p>
          <h1>Continue treinando de onde parou.</h1>
          <p>
            Área privada de {user.organization}. Aqui aparecem os cursos ativos, concluídos e
            pendentes deste acesso.
          </p>
        </div>
      </section>

      <section className="grid">
        {visibleCourses.map((course) => (
          <CourseCard
            course={course}
            href={`/aprender/${course.slug}`}
            key={course.slug}
            showTenantBrand
          />
        ))}
      </section>
    </>
  );
}
