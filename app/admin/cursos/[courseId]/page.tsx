import Link from "next/link";
import { notFound } from "next/navigation";
import { supportedLocales } from "@/lib/i18n";
import { requireAdminScope } from "@/lib/admin-scope";
import { getAdminCourseEditor, getCourseAssignmentOptions } from "@/lib/data";
import { addLesson, addModule, assignCourse, deleteLesson, deleteModule, updateCourse } from "../actions";

export const dynamic = "force-dynamic";

export default async function CourseEditorPage({ params }: { params: Promise<{ courseId: string }> }) {
  const { courseId } = await params;
  const scope = await requireAdminScope();
  const organizationSlug = scope.isSacfAdmin ? undefined : scope.organizationSlug ?? undefined;
  const [course, assignmentOptions] = await Promise.all([
    getAdminCourseEditor(courseId, organizationSlug),
    getCourseAssignmentOptions(courseId, organizationSlug)
  ]);
  if (!course) notFound();

  return (
    <>
      <div className="sectionHead">
        <div>
          <p className="eyebrow">Editor de curso</p>
          <h1>{course.title}</h1>
          <p>Edite as informações e organize os módulos e aulas deste treinamento.</p>
        </div>
        <Link className="buttonGhost" href="/admin/cursos">Voltar aos cursos</Link>
      </div>

      <section className="split">
        <form className="detailPanel" action={updateCourse}>
          <h2>Informações do curso</h2>
          <input name="courseId" type="hidden" value={course.id} />
          <input className="field" name="title" defaultValue={course.title} required />
          <input className="field" name="instructor" defaultValue={course.instructorName ?? ""} placeholder="Instrutor" />
          <div className="formGrid">
            <input className="field" name="vertical" defaultValue={course.vertical} required />
            <select className="field" name="level" defaultValue={course.level}>
              <option value="Essencial">Essencial</option><option value="Intermediário">Intermediário</option><option value="Avançado">Avançado</option>
            </select>
          </div>
          <div className="formGrid">
            <input className="field" name="workloadHours" type="number" min="0" step="0.5" defaultValue={course.workloadMinutes ? course.workloadMinutes / 60 : ""} placeholder="Carga horária (horas)" />
            <input className="field" name="validityMonths" type="number" min="0" defaultValue={course.certificateValidityDays ? Math.round(course.certificateValidityDays / 30) : ""} placeholder="Validade (meses)" />
          </div>
          <select className="field" name="language" defaultValue={course.language}>
            {supportedLocales.map((locale) => <option key={locale.code} value={locale.code}>{locale.label}</option>)}
          </select>
          <textarea className="field" name="summary" defaultValue={course.shortDescription ?? ""} placeholder="Resumo do curso" />
          <label className="checkItem"><input name="certificateEnabled" type="checkbox" defaultChecked={course.certificateEnabled} /> Emitir certificado ao concluir</label>
          <label className="checkItem"><input name="mandatory" type="checkbox" defaultChecked={course.mandatory} /> Curso obrigatório</label>
          <button className="button" type="submit">Salvar alterações</button>
        </form>

        <div className="detailPanel">
          <h2>Estrutura do curso</h2>
          {course.modules.map((module) => (
            <div className="moduleItem" key={module.id}>
              <div className="sectionHead compactLibraryHead">
                <h3>{module.title}</h3>
                <form action={deleteModule}><input name="courseId" type="hidden" value={course.id} /><input name="moduleId" type="hidden" value={module.id} /><button className="dangerButton" type="submit">Excluir módulo</button></form>
              </div>
              <ul>
                {module.lessons.map((lesson) => (
                  <li key={lesson.id}>{lesson.title} <form className="inlineForm" action={deleteLesson}><input name="courseId" type="hidden" value={course.id} /><input name="lessonId" type="hidden" value={lesson.id} /><button type="submit">Excluir</button></form></li>
                ))}
              </ul>
              <form className="formGrid" action={addLesson}>
                <input name="courseId" type="hidden" value={course.id} /><input name="moduleId" type="hidden" value={module.id} />
                <input className="field" name="title" placeholder="Título da nova aula" required />
                <button className="buttonGhost" type="submit">Adicionar aula</button>
              </form>
            </div>
          ))}
          <form className="formGrid" action={addModule}>
            <input name="courseId" type="hidden" value={course.id} /><input className="field" name="title" placeholder="Título do novo módulo" required />
            <button className="button" type="submit">Adicionar módulo</button>
          </form>
        </div>
      </section>

      <section className="split">
        <div className="detailPanel">
          <h2>Atribuir a uma pessoa</h2>
          <p className="formHint">A matrícula é criada com o prazo informado e fica disponível no catálogo do aluno.</p>
          <form action={assignCourse}>
            <input name="courseId" type="hidden" value={course.id} /><input name="targetType" type="hidden" value="user" />
            <select className="field" name="targetId" defaultValue="" required>
              <option value="" disabled>Selecione uma pessoa</option>
              {assignmentOptions.users.map((user) => <option key={user.id} value={user.id}>{user.name} · {user.email}</option>)}
            </select>
            <input className="field" name="dueDate" type="date" />
            <button className="button" type="submit">Atribuir curso</button>
          </form>
        </div>
        <div className="detailPanel">
          <h2>Atribuir a um grupo</h2>
          <p className="formHint">Todos os membros ativos do grupo recebem uma matrícula. Novos membros podem ser atribuídos novamente quando necessário.</p>
          <form action={assignCourse}>
            <input name="courseId" type="hidden" value={course.id} /><input name="targetType" type="hidden" value="group" />
            <select className="field" name="targetId" defaultValue="" required>
              <option value="" disabled>Selecione um grupo</option>
              {assignmentOptions.groups.map((group) => <option key={group.id} value={group.id}>{group.name}</option>)}
            </select>
            <input className="field" name="dueDate" type="date" />
            <button className="button" type="submit">Atribuir ao grupo</button>
          </form>
        </div>
      </section>
    </>
  );
}
