import Link from "next/link";
import { notFound } from "next/navigation";
import { CoursePreviewPanel } from "@/components/course-card";
import { getOrganization } from "@/lib/courses";
import { getCourseBySlug } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function LearnPage({ params }: { params: Promise<{ courseId: string }> }) {
  const { courseId } = await params;
  const course = await getCourseBySlug(courseId);

  if (!course) {
    notFound();
  }

  const firstModule = course.modules[0];
  const currentLesson = firstModule?.lessons[0] ?? "Introdução ao curso";
  const ownerOrg = getOrganization(course.organizationSlugs[0]);

  return (
    <section className="playerShell">
      <aside className="playerSidebar">
        <p className="eyebrow">{ownerOrg?.name ?? "SACF"} · {course.vertical}</p>
        <h3>{course.title}</h3>
        <div className="progressTrack">
          <div className="progressFill" style={{ width: `${course.progress}%` }} />
        </div>
        <p>{course.progress}% concluído</p>
        {course.modules.map((module) => (
          <div className="moduleList" key={module.title}>
            <h3>{module.title}</h3>
            {module.lessons.map((lesson, index) => (
              <button
                className="lessonButton"
                data-state={lesson === currentLesson ? "current" : index === 0 ? "done" : "open"}
                key={lesson}
              >
                {lesson}
              </button>
            ))}
          </div>
        ))}
      </aside>
      <div className="playerMain">
        <div className="videoSurface">
          <CoursePreviewPanel label="Player privado" />
          <span className="videoPlay" aria-hidden="true" />
        </div>
        <div className="sectionHead">
          <div>
            <p className="eyebrow">{course.instructor}</p>
            <h1>{currentLesson}</h1>
            <p>
              Conteúdo privado do curso com acompanhamento de progresso, anexos e conclusão
              vinculada à certificação.
            </p>
          </div>
        </div>
        <div className="lessonOps">
          <div>
            <strong>Tempo estimado</strong>
            <span>12 min</span>
          </div>
          <div>
            <strong>Status</strong>
            <span>Em andamento</span>
          </div>
          <div>
            <strong>Certificação</strong>
            <span>{course.certificate}</span>
          </div>
        </div>
        <div className="actions">
          <Link className="button" href="/certificados">
            Marcar como concluída
          </Link>
          <Link className="buttonGhost" href={`/catalogo/${course.slug}`}>
            Ver detalhes
          </Link>
        </div>
      </div>
    </section>
  );
}
