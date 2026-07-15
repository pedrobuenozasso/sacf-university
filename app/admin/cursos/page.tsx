import { getAdminCourses, getAdminGroups, getOrganizations } from "@/lib/data";
import { supportedLocales } from "@/lib/i18n";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { requireAdminScope } from "@/lib/admin-scope";
import { createCourse, setCourseStatus } from "./actions";
import Link from "next/link";
import { interpolate } from "@/lib/i18n/interpolate";

export const dynamic = "force-dynamic";

export default async function AdminCoursesPage() {
  const scope = await requireAdminScope();
  const organizationSlug = scope.isSacfAdmin ? undefined : scope.organizationSlug ?? undefined;
  const [courses, organizations, groups, { dict }] = await Promise.all([
    getAdminCourses(organizationSlug),
    getOrganizations(organizationSlug),
    getAdminGroups(organizationSlug),
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

      <div className="adminListMeta">
        <strong>{interpolate(t.scopeCount, { count: courses.length, suffix: courses.length === 1 ? "" : "s" })}</strong>
        <span>{t.scopeHint}</span>
      </div>

      <section className="split">
        <div className="tablePanel coursesTable">
          <div className="tableHead">
            <span>{t.course}</span>
            <span>{t.vertical}</span>
            <span>{t.level}</span>
            <span>{t.lessons}</span>
            <span>{t.status}</span>
          </div>
          {courses.map((course) => (
            <div className="tableRow" key={course.slug}>
              <div className="courseIdentity">
                {course.id ? <Link href={`/admin/cursos/${course.id}`}>{course.title}</Link> : <strong>{course.title}</strong>}
                <p>{course.duration} · {course.certificate}</p>
              </div>
              <span className="courseMetaCell">{course.vertical}</span>
              <span className="courseMetaCell">{course.level}</span>
              <span className="courseMetaCell courseLessonCount">{course.lessons}</span>
              <div className="courseStatusControl">
                <span className="statusTag">{course.publicationStatus === "draft" ? t.draft : course.publicationStatus === "archived" ? t.archived : t.published}</span>
                <form className="courseRowActions" action={setCourseStatus}>
                  <input name="courseId" type="hidden" value={course.id} />
                  {course.publicationStatus !== "published" ? <button className="tableAction" name="status" type="submit" value="published">{t.publish}</button> : null}
                  {course.publicationStatus !== "archived" ? <button className="tableAction" name="status" type="submit" value="archived">{t.archive}</button> : null}
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
          <label>Nome do curso<input className="field" name="title" placeholder={t.titlePlaceholder} required /></label>
          {scope.isSacfAdmin ? (
            <label>Empresa proprietária<select className="field" name="organizationSlug" defaultValue="" required>
              <option value="" disabled>Empresa proprietária</option>
              {organizations.map((organization) => <option key={organization.slug} value={organization.slug}>{organization.name}</option>)}
            </select></label>
          ) : null}
          <label>Vertical e grupo de acesso<select className="field" name="verticalGroupId" defaultValue="">
            <option value="">Selecione uma vertical</option>
            {groups.map((group) => <option key={group.id} value={group.id}>{group.name}{scope.isSacfAdmin ? ` · ${group.organizationSlug}` : ""}</option>)}
          </select><small>O curso será liberado automaticamente para os membros deste grupo.</small></label>
          <label>Nova vertical <small>Opcional: use para criar uma nova vertical e o grupo correspondente.</small><input className="field" name="newVertical" placeholder="Ex.: Desenvolvedor" /></label>
          <label>Público do curso<select className="field" name="audienceScope" defaultValue="group"><option value="group">Somente a vertical selecionada</option><option value="all_verticals">Todas as verticais da empresa</option></select><small>Em “Todas as verticais”, qualquer pessoa ativa da empresa poderá acessar o curso.</small></label>
          <label>Responsável pelo conteúdo<input className="field" name="instructor" placeholder={t.instructorPlaceholder} /></label>
          <label>Nível<select className="field" name="level" defaultValue="Essencial">
            <option value="Essencial">Essencial</option>
            <option value="Intermediário">Intermediário</option>
            <option value="Avançado">Avançado</option>
          </select></label>
          <div className="formGrid">
            <label>
              Carga horária (horas)
              <input className="field" name="workloadHours" type="number" min="0" step="0.5" placeholder={t.hoursPlaceholder} />
            </label>
            <label>
              Validade do certificado (meses)
              <input className="field" name="validityMonths" type="number" min="1" step="1" placeholder="Ex.: 12" />
            </label>
            <label>
              Nota mínima da prova (%)
              <input className="field" name="passingScore" type="number" min="0" max="100" step="1" placeholder="Ex.: 70" />
            </label>
          </div>
          <label>Idioma principal<select className="field" name="language" defaultValue="pt-BR">
            {supportedLocales.map((locale) => (
              <option key={locale.code} value={locale.code}>
                {locale.label}
              </option>
            ))}
          </select></label>
          <label>Resumo do curso<textarea className="field" name="summary" placeholder={t.summaryPlaceholder} /></label>
          <label>Conteúdo inicial<small>Inclua uma aula por linha. Você poderá estruturar módulos depois.</small><textarea className="field" name="lessons" placeholder={`${t.contentPlaceholder} (uma aula por linha)`} /></label>
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
