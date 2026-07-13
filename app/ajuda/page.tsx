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

        <form className="supportCard">
          <h2>{t.sendMessageTitle}</h2>
          <input className="field" placeholder={t.namePlaceholder} />
          <input className="field" placeholder={t.emailPlaceholder} />
          <input className="field" placeholder={t.subjectPlaceholder} />
          <textarea className="field" placeholder={t.messagePlaceholder} />
          <button className="button" type="button">
            {t.send}
          </button>
        </form>
      </section>
    </>
  );
}
