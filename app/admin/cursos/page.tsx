import { getCourses } from "@/lib/data";
import { supportedLocales } from "@/lib/i18n";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getAdminScope } from "@/lib/admin-scope";

export const dynamic = "force-dynamic";

export default async function AdminCoursesPage() {
  const [allCourses, { dict }, scope] = await Promise.all([
    getCourses(),
    getDictionary(),
    getAdminScope()
  ]);
  const t = dict.admin.cursos;
  const courses = scope.isSacfAdmin
    ? allCourses
    : allCourses.filter(
        (course) =>
          course.organizationSlugs.length === 0 ||
          course.organizationSlugs.includes(scope.organizationSlug ?? "")
      );
  return (
    <>
      <div className="sectionHead">
        <div>
          <p className="eyebrow">{t.eyebrow}</p>
          <h1>{t.title}</h1>
          <p>{t.body}</p>
        </div>
      </div>

      <div className="adminToolbar">
        <input className="field" placeholder={t.searchPlaceholder} />
        <select className="field" defaultValue="todos">
          <option value="todos">{t.allVerticals}</option>
          <option>{t.operator}</option>
          <option>{t.mechanic}</option>
          <option>{t.electric}</option>
          <option>{t.trainer}</option>
        </select>
        <button className="buttonGhost" type="button">
          {t.export}
        </button>
      </div>

      <section className="split">
        <div className="tablePanel">
          <div className="tableHead">
            <span>{t.course}</span>
            <span>{t.vertical}</span>
            <span>{t.level}</span>
            <span>{t.lessons}</span>
            <span>{t.status}</span>
          </div>
          {courses.map((course) => (
            <div className="tableRow" key={course.slug}>
              <div>
                <strong>{course.title}</strong>
                <p>{course.duration} · {course.certificate}</p>
              </div>
              <span>{course.vertical}</span>
              <span>{course.level}</span>
              <span>{course.lessons}</span>
              <span className="statusTag">{course.status}</span>
            </div>
          ))}
        </div>

        <form className="detailPanel">
          <div className="formStatus">
            <span className="statusDot" />
            <div>
              <strong>{t.editorTitle}</strong>
              <small>{t.editorSub}</small>
            </div>
          </div>
          <h2>{t.newCourse}</h2>
          <input className="field" placeholder={t.titlePlaceholder} />
          <label className="fileField">
            {t.coverLabel}
            <input className="field" type="file" accept="image/*" />
          </label>
          <select className="field" defaultValue="">
            <option value="" disabled>
              {t.verticalSelect}
            </option>
            <option>{t.operator}</option>
            <option>{t.mechanic}</option>
            <option>{t.electricFull}</option>
            <option>{t.trainer}</option>
            <option>{t.representative}</option>
          </select>
          <input className="field" placeholder={t.instructorPlaceholder} />
          <select className="field" defaultValue="empresa">
            <option value="empresa">{t.privateCourse}</option>
            <option value="sacf">{t.officialCourse}</option>
          </select>
          <div className="formGrid">
            <input className="field" placeholder={t.hoursPlaceholder} />
            <input className="field" placeholder={t.validityPlaceholder} />
          </div>
          <select className="field" defaultValue="pt-BR">
            {supportedLocales.map((locale) => (
              <option key={locale.code} value={locale.code}>
                {locale.label}
              </option>
            ))}
          </select>
          <textarea className="field" placeholder={t.summaryPlaceholder} />
          <textarea className="field" placeholder={t.contentPlaceholder} />
          <div className="actions noTopMargin">
            <button className="button" type="button">
              {t.saveDraft}
            </button>
            <button className="buttonGhost" type="button">
              {t.publish}
            </button>
            <button className="dangerButton" type="button">
              {t.delete}
            </button>
          </div>
          <p className="formHint">{t.hint}</p>
        </form>
      </section>

      <section className="detailPanel adminEditorPreview">
        <div className="sectionHead">
          <div>
            <p className="eyebrow">{t.previewEyebrow}</p>
            <h2>{t.previewTitle}</h2>
            <p>{t.previewBody}</p>
          </div>
        </div>
        <div className="grid">
          <div className="moduleItem">
            <h3>{t.identityTitle}</h3>
            <p>{t.identityBody}</p>
          </div>
          <div className="moduleItem">
            <h3>{t.contentTitle}</h3>
            <p>{t.contentBody}</p>
          </div>
          <div className="moduleItem">
            <h3>{t.accessTitle}</h3>
            <p>{t.accessBody}</p>
          </div>
          <div className="moduleItem">
            <h3>{t.libraryTitle}</h3>
            <p>{t.libraryBody}</p>
          </div>
          <div className="moduleItem">
            <h3>{t.governanceTitle}</h3>
            <p>{t.governanceBody}</p>
          </div>
        </div>
      </section>
    </>
  );
}
