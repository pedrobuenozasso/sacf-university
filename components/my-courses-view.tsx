"use client";

import { CourseCard } from "@/components/course-card";
import { LoginRequiredPanel } from "@/components/access-panels";
import { useMockUser } from "@/components/use-mock-user";
import { canAccessCourse, courses } from "@/lib/courses";

export function MyCoursesView() {
  const user = useMockUser();

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
            Area privada de {user.organization}. Aqui aparecem apenas cursos liberados para seu
            perfil.
          </p>
        </div>
      </section>

      <section className="grid">
        {visibleCourses.map((course) => (
          <CourseCard course={course} href={`/aprender/${course.slug}`} key={course.slug} />
        ))}
      </section>
    </>
  );
}
