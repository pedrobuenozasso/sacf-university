import Link from "next/link";
import { courses } from "@/lib/courses";

const filters = ["Todos", "Operador", "Mecanico", "Eletrico", "Treinador", "Com certificado"];

export default function CatalogPage() {
  return (
    <>
      <section className="sectionHead">
        <div>
          <p className="eyebrow">Catalogo privado</p>
          <h1>Aprendizado por funcao, certificacao e prioridade operacional.</h1>
          <p>
            Cursos organizados para a realidade da empresa: operador, mecanico, eletrico, treinador
            e representantes externos.
          </p>
        </div>
      </section>

      <div className="filters">
        {filters.map((filter) => (
          <span className="filter" key={filter}>
            {filter}
          </span>
        ))}
      </div>

      <section className="grid">
        {courses.map((course) => (
          <Link className="courseCard" data-accent={course.accent} href={`/catalogo/${course.slug}`} key={course.slug}>
            <div className="courseCover">
              <span>{course.vertical}</span>
            </div>
            <div className="courseBody">
              <div className="meta">
                <span>{course.status}</span>
                <span>{course.language}</span>
              </div>
              <h3>{course.title}</h3>
              <p>{course.summary}</p>
              <div className="meta">
                <span>{course.level}</span>
                <span>{course.duration}</span>
                <span>{course.lessons} aulas</span>
              </div>
              <div className="progressTrack">
                <div className="progressFill" style={{ width: `${course.progress}%` }} />
              </div>
            </div>
          </Link>
        ))}
      </section>
    </>
  );
}
