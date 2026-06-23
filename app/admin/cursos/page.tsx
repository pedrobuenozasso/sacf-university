import { courses } from "@/lib/courses";

export default function AdminCoursesPage() {
  return (
    <>
      <div className="sectionHead">
        <div>
          <p className="eyebrow">Cursos</p>
          <h1>Crie, publique e acompanhe treinamentos.</h1>
          <p>Gerencie conteudos por vertical, idioma, validade de certificado e status.</p>
        </div>
      </div>

      <section className="split">
        <div className="tablePanel">
          <div className="tableHead">
            <span>Curso</span>
            <span>Vertical</span>
            <span>Nivel</span>
            <span>Aulas</span>
            <span>Status</span>
          </div>
          {courses.map((course) => (
            <div className="tableRow" key={course.slug}>
              <div>
                <strong>{course.title}</strong>
                <p>{course.duration} · {course.certificate}</p>
              </div>
              <span>{course.vertical}</span>
              <span>{course.level}</span>
              <span>{course.lessons}</span>
              <span className="statusTag">{course.status}</span>
            </div>
          ))}
        </div>

        <form className="detailPanel">
          <h2>Novo curso</h2>
          <input className="field" placeholder="Titulo do curso" />
          <select className="field" defaultValue="">
            <option value="" disabled>
              Vertical
            </option>
            <option>Operador</option>
            <option>Mecanico</option>
            <option>Eletrico / alta tensao</option>
            <option>Treinador</option>
            <option>Representante</option>
          </select>
          <div className="formGrid">
            <input className="field" placeholder="Carga horaria" />
            <input className="field" placeholder="Validade do certificado" />
          </div>
          <textarea className="field" placeholder="Resumo do curso" />
          <button className="button" type="button">
            Salvar rascunho
          </button>
        </form>
      </section>
    </>
  );
}
