import Link from "next/link";
import { getCourse } from "@/lib/courses";

export default async function LearnPage({ params }: { params: Promise<{ courseId: string }> }) {
  const { courseId } = await params;
  const course = getCourse(courseId);
  const firstModule = course.modules[0];

  return (
    <section className="playerShell">
      <aside className="playerSidebar">
        <p className="eyebrow">{course.vertical}</p>
        <h3>{course.title}</h3>
        <div className="progressTrack">
          <div className="progressFill" style={{ width: `${course.progress}%` }} />
        </div>
        <p>{course.progress}% concluido</p>
        {course.modules.map((module) => (
          <div className="moduleList" key={module.title}>
            <h3>{module.title}</h3>
            {module.lessons.map((lesson) => (
              <button className="lessonButton" key={lesson}>
                {lesson}
              </button>
            ))}
          </div>
        ))}
      </aside>
      <div className="playerMain">
        <div className="mockPlayer">
          <div className="videoFrame">
            <span className="playButton">▶</span>
          </div>
        </div>
        <div className="sectionHead">
          <div>
            <p className="eyebrow">Aula atual</p>
            <h1>{firstModule.lessons[0]}</h1>
            <p>
              Aula mockada para validar a experiencia. Depois esta area recebe video real, tempo
              assistido, anexos e conclusao registrada no backend.
            </p>
          </div>
        </div>
        <div className="actions">
          <Link className="button" href="/certificados">
            Marcar como concluida
          </Link>
          <Link className="buttonGhost" href={`/catalogo/${course.slug}`}>
            Ver detalhes
          </Link>
        </div>
      </div>
    </section>
  );
}
