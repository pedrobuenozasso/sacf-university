import Link from "next/link";
import { notFound } from "next/navigation";
import { supportedLocales } from "@/lib/i18n";
import { requireAdminScope } from "@/lib/admin-scope";
import { getAdminCourseEditor, getAdminGroups, getCourseAssignmentOptions } from "@/lib/data";
import { ConfirmSubmitButton } from "@/components/confirm-submit-button";
import { FileUpload } from "@/components/file-upload";
import { addLesson, addModule, assignCourse, deleteLesson, deleteModule, updateCourse } from "../actions";

export const dynamic = "force-dynamic";

export default async function CourseEditorPage({ params }: { params: Promise<{ courseId: string }> }) {
  const { courseId } = await params;
  const scope = await requireAdminScope();
  const organizationSlug = scope.isSacfAdmin ? undefined : scope.organizationSlug ?? undefined;
  const [course, assignmentOptions, groups] = await Promise.all([
    getAdminCourseEditor(courseId, organizationSlug),
    getCourseAssignmentOptions(courseId, organizationSlug),
    getAdminGroups(organizationSlug)
  ]);
  if (!course) notFound();

  return (
    <div className="courseEditor">
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

      <section className="courseEditorLayout">
        <form className="detailPanel courseSettingsPanel" id="dados" action={updateCourse}>
          <p className="eyebrow">Etapa 1</p>
          <h2>Informações do curso</h2>
          <input name="courseId" type="hidden" value={course.id} />
          <label>Título do curso<input className="field" name="title" defaultValue={course.title} required /></label>
          <label>Responsável pelo conteúdo<input className="field" name="instructor" defaultValue={course.instructorName ?? ""} placeholder="Instrutor" /></label>
          <div className="formGrid">
            <label>Vertical e grupo de acesso<select className="field" name="verticalGroupId" defaultValue={groups.find((group) => group.name === course.vertical)?.id ?? ""}><option value="">Selecione uma vertical</option>{groups.map((group) => <option key={group.id} value={group.id}>{group.name}</option>)}</select></label>
            <label>Nível<select className="field" name="level" defaultValue={course.level}>
              <option value="Essencial">Essencial</option><option value="Intermediário">Intermediário</option><option value="Avançado">Avançado</option>
            </select></label>
          </div>
          <label>Nova vertical <small>Opcional. Ao informar, ela substitui a seleção acima e cria o grupo correspondente.</small><input className="field" name="newVertical" placeholder="Ex.: Desenvolvedor" /></label>
          <label>Público do curso<select className="field" name="audienceScope" defaultValue={course.organizationWide ? "all_verticals" : "group"}><option value="group">Somente a vertical selecionada</option><option value="all_verticals">Todas as verticais da empresa</option></select><small>Essa opção libera o curso para todos os grupos ativos da empresa.</small></label>
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
          <label>Idioma principal<select className="field" name="language" defaultValue={course.language}>
            {supportedLocales.map((locale) => <option key={locale.code} value={locale.code}>{locale.label}</option>)}
          </select></label>
          <label>Resumo do curso<textarea className="field" name="summary" defaultValue={course.shortDescription ?? ""} placeholder="Explique o objetivo e o resultado esperado deste treinamento." /></label>
          <label>Imagem de capa<small>Opcional. Ajuda a diferenciar o curso no catálogo.</small><FileUpload courseId={course.id} inputName="coverUrl" kind="image" existingUrl={course.coverUrl} /></label>
          <div className="settingsChecks"><label className="checkItem"><input name="certificateEnabled" type="checkbox" defaultChecked={course.certificateEnabled} /> Emitir certificado ao concluir</label><label className="checkItem"><input name="mandatory" type="checkbox" defaultChecked={course.mandatory} /> Curso obrigatório</label></div>
          <p className="formHint">A validade é aplicada aos certificados emitidos depois da alteração. A nota mínima será usada nas provas do curso.</p>
          <div className="editorFormFooter"><button className="button" type="submit">Salvar alterações</button></div>
        </form>

        <div className="detailPanel courseStructurePanel" id="estrutura">
          <p className="eyebrow">Etapa 2</p>
          <h2>Estrutura do curso</h2>
          <p className="formHint">Crie um módulo e adicione as aulas dentro dele. Clique no título de uma aula para editar o conteúdo.</p>
          <form className="addModuleForm" action={addModule}>
            <input name="courseId" type="hidden" value={course.id} /><label>Novo módulo<input className="field" name="title" placeholder="Ex.: Fundamentos e segurança" required /></label><button className="button" type="submit">Adicionar módulo</button>
          </form>
          {course.modules.map((module) => (
            <article className="moduleItem courseModuleCard" key={module.id}>
              <div className="moduleCardHeader">
                <div><span className="moduleCount">{module.lessons.length} aula{module.lessons.length === 1 ? "" : "s"}</span><h3>{module.title}</h3></div>
                <form action={deleteModule}><input name="courseId" type="hidden" value={course.id} /><input name="moduleId" type="hidden" value={module.id} /><ConfirmSubmitButton className="dangerButton" message="Excluir este módulo e todas as aulas dentro dele?">Excluir módulo</ConfirmSubmitButton></form>
              </div>
              <ul className="lessonAdminList">
                {module.lessons.map((lesson) => (
                  <li key={lesson.id}><Link href={`/admin/cursos/${course.id}/aulas/${lesson.id}`}>{lesson.title}<span>{lesson.lessonType === "quiz" ? "Prova" : lesson.lessonType === "file" ? "Documento" : lesson.lessonType === "video" ? "Vídeo" : "Texto"}</span></Link><form action={deleteLesson}><input name="courseId" type="hidden" value={course.id} /><input name="lessonId" type="hidden" value={lesson.id} /><ConfirmSubmitButton message="Excluir esta aula?">Excluir</ConfirmSubmitButton></form></li>
                ))}
              </ul>
              <form className="addLessonForm" action={addLesson}>
                <input name="courseId" type="hidden" value={course.id} /><input name="moduleId" type="hidden" value={module.id} />
                <label>Título da aula<input className="field" name="title" placeholder="Ex.: Uso seguro do equipamento" required /></label>
                <label>Formato<select className="field" name="lessonType" defaultValue="text"><option value="text">Texto</option><option value="video">Vídeo</option><option value="file">PDF ou documento</option><option value="quiz">Prova</option></select></label>
                <label>Duração (min)<input className="field" name="durationMinutes" type="number" min="1" placeholder="Ex.: 15" /></label>
                <button className="buttonGhost" type="submit">Adicionar aula</button>
              </form>
            </article>
          ))}
        </div>
      </section>

      <section className="courseAssignments" id="distribuicao">
        <div className="detailPanel assignmentPanel">
          <p className="eyebrow">Etapa 4</p>
          <h2>Atribuir a uma pessoa</h2>
          <p className="formHint">A matrícula é criada com o prazo informado e fica disponível no catálogo do aluno.</p>
          <form className="assignmentForm" action={assignCourse}>
            <input name="courseId" type="hidden" value={course.id} /><input name="targetType" type="hidden" value="user" />
            <select className="field" name="targetId" defaultValue="" required>
              <option value="" disabled>Selecione uma pessoa</option>
              {assignmentOptions.users.map((user) => <option key={user.id} value={user.id}>{user.name} · {user.email}</option>)}
            </select>
            <input className="field" name="dueDate" type="date" />
            <button className="button" type="submit">Atribuir curso</button>
          </form>
        </div>
        <div className="detailPanel assignmentPanel">
          <h2>Atribuir a um grupo</h2>
          <p className="formHint">Todos os membros ativos do grupo recebem uma matrícula. Novos membros podem ser atribuídos novamente quando necessário.</p>
          <form className="assignmentForm" action={assignCourse}>
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
    </div>
  );
}
