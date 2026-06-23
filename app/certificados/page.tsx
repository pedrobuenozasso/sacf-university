import { courses } from "@/lib/courses";

export default function CertificatesPage() {
  return (
    <>
      <section className="sectionHead">
        <div>
          <p className="eyebrow">Certificados</p>
          <h1>Controle de validade e reciclagem.</h1>
          <p>
            Area para acompanhar certificados emitidos, vencimentos proximos e treinamentos que
            precisam ser refeitos.
          </p>
        </div>
      </section>

      <section className="certificateList">
        {courses.map((course, index) => (
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
