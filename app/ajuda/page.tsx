export default function HelpPage() {
  return (
    <>
      <section className="sectionHead">
        <div>
          <p className="eyebrow">Ajuda</p>
          <h1>Suporte para alunos, administradores e treinadores.</h1>
          <p>
            Espaco para duvidas sobre acesso, certificados, reciclagem, cursos obrigatorios e
            sugestoes de novos conteudos.
          </p>
        </div>
      </section>

      <section className="supportGrid">
        <div className="supportCard">
          <h2>Duvidas frequentes</h2>
          <div className="moduleList">
            <div className="moduleItem">
              <h3>Como libero um certificado?</h3>
              <p>Conclua todas as aulas obrigatorias e atinja a nota minima da avaliacao.</p>
            </div>
            <div className="moduleItem">
              <h3>O que acontece quando vence?</h3>
              <p>O curso entra na fila de reciclagem e o administrador acompanha o prazo.</p>
            </div>
            <div className="moduleItem">
              <h3>Posso treinar prestadores?</h3>
              <p>Sim. O papel de parceiro externo limita o acesso aos cursos e certificados.</p>
            </div>
          </div>
        </div>

        <form className="supportCard">
          <h2>Enviar mensagem</h2>
          <input className="field" placeholder="Nome" />
          <input className="field" placeholder="Email" />
          <input className="field" placeholder="Assunto" />
          <textarea className="field" placeholder="Descreva sua duvida ou sugestao" />
          <button className="button" type="button">
            Enviar
          </button>
        </form>
      </section>
    </>
  );
}
