import Link from "next/link";
import { CourseCard, CoursePreviewPanel } from "@/components/course-card";
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
            <Link className="button" href="/login">
              Acessar plataforma
            </Link>
            <Link className="buttonGhost" href="/catalogo">
              Ver catalogo demo
            </Link>
          </div>
        </div>
        <div className="panel heroPreview" aria-label="Previa do player">
          <CoursePreviewPanel label="Preview institucional" />
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
            <CourseCard course={course} href={`/catalogo/${course.slug}`} key={course.slug} />
          ))}
        </div>
      </section>
    </>
  );
}
