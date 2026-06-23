import Link from "next/link";
import { courses } from "@/lib/courses";

export default function MyCoursesPage() {
  return (
    <>
      <section className="sectionHead">
        <div>
          <p className="eyebrow">Meus cursos</p>
          <h1>Continue treinando de onde parou.</h1>
          <p>Visao do aluno com progresso, certificados e proximas aulas.</p>
        </div>
      </section>

      <section className="grid">
        {courses.map((course) => (
          <Link className="courseCard" data-accent={course.accent} href={`/aprender/${course.slug}`} key={course.slug}>
            <div className="courseCover">
              <span>{course.status}</span>
            </div>
            <div className="courseBody">
              <h3>{course.title}</h3>
              <p>{course.vertical} · {course.duration} · {course.certificate}</p>
              <div className="progressTrack">
                <div className="progressFill" style={{ width: `${course.progress}%` }} />
              </div>
              <p>{course.progress}% concluido</p>
            </div>
          </Link>
        ))}
      </section>
    </>
  );
}
