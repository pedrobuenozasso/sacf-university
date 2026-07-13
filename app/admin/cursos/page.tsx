import { getAdminCourses, getOrganizations } from "@/lib/data";
import { supportedLocales } from "@/lib/i18n";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { requireAdminScope } from "@/lib/admin-scope";
import { createCourse, setCourseStatus } from "./actions";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AdminCoursesPage() {
  const scope = await requireAdminScope();
  const organizationSlug = scope.isSacfAdmin ? undefined : scope.organizationSlug ?? undefined;
  const [courses, organizations, { dict }] = await Promise.all([
    getAdminCourses(organizationSlug),
    getOrganizations(organizationSlug),
    getDictionary()
  ]);
  const t = dict.admin.cursos;
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
                {course.id ? <Link href={`/admin/cursos/${course.id}`}>{course.title}</Link> : <strong>{course.title}</strong>}
                <p>{course.duration} · {course.certificate}</p>
              </div>
              <span>{course.vertical}</span>
              <span>{course.level}</span>
              <span>{course.lessons}</span>
              <div>
                <span className="statusTag">{course.publicationStatus === "draft" ? "Rascunho" : course.publicationStatus === "archived" ? "Arquivado" : "Publicado"}</span>
                <form className="courseRowActions" action={setCourseStatus}>
                  <input name="courseId" type="hidden" value={course.id} />
                  {course.publicationStatus !== "published" ? <button name="status" type="submit" value="published">Publicar</button> : null}
                  {course.publicationStatus !== "archived" ? <button name="status" type="submit" value="archived">Arquivar</button> : null}
                </form>
              </div>
            </div>
          ))}
        </div>

        <form className="detailPanel" action={createCourse}>
          <div className="formStatus">
            <span className="statusDot" />
            <div>
              <strong>{t.editorTitle}</strong>
              <small>{t.editorSub}</small>
            </div>
          </div>
          <h2>{t.newCourse}</h2>
          <input className="field" name="title" placeholder={t.titlePlaceholder} required />
          {scope.isSacfAdmin ? (
            <select className="field" name="organizationSlug" defaultValue="" required>
              <option value="" disabled>Empresa proprietária</option>
              {organizations.map((organization) => <option key={organization.slug} value={organization.slug}>{organization.name}</option>)}
            </select>
          ) : null}
          <select className="field" name="vertical" defaultValue="" required>
            <option value="" disabled>
              {t.verticalSelect}
            </option>
            <option>{t.operator}</option>
            <option>{t.mechanic}</option>
            <option>{t.electricFull}</option>
            <option>{t.trainer}</option>
            <option>{t.representative}</option>
          </select>
          <input className="field" name="instructor" placeholder={t.instructorPlaceholder} />
          <select className="field" name="level" defaultValue="Essencial">
            <option value="Essencial">Essencial</option>
            <option value="Intermediário">Intermediário</option>
            <option value="Avançado">Avançado</option>
          </select>
          <select className="field" defaultValue="empresa">
            <option value="empresa">{t.privateCourse}</option>
            <option value="sacf">{t.officialCourse}</option>
          </select>
          <div className="formGrid">
            <label>
              Carga horária (horas)
              <input className="field" name="workloadHours" type="number" min="0" step="0.5" placeholder={t.hoursPlaceholder} />
            </label>
            <label>
              Validade do certificado (meses)
              <input className="field" name="validityMonths" type="number" min="1" step="1" placeholder="Ex.: 12" />
            </label>
          </div>
          <select className="field" name="language" defaultValue="pt-BR">
            {supportedLocales.map((locale) => (
              <option key={locale.code} value={locale.code}>
                {locale.label}
              </option>
            ))}
          </select>
          <textarea className="field" name="summary" placeholder={t.summaryPlaceholder} />
          <textarea className="field" name="lessons" placeholder={`${t.contentPlaceholder} (uma aula por linha)`} />
          <label className="checkItem"><input name="certificateEnabled" type="checkbox" defaultChecked /> Emitir certificado ao concluir</label>
          <label className="checkItem"><input name="mandatory" type="checkbox" /> Curso obrigatório</label>
          <div className="actions noTopMargin">
            <button className="button" name="intent" type="submit" value="draft">
              {t.saveDraft}
            </button>
            <button className="buttonGhost" name="intent" type="submit" value="publish">
              {t.publish}
            </button>
          </div>
          <p className="formHint">{t.hint}</p>
          <p className="formHint">Deixe a validade em branco para um certificado sem vencimento.</p>
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
