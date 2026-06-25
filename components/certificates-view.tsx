"use client";

import { LoginRequiredPanel } from "@/components/access-panels";
import { useMockUser } from "@/components/use-mock-user";
import { canAccessCourse, getOrganization, type Course } from "@/lib/courses";

export function CertificatesView({ courses }: { courses: Course[] }) {
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
            Certificados e vencimentos vinculados ao usuário, empresa e curso, com código de
            rastreio e status de reciclagem.
          </p>
        </div>
      </section>

      <section className="certificateList">
        {visibleCourses.map((course, index) => (
          <div className="certificateCard" key={course.slug}>
            <div>
              <p className="eyebrow">
                {getOrganization(course.organizationSlugs[0])?.name ?? "SACF"} · {course.vertical}
              </p>
              <h3>{course.title}</h3>
              <p>{course.certificate}</p>
            </div>
            <div className="certificateMeta">
              <div>
                <strong>{course.progress}%</strong>
                <span>progresso</span>
              </div>
              <span className="statusTag">
                {course.progress === 100 ? "Emitido" : index === 0 ? "Em andamento" : "Pendente"}
              </span>
            </div>
            <div className="progressTrack">
              <div className="progressFill" style={{ width: `${course.progress}%` }} />
            </div>
            <div className="certificateFoot">
              <span>Código: SACF-{course.slug.slice(0, 4).toUpperCase()}-{index + 1001}</span>
              <span>{course.progress === 100 ? "Válido até 24/06/2027" : "Aguardando conclusão"}</span>
            </div>
            <div className="certificateActions">
              <button className="buttonGhost" type="button">
                Visualizar
              </button>
              <button className="buttonGhost" type="button">
                Histórico
              </button>
            </div>
          </div>
        ))}
      </section>
    </>
  );
}
