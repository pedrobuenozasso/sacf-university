"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { CourseCard } from "@/components/course-card";
import { useSessionUser } from "@/components/use-session-user";
import { useLocale, interpolate } from "@/components/locale-provider";
import { canAccessCourse, type Course } from "@/lib/courses";

export function CatalogView({ courses }: { courses: Course[] }) {
  const user = useSessionUser();
  const { dict } = useLocale();
  const t = dict.catalogView;
  const [activeFilter, setActiveFilter] = useState<string>(t.all);

  const accessibleCourses = useMemo(() => {
    if (!user) return [];
    return courses.filter((course) => canAccessCourse(course, user));
  }, [courses, user]);

  const filters = useMemo(() => {
    const verticals = Array.from(new Set(accessibleCourses.map((course) => course.vertical)));
    return [t.all, ...verticals];
  }, [accessibleCourses, t.all]);

  const visibleCourses = useMemo(() => {
    if (activeFilter === t.all) return accessibleCourses;
    return accessibleCourses.filter((course) => course.vertical === activeFilter);
  }, [accessibleCourses, activeFilter, t.all]);

  const featuredCourse = accessibleCourses.find((course) => course.status === "Em andamento") ?? accessibleCourses[0];
  const completedCourses = accessibleCourses.filter((course) => course.status === "Concluído").length;
  const certificateCourses = accessibleCourses.filter((course) => course.certificate !== "Sem certificado").length;
  const totalLessons = accessibleCourses.reduce((sum, course) => sum + course.lessons, 0);

  return (
    <>
      <section className="libraryHero">
        <div>
          <p className="eyebrow">{t.eyebrow}</p>
          <h1>{t.title}</h1>
          <p className="lead">{t.lead}</p>
          <div className="libraryActions">
            {user ? (
              <Link className="button" href={featuredCourse ? `/catalogo/${featuredCourse.slug}` : "/catalogo"}>
                {t.featured}
              </Link>
            ) : (
              <Link className="button" href="/login">
                {t.accessLibrary}
              </Link>
            )}
            <Link className="buttonGhost" href="/certificados">
              {t.certificates}
            </Link>
          </div>
        </div>

        <div className="librarySummary" aria-label={t.eyebrow}>
          <span>
            <strong>{user ? accessibleCourses.length : courses.length}</strong>
            {t.coursesReleased}
          </span>
          <span>
            <strong>{user ? certificateCourses : courses.length}</strong>
            {t.withCertificate}
          </span>
          <span>
            <strong>{user ? totalLessons : courses.reduce((sum, course) => sum + course.lessons, 0)}</strong>
            {t.availableLessons}
          </span>
          <span>
            <strong>{completedCourses}</strong>
            {t.completed}
          </span>
        </div>
      </section>

      {user && accessibleCourses.length > 0 ? (
        <section className="sectionHead compactLibraryHead">
          <div>
            <p className="eyebrow">{t.availableEyebrow}</p>
            <h2>{t.availableTitle}</h2>
            <p>{t.availableBody}</p>
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
            <span>{t.coursesInView}</span>
          </div>
        </div>
      ) : null}

      {!user ? (
        <section className="detailPanel">
          <h2>{t.protectedTitle}</h2>
          <p>{t.protectedBody}</p>
          <Link className="button" href="/login">
            {t.enter}
          </Link>
        </section>
      ) : null}

      {user && accessibleCourses.length === 0 ? (
        <section className="detailPanel">
          <h2>{t.emptyTitle}</h2>
          <p>{t.emptyBody}</p>
        </section>
      ) : null}

      {user && accessibleCourses.length > 0 && visibleCourses.length === 0 ? (
        <section className="detailPanel">
          <h2>{interpolate(t.emptyFilterTitle, { filter: activeFilter })}</h2>
          <p>{t.emptyFilterBody}</p>
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
