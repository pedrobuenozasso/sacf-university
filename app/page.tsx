import Link from "next/link";
import { CourseCard } from "@/components/course-card";
import { HeroShowcase } from "@/components/hero-showcase";
import { courses } from "@/lib/courses";

export default function Home() {
  const activeCourses = courses.filter((course) => course.status !== "Concluído").length;

  return (
    <>
      <section className="hero">
        <div>
          <p className="eyebrow">SACF University</p>
          <h1>Treine, certifique e acompanhe equipes em uma plataforma privada.</h1>
          <p className="lead">
            Cursos internos, progresso por pessoa, provas, certificados e reciclagens em uma
            experiência pensada para operação corporativa.
          </p>
          <div className="actions">
            <Link className="button" href="/login">
              Acessar plataforma
            </Link>
            <Link className="buttonGhost" href="/catalogo">
              Ver catálogo
            </Link>
          </div>
        </div>
        <HeroShowcase />
      </section>

      <section className="metrics" aria-label="Indicadores">
        <div className="metric">
          <strong>{courses.length}</strong>
          <span>Cursos no catálogo</span>
        </div>
        <div className="metric">
          <strong>{activeCourses}</strong>
          <span>Disponíveis agora</span>
        </div>
        <div className="metric">
          <strong>4</strong>
          <span>Verticais iniciais</span>
        </div>
        <div className="metric">
          <strong>12m</strong>
          <span>Reciclagem padrão</span>
        </div>
      </section>

      <section>
        <div className="sectionHead">
          <div>
            <p className="eyebrow">Catálogo SACF University</p>
            <h2>Cursos corporativos com controle de progresso e certificação.</h2>
          </div>
          <Link className="buttonGhost" href="/catalogo">
            Abrir catálogo
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
