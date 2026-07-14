import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAdminScope } from "@/lib/admin-scope";
import { getAdminLessonEditor } from "@/lib/data";
import { FileUpload } from "@/components/file-upload";
import { addQuizQuestion, deleteQuizQuestion, updateLesson } from "../../../actions";

export const dynamic = "force-dynamic";

export default async function LessonEditorPage({ params }: { params: Promise<{ courseId: string; lessonId: string }> }) {
  const { courseId, lessonId } = await params;
  const scope = await requireAdminScope();
  const lesson = await getAdminLessonEditor(courseId, lessonId, scope.isSacfAdmin ? undefined : scope.organizationSlug ?? undefined);
  if (!lesson) notFound();

  return (
    <>
      <div className="sectionHead">
        <div><p className="eyebrow">{lesson.moduleTitle}</p><h1>Editar aula</h1><p>Defina o formato, conteúdo e as regras desta etapa do curso.</p></div>
        <Link className="buttonGhost" href={`/admin/cursos/${courseId}`}>Voltar ao curso</Link>
      </div>

      <section className="split">
        <form className="detailPanel" action={updateLesson}>
          <h2>Conteúdo da aula</h2>
          <input name="courseId" type="hidden" value={courseId} /><input name="lessonId" type="hidden" value={lesson.id} />
          <label>Título<input className="field" name="title" defaultValue={lesson.title} required /></label>
          <label>Tipo de aula<select className="field" name="lessonType" defaultValue={lesson.lessonType}><option value="text">Texto</option><option value="video">Vídeo</option><option value="file">PDF ou documento</option><option value="quiz">Prova</option></select></label>
          <label>Descrição<textarea className="field" name="description" defaultValue={lesson.description ?? ""} /></label>
          <div className="formGrid">
            <label>Duração (minutos)<input className="field" name="durationMinutes" type="number" min="1" defaultValue={lesson.durationMinutes ?? ""} /></label>
            <label>Idioma<input className="field" name="language" defaultValue={lesson.language} /></label>
          </div>
          <label>Origem do vídeo<select className="field" name="videoProvider" defaultValue={lesson.videoProvider ?? ""}><option value="">Não se aplica</option><option value="unlisted_youtube">YouTube não listado</option><option value="vimeo">Vimeo</option><option value="mux">Mux</option><option value="cloud_storage">Armazenamento em nuvem</option><option value="external_url">URL externa</option></select></label>
          <label>URL do vídeo<input className="field" name="videoUrl" type="url" defaultValue={lesson.videoUrl ?? ""} placeholder="https://..." /></label>
          <FileUpload courseId={courseId} existingUrl={lesson.videoUrl} inputName="videoUploadUrl" kind="video" />
          <label>Texto da aula<textarea className="field" name="content" defaultValue={lesson.content ?? ""} placeholder="Escreva o conteúdo que o aluno verá." /></label>
          <label>URL do PDF ou documento<input className="field" name="attachmentUrl" type="url" defaultValue={lesson.attachmentUrl ?? ""} placeholder="https://..." /></label>
          <FileUpload courseId={courseId} existingUrl={lesson.attachmentUrl} inputName="attachmentUploadUrl" kind="document" />
          <label className="checkItem"><input name="required" type="checkbox" defaultChecked={lesson.required} /> Exigir esta aula para conclusão</label>
          <label className="checkItem"><input name="previewEnabled" type="checkbox" defaultChecked={lesson.previewEnabled} /> Liberar prévia no catálogo</label>
          <p className="formHint">Os documentos e vídeos são vinculados por URL. Assim, o administrador pode usar o provedor de armazenamento que preferir.</p>
          <button className="button" type="submit">Salvar aula</button>
        </form>

        <div className="detailPanel">
          <h2>Prova</h2>
          {lesson.lessonType !== "quiz" ? <p className="formHint">Altere o tipo da aula para “Prova” e salve para cadastrar questões.</p> : <>
            {lesson.questions.map((question, index) => <div className="moduleItem" key={question.id}><div className="sectionHead compactLibraryHead"><strong>{index + 1}. {question.question}</strong><form action={deleteQuizQuestion}><input name="courseId" type="hidden" value={courseId} /><input name="lessonId" type="hidden" value={lesson.id} /><input name="questionId" type="hidden" value={question.id} /><button className="dangerButton" type="submit">Excluir</button></form></div><ul>{question.options.map((option) => <li key={option.id}>{option.isCorrect ? "✓ " : ""}{option.optionText}</li>)}</ul></div>)}
            <form action={addQuizQuestion}>
              <input name="courseId" type="hidden" value={courseId} /><input name="lessonId" type="hidden" value={lesson.id} />
              <label>Pergunta<textarea className="field" name="question" required /></label>
              <input className="field" name="optionA" placeholder="Alternativa A" required /><input className="field" name="optionB" placeholder="Alternativa B" required /><input className="field" name="optionC" placeholder="Alternativa C (opcional)" /><input className="field" name="optionD" placeholder="Alternativa D (opcional)" />
              <label>Resposta correta<select className="field" name="correctOption" defaultValue="0"><option value="0">Alternativa A</option><option value="1">Alternativa B</option><option value="2">Alternativa C</option><option value="3">Alternativa D</option></select></label>
              <button className="button" type="submit">Adicionar questão</button>
            </form>
          </>}
        </div>
      </section>
    </>
  );
}
