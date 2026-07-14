import { getDictionary } from "@/lib/i18n/get-dictionary";

export default async function HelpPage() {
  const { dict } = await getDictionary();
  const t = dict.help;
  return (
    <>
      <section className="sectionHead">
        <div>
          <p className="eyebrow">{t.eyebrow}</p>
          <h1>{t.title}</h1>
          <p>{t.body}</p>
        </div>
      </section>

      <section className="supportGrid">
        <div className="supportCard">
          <h2>{t.faqTitle}</h2>
          <div className="moduleList">
            <div className="moduleItem">
              <h3>{t.q1}</h3>
              <p>{t.a1}</p>
            </div>
            <div className="moduleItem">
              <h3>{t.q2}</h3>
              <p>{t.a2}</p>
            </div>
            <div className="moduleItem">
              <h3>{t.q3}</h3>
              <p>{t.a3}</p>
            </div>
          </div>
        </div>

        <aside className="supportCard supportUnavailable">
          <p className="eyebrow">Atendimento</p>
          <h2>{t.sendMessageTitle}</h2>
          <p>O envio de solicitações pelo portal está sendo preparado. Enquanto isso, use o canal de suporte definido pela sua empresa.</p>
          <span className="actionHint">Canal no portal em implantação</span>
        </aside>
      </section>
    </>
  );
}
