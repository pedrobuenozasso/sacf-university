import Link from "next/link";
import { notFound } from "next/navigation";
import { supportedLocales } from "@/lib/i18n";
import { requireAdminScope } from "@/lib/admin-scope";
import { getAdminCourseEditor, getCourseAssignmentOptions } from "@/lib/data";
import { ConfirmSubmitButton } from "@/components/confirm-submit-button";
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

      <nav className="editorSteps" aria-label="Etapas do editor">
        <a href="#dados">1. Dados</a><a href="#estrutura">2. Estrutura</a><a href="#avaliacao">3. Avaliação</a><a href="#distribuicao">4. Distribuição</a>
      </nav>

      <section className="split">
        <form className="detailPanel" id="dados" action={updateCourse}>
          <p className="eyebrow">Etapa 1</p>
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
            <label>
              Carga horária (horas)
              <input className="field" name="workloadHours" type="number" min="0" step="0.5" defaultValue={course.workloadMinutes ? course.workloadMinutes / 60 : ""} />
            </label>
            <label>
              Validade do certificado (meses)
              <input className="field" name="validityMonths" type="number" min="1" defaultValue={course.certificateValidityDays ? Math.round(course.certificateValidityDays / 30) : ""} placeholder="Sem vencimento" />
            </label>
            <label id="avaliacao">
              Nota mínima da prova (%)
              <input className="field" name="passingScore" type="number" min="0" max="100" defaultValue={course.passingScore ?? ""} placeholder="Sem exigência" />
            </label>
          </div>
          <select className="field" name="language" defaultValue={course.language}>
            {supportedLocales.map((locale) => <option key={locale.code} value={locale.code}>{locale.label}</option>)}
          </select>
          <textarea className="field" name="summary" defaultValue={course.shortDescription ?? ""} placeholder="Resumo do curso" />
          <label className="checkItem"><input name="certificateEnabled" type="checkbox" defaultChecked={course.certificateEnabled} /> Emitir certificado ao concluir</label>
          <label className="checkItem"><input name="mandatory" type="checkbox" defaultChecked={course.mandatory} /> Curso obrigatório</label>
          <p className="formHint">A validade é aplicada aos certificados emitidos depois da alteração. A nota mínima será usada nas provas do curso.</p>
          <button className="button" type="submit">Salvar alterações</button>
        </form>

        <div className="detailPanel" id="estrutura">
          <p className="eyebrow">Etapa 2</p>
          <h2>Estrutura do curso</h2>
          {course.modules.map((module) => (
            <div className="moduleItem" key={module.id}>
              <div className="sectionHead compactLibraryHead">
                <h3>{module.title}</h3>
                <form action={deleteModule}><input name="courseId" type="hidden" value={course.id} /><input name="moduleId" type="hidden" value={module.id} /><ConfirmSubmitButton className="dangerButton" message="Excluir este módulo e todas as aulas dentro dele?">Excluir módulo</ConfirmSubmitButton></form>
              </div>
              <ul>
                {module.lessons.map((lesson) => (
                  <li key={lesson.id}><Link href={`/admin/cursos/${course.id}/aulas/${lesson.id}`}>{lesson.title}</Link> <span className="formHint">{lesson.lessonType === "quiz" ? "Prova" : lesson.lessonType === "file" ? "Documento" : lesson.lessonType === "video" ? "Vídeo" : "Texto"}</span> <form className="inlineForm" action={deleteLesson}><input name="courseId" type="hidden" value={course.id} /><input name="lessonId" type="hidden" value={lesson.id} /><ConfirmSubmitButton message="Excluir esta aula?">Excluir</ConfirmSubmitButton></form></li>
                ))}
              </ul>
              <form className="formGrid" action={addLesson}>
                <input name="courseId" type="hidden" value={course.id} /><input name="moduleId" type="hidden" value={module.id} />
                <input className="field" name="title" placeholder="Título da nova aula" required />
                <select className="field" name="lessonType" defaultValue="text"><option value="text">Texto</option><option value="video">Vídeo</option><option value="file">PDF ou documento</option><option value="quiz">Prova</option></select>
                <input className="field" name="durationMinutes" type="number" min="1" placeholder="Duração (min)" />
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

      <section className="split" id="distribuicao">
        <div className="detailPanel">
          <p className="eyebrow">Etapa 4</p>
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
