import { notFound } from "next/navigation";
import { CoursePreviewPanel } from "@/components/course-card";
import { getCourseForCurrentUser } from "@/lib/data";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { interpolate } from "@/lib/i18n/interpolate";
import { startCourse } from "@/lib/learning";

export const dynamic = "force-dynamic";

export default async function CourseDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [course, { dict }] = await Promise.all([getCourseForCurrentUser(slug), getDictionary()]);
  const t = dict.courseDetail;

  if (!course) {
    notFound();
  }

  return (
    <section className="split">
      <div className="detailPanel">
        <p className="eyebrow">{course.vertical}</p>
        <h1>{course.title}</h1>
        <p className="lead">{course.summary}</p>
        <div className="meta">
          <span>{course.level}</span>
          <span>{course.language}</span>
          <span>{course.duration}</span>
          <span>
            {course.lessons} {t.lessons}
          </span>
          <span>{course.certificate}</span>
        </div>

        <h2>{t.learnTitle}</h2>
        <p>{t.learnBody}</p>

        <h2>{t.contentTitle}</h2>
        <div className="moduleList">
          {course.modules.map((module) => (
            <div className="moduleItem" key={module.title}>
              <h3>{module.title}</h3>
              <ul>
                {module.lessons.map((lesson) => (
                  <li key={lesson}>{lesson}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <aside className="detailPanel">
        <CoursePreviewPanel label={t.summaryLabel} />
        <h3>{t.includedTitle}</h3>
        <div className="meta">
          <span>{course.duration}</span>
          <span>
            {course.lessons} {t.lessons}
          </span>
          <span>{course.certificate}</span>
        </div>
        <p>
          {interpolate(t.audience, { audience: course.audience })}
          <br />
          {interpolate(t.instructor, { instructor: course.instructor })}
        </p>
        <form action={startCourse}>
          <input name="courseSlug" type="hidden" value={course.slug} />
          <button className="button" type="submit">{t.start}</button>
        </form>
      </aside>
    </section>
  );
}
