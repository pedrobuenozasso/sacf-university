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
  const inProgress = visibleCourses.filter((course) => course.status === "Em andamento");
  const available = visibleCourses.filter((course) => course.status === "Disponível");
  const completed = visibleCourses.filter((course) => course.status === "Concluído");

  const section = (title: string, body: string, list: Course[]) => list.length ? <section className="courseShelf"><div className="courseShelfHead"><div><h2>{title}</h2><p>{body}</p></div><strong>{list.length}</strong></div><div className="grid">{list.map((course) => <CourseCard course={course} href={course.status === "Disponível" ? `/catalogo/${course.slug}` : `/aprender/${course.slug}`} key={course.slug} showTenantBrand />)}</div></section> : null;

  return (
    <>
      <section className="sectionHead">
        <div>
          <p className="eyebrow">{t.eyebrow}</p>
          <h1>{t.title}</h1>
          <p>{interpolate(t.body, { organization: user.organization })}</p>
        </div>
      </section>

      {section(t.continueTitle, t.continueBody, inProgress)}
      {section(t.availableTitle, t.availableBody, available)}
      {section(t.completedTitle, t.completedBody, completed)}
      {!visibleCourses.length ? <section className="detailPanel"><h2>{t.emptyTitle}</h2><p>{t.emptyBody}</p></section> : null}
    </>
  );
}
