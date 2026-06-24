import Link from "next/link";
import { notFound } from "next/navigation";
import { CoursePreviewPanel } from "@/components/course-card";
import { getCourseBySlug } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function CourseDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const course = await getCourseBySlug(slug);

  if (!course) {
    notFound();
  }

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
          Procedimentos padronizados, critérios de segurança, validação teórica e boas práticas para
          reduzir erros operacionais.
        </p>

        <h2>Conteúdo do curso</h2>
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
        <CoursePreviewPanel label="Resumo do curso" />
        <h3>Incluido neste curso</h3>
        <div className="meta">
          <span>{course.duration}</span>
          <span>{course.lessons} aulas</span>
          <span>{course.certificate}</span>
        </div>
        <p>
          Público-alvo: {course.audience}
          <br />
          Responsável: {course.instructor}
        </p>
        <Link className="button" href={`/aprender/${course.slug}`}>
          Iniciar curso
        </Link>
      </aside>
    </section>
  );
}
