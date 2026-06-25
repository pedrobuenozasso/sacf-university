import { getCourses, getOrganizations } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function AdminCertificationsPage() {
  const [courses, organizations] = await Promise.all([getCourses(), getOrganizations()]);
  return (
    <>
      <div className="sectionHead">
        <div>
          <p className="eyebrow">Certificações</p>
          <h1>Validade, vencimentos e reciclagens.</h1>
          <p>
            O diferencial operacional da plataforma: saber quem está certificado, quem vai vencer e
            quem precisa reciclar.
          </p>
        </div>
      </div>

      <section className="metrics">
        <div className="metric">
          <strong>{organizations.reduce((sum, org) => sum + org.certificates, 0)}</strong>
          <span>Emitidos</span>
        </div>
        <div className="metric">
          <strong>{organizations.reduce((sum, org) => sum + org.expiring, 0)}</strong>
          <span>Vencendo</span>
        </div>
        <div className="metric">
          <strong>4</strong>
          <span>Regras ativas</span>
        </div>
        <div className="metric">
          <strong>12m</strong>
          <span>Validade padrão</span>
        </div>
      </section>

      <div className="tablePanel">
        <div className="tableHead">
          <span>Curso</span>
          <span>Regra</span>
          <span>Validade</span>
          <span>Alertas</span>
          <span>Status</span>
        </div>
        {courses.map((course) => (
          <div className="tableRow" key={course.slug}>
            <div>
              <strong>{course.title}</strong>
              <p>{course.vertical}</p>
            </div>
            <span>{course.certificate}</span>
            <span>{course.certificate.includes("24") ? "24 meses" : "12 meses"}</span>
            <span>30 dias antes</span>
            <span className="statusTag">Ativa</span>
          </div>
        ))}
      </div>
    </>
  );
}
