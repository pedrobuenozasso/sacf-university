import { courses } from "@/lib/courses";
import { supportedLocales } from "@/lib/i18n";

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
          <label className="fileField">
            Foto/capa do curso
            <input className="field" type="file" accept="image/*" />
          </label>
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
          <input className="field" placeholder="Instrutor ou responsavel tecnico" />
          <div className="formGrid">
            <input className="field" placeholder="Carga horaria" />
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
          <textarea className="field" placeholder="Conteudo programatico / modulos / aulas" />
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
        </form>
      </section>

      <section className="detailPanel adminEditorPreview">
        <div className="sectionHead">
          <div>
            <p className="eyebrow">Editor da empresa</p>
            <h2>Controle completo do curso</h2>
            <p>
              O admin da empresa podera editar identidade, capa, conteudo, permissoes, publicacao e
              historico do curso sem depender da SACF para ajustes simples.
            </p>
          </div>
        </div>
        <div className="grid">
          <div className="moduleItem">
            <h3>Identidade</h3>
            <p>Editar capa, titulo, vertical, idioma, carga horaria, instrutor e nivel.</p>
          </div>
          <div className="moduleItem">
            <h3>Conteudo</h3>
            <p>Adicionar modulos, aulas, videos, anexos, textos, quiz e prova final.</p>
          </div>
          <div className="moduleItem">
            <h3>Acesso</h3>
            <p>Definir se o curso e da empresa inteira, grupo especifico ou usuarios selecionados.</p>
          </div>
          <div className="moduleItem">
            <h3>Governanca</h3>
            <p>Salvar rascunho, publicar, arquivar, apagar e acompanhar alteracoes.</p>
          </div>
        </div>
      </section>
    </>
  );
}
