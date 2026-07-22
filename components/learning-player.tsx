"use client";

import Link from "next/link";
import { useMemo, useState, useTransition } from "react";
import { completeLesson, submitQuiz, type LearningCourse } from "@/lib/learning";
import { interpolate, useLocale } from "@/components/locale-provider";

export function LearningPlayer({ course }: { course: LearningCourse }) {
  const { dict } = useLocale();
  const t = dict.learn;
  const [lessons, setLessons] = useState(course.lessons);
  const [currentLessonId, setCurrentLessonId] = useState(
    course.lessons.find((lesson) => lesson.status !== "completed")?.id ?? course.lessons[0]?.id
  );
  const [isPending, startTransition] = useTransition();
  const [quizAnswers, setQuizAnswers] = useState<Record<string, string>>({});
  const [quizFeedback, setQuizFeedback] = useState<string | null>(null);
  const [courseCompletion, setCourseCompletion] = useState<{ certificateIssued: boolean } | null>(null);
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
      if (result.completed) setCourseCompletion({ certificateIssued: result.certificateIssued });
      const nextLesson = lessons.find((lesson) => lesson.id !== currentLesson.id && lesson.status !== "completed");
      if (nextLesson) setCurrentLessonId(nextLesson.id);
    });
  }

  function submitCurrentQuiz() {
    setQuizFeedback(null);
    startTransition(async () => {
      if (currentLesson.questions.some((question) => !quizAnswers[question.id])) {
        setQuizFeedback(t.answerAll);
        return;
      }
      const answers = Object.fromEntries(currentLesson.questions.map((question) => [question.id, quizAnswers[question.id]]));
      const result = await submitQuiz(course.slug, currentLesson.id, answers);
      if (!result.ok) {
        setQuizFeedback(t.examError);
        return;
      }
      if (!result.passed) {
        setQuizFeedback(interpolate(t.examFailed, { score: result.score, passingScore: result.passingScore }));
        return;
      }
      setQuizFeedback(interpolate(t.examPassed, { score: result.score }));
      setLessons((current) => current.map((lesson) => lesson.id === currentLesson.id ? { ...lesson, status: "completed", progressPercent: 100 } : lesson));
      if (result.completed) setCourseCompletion({ certificateIssued: result.certificateIssued });
    });
  }

  return (
    <section className="playerShell">
      <aside className="playerSidebar">
        <p className="eyebrow">{course.title}</p>
        <div className="progressTrack"><div className="progressFill" style={{ width: `${progress}%` }} /></div>
        <p>{progress}{t.completed}</p>
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
        {currentLesson.lessonType === "video" ? <div className="videoSurface">{currentLesson.videoUrl ? <a className="buttonGhost" href={currentLesson.videoUrl} rel="noreferrer" target="_blank">{t.watchVideo}</a> : <span className="videoPlay" aria-hidden="true" />}</div> : null}
        <div className="sectionHead">
          <div>
            <p className="eyebrow">{course.instructor}</p>
            <h1>{currentLesson.title}</h1>
            <p>{currentLesson.description ?? t.lessonFallback}</p>
          </div>
        </div>
        <div className="lessonOps">
          <div><strong>{t.estimatedTime}</strong><span>{currentLesson.durationMinutes ? `${currentLesson.durationMinutes} min` : t.lesson}</span></div>
          <div><strong>{t.status}</strong><span>{currentLesson.status === "completed" ? t.completedLesson : t.inProgress}</span></div>
          <div><strong>{t.certification}</strong><span>{course.certificate}</span></div>
        </div>
        {currentLesson.content ? <article className="lessonContent"><p className="eyebrow">{t.lessonMaterial}</p><h2>{t.content}</h2><div>{currentLesson.content}</div></article> : null}
        {currentLesson.attachmentUrl ? <div className="actions"><a className="buttonGhost" href={currentLesson.attachmentUrl} rel="noreferrer" target="_blank">{t.openAttachment}</a></div> : null}
        {currentLesson.lessonType === "quiz" ? <section className="quizPanel">
          <h2>{t.exam}</h2>
          <p className="formHint">{interpolate(t.passingScore, { score: course.passingScore ?? 0 })}</p>
          {currentLesson.questions.map((question, index) => <fieldset key={question.id}><legend>{index + 1}. {question.question}</legend>{question.options.map((option) => <label className="quizOption" key={option.id}><input checked={quizAnswers[question.id] === option.id} name={question.id} onChange={() => setQuizAnswers((current) => ({ ...current, [question.id]: option.id }))} type="radio" /> <span>{option.optionText}</span></label>)}</fieldset>)}
          {quizFeedback ? <p className="formHint">{quizFeedback}</p> : null}
          <button className="button" disabled={isPending || currentLesson.status === "completed" || !currentLesson.questions.length} onClick={submitCurrentQuiz} type="button">{currentLesson.status === "completed" ? t.examApproved : isPending ? t.grading : t.submitExam}</button>
        </section> : null}
        <div className="actions">
          {currentLesson.lessonType !== "quiz" ? <button className="button" disabled={isPending || currentLesson.status === "completed"} onClick={markCurrentLessonComplete} type="button">
            {currentLesson.status === "completed" ? t.lessonCompleted : isPending ? t.saving : t.markComplete}
          </button> : null}
        </div>
      </div>
      {courseCompletion ? <div className="courseCompletionOverlay" role="dialog" aria-modal="true" aria-labelledby="course-completion-title">
        <section className="courseCompletionCard">
          <div className="completionSeal" aria-hidden="true">✓</div>
          <p className="eyebrow">{t.courseCompletedEyebrow}</p>
          <h2 id="course-completion-title">{t.courseCompletedTitle}</h2>
          <p>{t.courseCompletedBody}</p>
          <p className="completionCertificate">{courseCompletion.certificateIssued ? t.certificateIssued : t.certificateNotIssued}</p>
          <div className="completionActions"><Link className="button" href="/meus-cursos">{t.backToMyCourses}</Link><Link className="buttonGhost" href="/home">{t.goToHome}</Link></div>
        </section>
      </div> : null}
    </section>
  );
}
