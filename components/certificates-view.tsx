"use client";

import { LoginRequiredPanel } from "@/components/access-panels";
import { useMockUser } from "@/components/use-mock-user";
import { canAccessCourse, courses } from "@/lib/courses";

export function CertificatesView() {
  const user = useMockUser();

  if (!user) {
    return <LoginRequiredPanel title="Entre para acessar certificados." />;
  }

  const visibleCourses = courses.filter((course) => canAccessCourse(course, user));

  return (
    <>
      <section className="sectionHead">
        <div>
          <p className="eyebrow">Certificados</p>
          <h1>Controle de validade e reciclagem.</h1>
          <p>
            Certificados e vencimentos vinculados ao usuario, empresa e curso. No produto real, cada
            certificado sera validado contra o banco.
          </p>
        </div>
      </section>

      <section className="certificateList">
        {visibleCourses.map((course, index) => (
          <div className="detailPanel" key={course.slug}>
            <div className="sectionHead">
              <div>
                <h3>{course.title}</h3>
                <p>{course.vertical} · {course.certificate}</p>
              </div>
              <span className="statusTag">
                {course.progress === 100 ? "Emitido" : index === 0 ? "Em andamento" : "Pendente"}
              </span>
            </div>
          </div>
        ))}
      </section>
    </>
  );
}
