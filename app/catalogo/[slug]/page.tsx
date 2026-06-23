import Link from "next/link";
import { getCourse } from "@/lib/courses";

export default async function CourseDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const course = getCourse(slug);

  return (
    <section className="split">
      <div className="detailPanel">
        <p className="eyebrow">{course.vertical}</p>
        <h1>{course.title}</h1>
        <p className="lead">{course.summary}</p>
        <div className="meta">
          <span>{course.level}</span>
          <span>{course.language}</span>
          <span>{course.duration}</span>
          <span>{course.lessons} aulas</span>
          <span>{course.certificate}</span>
        </div>

        <h2>O que o aluno vai aprender</h2>
        <p>
          Procedimentos padronizados, criterios de seguranca, validacao teorica e boas praticas para
          reduzir erros operacionais.
        </p>

        <h2>Conteudo do curso</h2>
        <div className="moduleList">
          {course.modules.map((module) => (
            <div className="moduleItem" key={module.title}>
              <h3>{module.title}</h3>
              <ul>
                {module.lessons.map((lesson) => (
                  <li key={lesson}>{lesson}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <aside className="detailPanel">
        <div className="mockPlayer">
          <div className="videoFrame">
            <span className="playButton">▶</span>
          </div>
        </div>
        <h3>Incluido neste curso</h3>
        <div className="meta">
          <span>{course.duration}</span>
          <span>{course.lessons} aulas</span>
          <span>{course.certificate}</span>
        </div>
        <p>
          Publico-alvo: {course.audience}
          <br />
          Responsavel: {course.instructor}
        </p>
        <Link className="button" href={`/aprender/${course.slug}`}>
          Iniciar curso
        </Link>
      </aside>
    </section>
  );
}
