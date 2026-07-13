"use client";

import { useMemo, useState, useTransition } from "react";
import { completeLesson, type LearningCourse } from "@/lib/learning";

export function LearningPlayer({ course }: { course: LearningCourse }) {
  const [lessons, setLessons] = useState(course.lessons);
  const [currentLessonId, setCurrentLessonId] = useState(
    course.lessons.find((lesson) => lesson.status !== "completed")?.id ?? course.lessons[0]?.id
  );
  const [isPending, startTransition] = useTransition();
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
        <div className="videoSurface"><span className="videoPlay" aria-hidden="true" /></div>
        <div className="sectionHead">
          <div>
            <p className="eyebrow">{course.instructor}</p>
            <h1>{currentLesson.title}</h1>
            <p>Conclua esta aula para registrar seu avanço no curso.</p>
          </div>
        </div>
        <div className="lessonOps">
          <div><strong>Tempo estimado</strong><span>{currentLesson.durationMinutes ? `${currentLesson.durationMinutes} min` : "Aula"}</span></div>
          <div><strong>Status</strong><span>{currentLesson.status === "completed" ? "Concluída" : "Em andamento"}</span></div>
          <div><strong>Certificação</strong><span>{course.certificate}</span></div>
        </div>
        <div className="actions">
          <button className="button" disabled={isPending || currentLesson.status === "completed"} onClick={markCurrentLessonComplete} type="button">
            {currentLesson.status === "completed" ? "Aula concluída" : isPending ? "Salvando..." : "Marcar como concluída"}
          </button>
        </div>
      </div>
    </section>
  );
}
