"use client";

import { CourseCard } from "@/components/course-card";
import { LoginRequiredPanel } from "@/components/access-panels";
import { useSessionUser } from "@/components/use-session-user";
import { useLocale, interpolate } from "@/components/locale-provider";
import { canAccessCourse, type Course } from "@/lib/courses";

export function MyCoursesView({ courses }: { courses: Course[] }) {
  const user = useSessionUser();
  const { dict } = useLocale();
  const t = dict.myCoursesView;

  if (!user) {
    return <LoginRequiredPanel title={t.loginTitle} />;
  }

  const visibleCourses = courses.filter((course) => canAccessCourse(course, user));

  return (
    <>
      <section className="sectionHead">
        <div>
          <p className="eyebrow">{t.eyebrow}</p>
          <h1>{t.title}</h1>
          <p>{interpolate(t.body, { organization: user.organization })}</p>
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
