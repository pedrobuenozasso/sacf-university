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
              <div className="courseIdentity" data-label={t.course}>
                {course.id ? <Link href={`/admin/cursos/${course.id}`}>{course.title}</Link> : <strong>{course.title}</strong>}
                <p>{course.duration} · {course.certificate}</p>
              </div>
              <span className="courseMetaCell" data-label={t.vertical}>{course.vertical}</span>
              <span className="courseMetaCell" data-label={t.level}>{course.level}</span>
              <span className="courseMetaCell courseLessonCount" data-label={t.lessons}>{course.lessons}</span>
              <div className="courseStatusControl" data-label={t.status}>
                <span className="statusTag">{course.publicationStatus === "draft" ? t.draft : course.publicationStatus === "archived" ? t.archived : t.published}</span>
                <form className="courseRowActions" action={setCourseStatus}>
                  <input name="courseId" type="hidden" value={course.id} />
                  {course.publicationStatus !== "published" ? <button className="tableAction" name="status" type="submit" value="published">{t.publish}</button> : null}
                  {course.publicationStatus !== "archived" ? <button className="tableAction" name="status" type="submit" value="archived">{t.archive}</button> : null}
                </form>
              </div>
            </div>
          ))}
          {courses.length === 0 ? <div className="tableEmpty"><strong>{t.emptyTitle}</strong><span>{t.emptyBody}</span></div> : null}
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
          <label>{t.nameLabel}<input className="field" name="title" placeholder={t.titlePlaceholder} required /></label>
          {scope.isSacfAdmin ? (
            <label>{t.ownerLabel}<select className="field" name="organizationSlug" defaultValue="" required>
              <option value="" disabled>{t.ownerLabel}</option>
              {organizations.map((organization) => <option key={organization.slug} value={organization.slug}>{organization.name}</option>)}
            </select></label>
          ) : null}
          <label>{t.verticalGroupLabel}<select className="field" name="verticalGroupId" defaultValue="">
            <option value="">{t.selectVertical}</option>
            {groups.map((group) => <option key={group.id} value={group.id}>{group.name}{scope.isSacfAdmin ? ` · ${group.organizationSlug}` : ""}</option>)}
          </select><small>{t.groupAccessHint}</small></label>
          <label>{t.newVerticalLabel} <small>{t.newVerticalHint}</small><input className="field" name="newVertical" placeholder={t.newVerticalPlaceholder} /></label>
          <label>{t.audienceLabel}<select className="field" name="audienceScope" defaultValue="group"><option value="group">{t.audienceGroup}</option><option value="all_verticals">{t.audienceAll}</option></select><small>{t.audienceHint}</small></label>
          <label>{t.instructorLabel}<input className="field" name="instructor" placeholder={t.instructorPlaceholder} /></label>
          <label>{t.levelLabel}<select className="field" name="level" defaultValue="Essencial">
            <option value="Essencial">{t.levelEssential}</option>
            <option value="Intermediário">{t.levelIntermediate}</option>
            <option value="Avançado">{t.levelAdvanced}</option>
          </select></label>
          <div className="formGrid">
            <label>
              {t.workloadLabel}
              <input className="field" name="workloadHours" type="number" min="0" step="0.5" placeholder={t.hoursPlaceholder} />
            </label>
            <label>
              {t.validityLabel}
              <input className="field" name="validityMonths" type="number" min="1" step="1" placeholder="Ex.: 12" />
            </label>
            <label>
              {t.passingScoreLabel}
              <input className="field" name="passingScore" type="number" min="0" max="100" step="1" placeholder="Ex.: 70" />
            </label>
          </div>
          <label>{t.languageLabel}<select className="field" name="language" defaultValue="pt-BR">
            {supportedLocales.map((locale) => (
              <option key={locale.code} value={locale.code}>
                {locale.label}
              </option>
            ))}
          </select></label>
          <label>{t.summaryLabel}<textarea className="field" name="summary" placeholder={t.summaryPlaceholder} /></label>
          <label>{t.initialContentLabel}<small>{t.initialContentHint}</small><textarea className="field" name="lessons" placeholder={t.contentPlaceholder} /></label>
          <label className="checkItem"><input name="certificateEnabled" type="checkbox" defaultChecked /> {t.certificateEnabled}</label>
          <label className="checkItem"><input name="mandatory" type="checkbox" /> {t.mandatory}</label>
          <div className="actions noTopMargin">
            <button className="button" name="intent" type="submit" value="draft">
              {t.saveDraft}
            </button>
            <button className="buttonGhost" name="intent" type="submit" value="publish">
              {t.publish}
            </button>
          </div>
          <p className="formHint">{t.hint}</p>
          <p className="formHint">{t.noExpiryHint}</p>
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
