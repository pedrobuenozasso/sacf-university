import { getCourses } from "@/lib/data";
import { supportedLocales } from "@/lib/i18n";

export const dynamic = "force-dynamic";

export default async function AdminCoursesPage() {
  const courses = await getCourses();
  return (
    <>
      <div className="sectionHead">
        <div>
          <p className="eyebrow">Cursos</p>
          <h1>Crie, publique e acompanhe treinamentos.</h1>
          <p>
            Gerencie cursos privados da empresa e cursos oficiais SACF que podem ser atribuídos ou
            adaptados para cada operação.
          </p>
        </div>
      </div>

      <div className="adminToolbar">
        <input className="field" placeholder="Buscar curso" />
        <select className="field" defaultValue="todos">
          <option value="todos">Todas as verticais</option>
          <option>Operador</option>
          <option>Mecânico</option>
          <option>Elétrico</option>
          <option>Treinador</option>
        </select>
        <button className="buttonGhost" type="button">
          Exportar
        </button>
      </div>

      <section className="split">
        <div className="tablePanel">
          <div className="tableHead">
            <span>Curso</span>
            <span>Vertical</span>
            <span>Nível</span>
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
          <div className="formStatus">
            <span className="statusDot" />
            <div>
              <strong>Editor de curso</strong>
              <small>Conteúdo interno ou curso oficial SACF em um único fluxo</small>
            </div>
          </div>
          <h2>Novo curso</h2>
          <input className="field" placeholder="Título do curso" />
          <label className="fileField">
            Foto/capa do curso
            <input className="field" type="file" accept="image/*" />
          </label>
          <select className="field" defaultValue="">
            <option value="" disabled>
              Vertical
            </option>
            <option>Operador</option>
            <option>Mecânico</option>
            <option>Elétrico / alta tensão</option>
            <option>Treinador</option>
            <option>Representante</option>
          </select>
          <input className="field" placeholder="Instrutor ou responsável técnico" />
          <select className="field" defaultValue="empresa">
            <option value="empresa">Curso privado da empresa</option>
            <option value="sacf">Curso oficial da Biblioteca SACF</option>
          </select>
          <div className="formGrid">
            <input className="field" placeholder="Carga horária" />
            <input className="field" placeholder="Validade do certificado" />
          </div>
          <select className="field" defaultValue="pt-BR">
            {supportedLocales.map((locale) => (
              <option key={locale.code} value={locale.code}>
                {locale.label}
              </option>
            ))}
          </select>
          <textarea className="field" placeholder="Resumo do curso" />
          <textarea className="field" placeholder="Conteúdo programático / módulos / aulas" />
          <div className="actions noTopMargin">
            <button className="button" type="button">
              Salvar rascunho
            </button>
            <button className="buttonGhost" type="button">
              Publicar
            </button>
            <button className="dangerButton" type="button">
              Apagar
            </button>
          </div>
          <p className="formHint">
            Cursos privados ficam restritos à empresa. Cursos oficiais SACF podem ser usados como
            base e personalizados por cliente.
          </p>
        </form>
      </section>

      <section className="detailPanel adminEditorPreview">
        <div className="sectionHead">
          <div>
            <p className="eyebrow">Cursos privados e Biblioteca SACF</p>
            <h2>Controle completo do conteúdo</h2>
            <p>
              O admin da empresa poderá configurar cursos internos. A SACF mantém uma biblioteca
              oficial de cursos assinados, que podem ser atribuídos ou adaptados para cada cliente.
            </p>
          </div>
        </div>
        <div className="grid">
          <div className="moduleItem">
            <h3>Identidade da empresa</h3>
            <p>Editar capa, título, vertical, idioma, carga horária, instrutor e nível.</p>
          </div>
          <div className="moduleItem">
            <h3>Conteúdo</h3>
            <p>Adicionar módulos, aulas, vídeos, anexos, textos, quiz e prova final.</p>
          </div>
          <div className="moduleItem">
            <h3>Acesso privado</h3>
            <p>Definir se o curso é da empresa inteira, grupo específico ou usuários selecionados.</p>
          </div>
          <div className="moduleItem">
            <h3>Biblioteca SACF</h3>
            <p>Usar cursos oficiais como base para treinamento, certificação e reciclagem.</p>
          </div>
          <div className="moduleItem">
            <h3>Governança</h3>
            <p>Salvar rascunho, publicar, arquivar, apagar e acompanhar alterações.</p>
          </div>
        </div>
      </section>
    </>
  );
}
