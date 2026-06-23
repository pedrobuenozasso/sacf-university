import Link from "next/link";
import { courses } from "@/lib/courses";

export default function Home() {
  const activeCourses = courses.filter((course) => course.status !== "Concluido").length;

  return (
    <>
      <section className="hero">
        <div>
          <p className="eyebrow">SACF University</p>
          <h1>Treinamento corporativo com controle real de certificacao.</h1>
          <p className="lead">
            Uma plataforma privada de cursos para empresas treinarem operadores, mecanicos,
            tecnicos eletricos, treinadores e representantes com progresso, provas, certificados e
            reciclagens em um so lugar.
          </p>
          <div className="actions">
            <Link className="button" href="/catalogo">
              Explorar catalogo
            </Link>
            <Link className="buttonGhost" href="/meus-cursos">
              Ver meus cursos
            </Link>
          </div>
        </div>
        <div className="panel heroPreview" aria-label="Previa do player">
          <div className="mockPlayer">
            <div className="videoFrame">
              <span className="playButton">▶</span>
            </div>
            <div className="lessonStrip">
              <span />
              <span />
              <span />
            </div>
          </div>
        </div>
      </section>

      <section className="metrics" aria-label="Indicadores">
        <div className="metric">
          <strong>{courses.length}</strong>
          <span>Cursos no catalogo</span>
        </div>
        <div className="metric">
          <strong>{activeCourses}</strong>
          <span>Disponiveis agora</span>
        </div>
        <div className="metric">
          <strong>4</strong>
          <span>Verticais iniciais</span>
        </div>
        <div className="metric">
          <strong>12m</strong>
          <span>Reciclagem padrao</span>
        </div>
      </section>

      <section>
        <div className="sectionHead">
          <div>
            <p className="eyebrow">Catalogo Zasso</p>
            <h2>Cursos com cara de produto, nao de planilha.</h2>
          </div>
          <Link className="buttonGhost" href="/catalogo">
            Abrir catalogo
          </Link>
        </div>
        <div className="grid">
          {courses.slice(0, 4).map((course) => (
            <Link className="courseCard" data-accent={course.accent} href={`/catalogo/${course.slug}`} key={course.slug}>
              <div className="courseCover">
                <span>{course.vertical}</span>
              </div>
              <div className="courseBody">
                <h3>{course.title}</h3>
                <p>{course.summary}</p>
                <div className="meta">
                  <span>{course.level}</span>
                  <span>{course.duration}</span>
                  <span>{course.certificate}</span>
                </div>
                <div className="progressTrack">
                  <div className="progressFill" style={{ width: `${course.progress}%` }} />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
