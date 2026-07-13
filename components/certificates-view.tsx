"use client";

import { LoginRequiredPanel } from "@/components/access-panels";
import { useSessionUser } from "@/components/use-session-user";
import { useLocale, interpolate } from "@/components/locale-provider";
import { canAccessCourse, getOrganization, type Course } from "@/lib/courses";

export function CertificatesView({ courses }: { courses: Course[] }) {
  const user = useSessionUser();
  const { dict } = useLocale();
  const t = dict.certificatesView;

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
          <p>{t.body}</p>
        </div>
      </section>

      <section className="certificateList">
        {visibleCourses.map((course, index) => (
          <div className="certificateCard" key={course.slug}>
            <div>
              <p className="eyebrow">
                {getOrganization(course.organizationSlugs[0])?.name ?? "SACF"} · {course.vertical}
              </p>
              <h3>{course.title}</h3>
              <p>{course.certificate}</p>
            </div>
            <div className="certificateMeta">
              <div>
                <strong>{course.progress}%</strong>
                <span>{t.progress}</span>
              </div>
              <span className="statusTag">
                {course.progress === 100 ? t.issued : index === 0 ? t.inProgress : t.pending}
              </span>
            </div>
            <div className="progressTrack">
              <div className="progressFill" style={{ width: `${course.progress}%` }} />
            </div>
            <div className="certificateFoot">
              <span>{interpolate(t.code, { code: `SACF-${course.slug.slice(0, 4).toUpperCase()}-${index + 1001}` })}</span>
              <span>{course.progress === 100 ? t.validUntil : t.awaitingCompletion}</span>
            </div>
            <div className="certificateActions">
              <button className="buttonGhost" type="button">
                {t.view}
              </button>
              <button className="buttonGhost" type="button">
                {t.history}
              </button>
            </div>
          </div>
        ))}
      </section>
    </>
  );
}
