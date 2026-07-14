"use client";

import { useMemo, useState, useTransition } from "react";
import { completeLesson, submitQuiz, type LearningCourse } from "@/lib/learning";

export function LearningPlayer({ course }: { course: LearningCourse }) {
  const [lessons, setLessons] = useState(course.lessons);
  const [currentLessonId, setCurrentLessonId] = useState(
    course.lessons.find((lesson) => lesson.status !== "completed")?.id ?? course.lessons[0]?.id
  );
  const [isPending, startTransition] = useTransition();
  const [quizAnswers, setQuizAnswers] = useState<Record<string, string>>({});
  const [quizFeedback, setQuizFeedback] = useState<string | null>(null);
  const currentLesson = lessons.find((lesson) => lesson.id === currentLessonId) ?? lessons[0];
  const completedLessons = lessons.filter((lesson) => lesson.status === "completed").length;
  const progress = lessons.length ? Math.round((completedLessons / lessons.length) * 100) : 0;
  const groupedLessons = useMemo(
    () => Array.from(new Set(lessons.map((lesson) => lesson.moduleTitle))).map((title) => ({
      title,
      lessons: lessons.filter((lesson) => lesson.moduleTitle === title)
    })),
    [lessons]
  );

  if (!currentLesson) return null;

  function markCurrentLessonComplete() {
    startTransition(async () => {
      const result = await completeLesson(course.slug, currentLesson.id);
      if (!result.ok) return;
      setLessons((current) =>
        current.map((lesson) =>
          lesson.id === currentLesson.id
            ? { ...lesson, status: "completed", progressPercent: 100 }
            : lesson
        )
      );
      const nextLesson = lessons.find((lesson) => lesson.id !== currentLesson.id && lesson.status !== "completed");
      if (nextLesson) setCurrentLessonId(nextLesson.id);
    });
  }

  function submitCurrentQuiz() {
    setQuizFeedback(null);
    startTransition(async () => {
      if (currentLesson.questions.some((question) => !quizAnswers[question.id])) {
        setQuizFeedback("Responda todas as questões antes de enviar.");
        return;
      }
      const answers = Object.fromEntries(currentLesson.questions.map((question) => [question.id, quizAnswers[question.id]]));
      const result = await submitQuiz(course.slug, currentLesson.id, answers);
      if (!result.ok) {
        setQuizFeedback("Não foi possível corrigir a prova. Tente novamente.");
        return;
      }
      if (!result.passed) {
        setQuizFeedback(`Você acertou ${result.score}%. A nota mínima é ${result.passingScore}%. Revise o conteúdo e tente novamente.`);
        return;
      }
      setQuizFeedback(`Prova aprovada: ${result.score}% de acerto.`);
      setLessons((current) => current.map((lesson) => lesson.id === currentLesson.id ? { ...lesson, status: "completed", progressPercent: 100 } : lesson));
    });
  }

  return (
    <section className="playerShell">
      <aside className="playerSidebar">
        <p className="eyebrow">{course.title}</p>
        <div className="progressTrack"><div className="progressFill" style={{ width: `${progress}%` }} /></div>
        <p>{progress}% concluído</p>
        {groupedLessons.map((module) => (
          <div className="moduleList" key={module.title}>
            <h3>{module.title}</h3>
            {module.lessons.map((lesson) => (
              <button
                className="lessonButton"
                data-state={lesson.id === currentLesson.id ? "current" : lesson.status === "completed" ? "done" : "open"}
                key={lesson.id}
                onClick={() => setCurrentLessonId(lesson.id)}
                type="button"
              >
                {lesson.title}
              </button>
            ))}
          </div>
        ))}
      </aside>
      <div className="playerMain">
        {currentLesson.lessonType === "video" ? <div className="videoSurface">{currentLesson.videoUrl ? <a className="buttonGhost" href={currentLesson.videoUrl} rel="noreferrer" target="_blank">Assistir ao vídeo</a> : <span className="videoPlay" aria-hidden="true" />}</div> : null}
        <div className="sectionHead">
          <div>
            <p className="eyebrow">{course.instructor}</p>
            <h1>{currentLesson.title}</h1>
            <p>{currentLesson.description ?? "Conclua esta aula para registrar seu avanço no curso."}</p>
          </div>
        </div>
        <div className="lessonOps">
          <div><strong>Tempo estimado</strong><span>{currentLesson.durationMinutes ? `${currentLesson.durationMinutes} min` : "Aula"}</span></div>
          <div><strong>Status</strong><span>{currentLesson.status === "completed" ? "Concluída" : "Em andamento"}</span></div>
          <div><strong>Certificação</strong><span>{course.certificate}</span></div>
        </div>
        {currentLesson.content ? <div className="detailPanel"><h2>Conteúdo</h2><p>{currentLesson.content}</p></div> : null}
        {currentLesson.attachmentUrl ? <div className="actions"><a className="buttonGhost" href={currentLesson.attachmentUrl} rel="noreferrer" target="_blank">Abrir material complementar</a></div> : null}
        {currentLesson.lessonType === "quiz" ? <section className="detailPanel">
          <h2>Prova</h2>
          <p className="formHint">Nota mínima: {course.passingScore ?? 0}%.</p>
          {currentLesson.questions.map((question, index) => <fieldset key={question.id}><legend>{index + 1}. {question.question}</legend>{question.options.map((option) => <label className="checkItem" key={option.id}><input checked={quizAnswers[question.id] === option.id} name={question.id} onChange={() => setQuizAnswers((current) => ({ ...current, [question.id]: option.id }))} type="radio" /> {option.optionText}</label>)}</fieldset>)}
          {quizFeedback ? <p className="formHint">{quizFeedback}</p> : null}
          <button className="button" disabled={isPending || currentLesson.status === "completed" || !currentLesson.questions.length} onClick={submitCurrentQuiz} type="button">{currentLesson.status === "completed" ? "Prova aprovada" : isPending ? "Corrigindo..." : "Enviar prova"}</button>
        </section> : null}
        <div className="actions">
          {currentLesson.lessonType !== "quiz" ? <button className="button" disabled={isPending || currentLesson.status === "completed"} onClick={markCurrentLessonComplete} type="button">
            {currentLesson.status === "completed" ? "Aula concluída" : isPending ? "Salvando..." : "Marcar como concluída"}
          </button> : null}
        </div>
      </div>
    </section>
  );
}
