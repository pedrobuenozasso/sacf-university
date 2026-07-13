"use client";

import Link from "next/link";
import { useSessionUser } from "@/components/use-session-user";
import { useLocale, interpolate } from "@/components/locale-provider";
import { canAccessCourse, type Course, type Organization } from "@/lib/courses";

export function HomeView({
  courses,
  organizations
}: {
  courses: Course[];
  organizations: Organization[];
}) {
  const user = useSessionUser();
  const { dict } = useLocale();
  const t = dict.homeView;
  const visibleCourses = user ? courses.filter((course) => canAccessCourse(course, user)) : [];
  const currentOrg = user
    ? organizations.find((organization) => organization.slug === user.organizationSlug)
    : null;

  if (!user) {
    return (
      <section className="authGate">
          <p className="eyebrow">{dict.accessPanels.privateEyebrow}</p>
          <h1>{t.loginTitle}</h1>
          <p className="lead">{t.loginLead}</p>
        <Link className="button" href="/login">
          {t.login}
        </Link>
      </section>
    );
  }

  return (
    <>
      <section className="sectionHead">
        <div>
          <p className="eyebrow">{t.eyebrow}</p>
          <h1>{interpolate(t.welcome, { name: user.name })}</h1>
          <p>{interpolate(t.environment, { organization: user.organization })}</p>
        </div>
        <Link className="button" href="/catalogo">
          {t.seeCourses}
        </Link>
      </section>

      <section className="tenantBanner">
        <div>
          <span className="statusDot" />
          <p className="eyebrow">{t.activeEnv}</p>
          <h2>{currentOrg?.name ?? user.organization}</h2>
          <p>{t.tenantBody}</p>
        </div>
        <div className="tenantStats">
          <span>
            <strong>{currentOrg?.users ?? 0}</strong>
            {t.users}
          </span>
          <span>
            <strong>{currentOrg?.courses ?? visibleCourses.length}</strong>
            {t.courses}
          </span>
          <span>
            <strong>{currentOrg?.expiring ?? 0}</strong>
            {t.expiring}
          </span>
        </div>
      </section>

      <section className="metrics">
        <div className="metric">
          <strong>{visibleCourses.length}</strong>
          <span>{t.coursesReleased}</span>
        </div>
        <div className="metric">
          <strong>{currentOrg?.certificates ?? 0}</strong>
          <span>{t.companyCertificates}</span>
        </div>
        <div className="metric">
          <strong>{currentOrg?.expiring ?? 0}</strong>
          <span>{t.expiringLabel}</span>
        </div>
        <div className="metric">
          <strong>{user.groups.length}</strong>
          <span>{t.accessGroups}</span>
        </div>
      </section>

      <section className="split">
        <div className="detailPanel">
          <div className="sectionHead">
            <div>
              <p className="eyebrow">{t.nextCoursesEyebrow}</p>
              <h2>{t.nextCoursesTitle}</h2>
            </div>
            <Link className="buttonGhost" href="/meus-cursos">
              {t.myCourses}
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
          <p className="eyebrow">{t.profileEyebrow}</p>
          <h2>{t.profileTitle}</h2>
          <div className="checklist">
            <div className="checkItem">
              <span>{t.company}</span>
              <span>{user.organization}</span>
            </div>
            <div className="checkItem">
              <span>{t.area}</span>
              <span>{user.role === "student" ? dict.nav.student : dict.nav.management}</span>
            </div>
            <div className="checkItem">
              <span>{t.tracks}</span>
              <span>{user.groups.length}</span>
            </div>
          </div>
        </aside>
      </section>
    </>
  );
}
