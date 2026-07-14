import Link from "next/link";
import Image from "next/image";
import { CourseCard } from "@/components/course-card";
import { getCourses } from "@/lib/data";
import { getDictionary } from "@/lib/i18n/get-dictionary";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [courses, { dict }] = await Promise.all([getCourses(), getDictionary()]);
  const home = dict.home;

  return (
    <>
      <section className="productHero">
        <div className="productHeroCopy">
          <p className="eyebrow">{home.eyebrow}</p>
          <h1>{home.title}</h1>
          <p className="lead">{home.lead}</p>
          <div className="productHeroActions">
            <Link className="button" href="/cadastro">
              {home.ctaPrimary}
            </Link>
            <Link className="buttonGhost" href="/login">
              {home.ctaSecondary}
            </Link>
          </div>
          <div className="productProof" aria-label="Principais benefícios">
            <div><strong>Privado por empresa</strong><span>Dados, pessoas e cursos isolados</span></div>
            <div><strong>Certificação verificável</strong><span>Validade, renovação e evidência</span></div>
            <div><strong>Visão de risco</strong><span>Prazos e pendências em um só lugar</span></div>
          </div>
        </div>

        <aside className="productPreview" aria-label={home.previewLabel}>
          <div className="previewWindow">
            <div className="previewSidebar">
              <Image
                className="previewLogoImage"
                src="/brand/sacf-academy-symbol.png"
                alt=""
                width={64}
                height={64}
              />
              <span data-active="true">{home.previewOverview}</span>
              <span>{home.previewCourses}</span>
              <span>{home.previewUsers}</span>
              <span>{home.previewCertificates}</span>
            </div>
            <div className="previewMain">
              <div className="previewTop">
                <div>
                  <small>{home.previewOrgEnv}</small>
                  <strong>{home.previewOrgName}</strong>
                </div>
                <span>{home.previewAdmin}</span>
              </div>
              <div className="previewHeroCard">
                <div>
                  <small>{home.previewCompliance}</small>
                  <strong>86%</strong>
                  <span>{home.previewComplianceSub}</span>
                </div>
              </div>
              <div className="previewGrid">
                <div>
                  <strong>128</strong>
                  <span>{home.previewActiveCert}</span>
                </div>
                <div>
                  <strong>12m</strong>
                  <span>{home.previewStandardRecycle}</span>
                </div>
              </div>
              <div className="previewList">
                <div>
                  <span>{home.previewNr}</span>
                  <strong>92%</strong>
                </div>
                <div>
                  <span>{home.previewOnboarding}</span>
                  <strong>74%</strong>
                </div>
                <div>
                  <span>{home.previewExpiring}</span>
                  <strong>18</strong>
                </div>
              </div>
            </div>
          </div>
        </aside>
      </section>

      <section className="productStory">
        <div>
          <p className="eyebrow">{home.storyEyebrow}</p>
          <h2>{home.storyTitle}</h2>
        </div>
        <div className="storyCards">
          <div>
            <span>01</span>
            <strong>{home.step1Title}</strong>
            <p>{home.step1Body}</p>
          </div>
          <div>
            <span>02</span>
            <strong>{home.step2Title}</strong>
            <p>{home.step2Body}</p>
          </div>
          <div>
            <span>03</span>
            <strong>{home.step3Title}</strong>
            <p>{home.step3Body}</p>
          </div>
        </div>
        <Image
          className="academySeal"
          src="/brand/sacf-academy-seal-onDark.png"
          alt="Selo SACF Academy"
          width={260}
          height={260}
        />
      </section>

      <section className="productWhy">
        <div className="sectionHead">
          <div>
            <p className="eyebrow">{home.whyEyebrow}</p>
            <h2>{home.whyTitle}</h2>
          </div>
        </div>
        <div className="productFeatureGrid">
          <article>
            <span>01</span>
            <h3>{home.feature1Title}</h3>
            <p>{home.feature1Body}</p>
          </article>
          <article>
            <span>02</span>
            <h3>{home.feature2Title}</h3>
            <p>{home.feature2Body}</p>
          </article>
          <article>
            <span>03</span>
            <h3>{home.feature3Title}</h3>
            <p>{home.feature3Body}</p>
          </article>
          <article>
            <span>04</span>
            <h3>{home.feature4Title}</h3>
            <p>{home.feature4Body}</p>
          </article>
        </div>
      </section>

      <section className="productCourses">
        <div className="sectionHead">
          <div>
            <p className="eyebrow">{home.coursesEyebrow}</p>
            <h2>{home.coursesTitle}</h2>
            <p>{home.coursesBody}</p>
          </div>
          <Link className="buttonGhost" href="/cadastro">
            {home.coursesCta}
          </Link>
        </div>
        <div className="grid">
          {courses.slice(0, 3).map((course) => (
            <CourseCard course={course} href={`/catalogo/${course.slug}`} key={course.slug} />
          ))}
        </div>
      </section>

      <section className="productCta">
        <p className="eyebrow">{home.ctaEyebrow}</p>
        <h2>{home.ctaTitle}</h2>
        <p>{home.ctaBody}</p>
        <div className="productHeroActions">
          <Link className="button" href="/cadastro">
            {home.coursesCta}
          </Link>
          <Link className="buttonGhost" href="/login">
            {home.ctaSecondary}
          </Link>
        </div>
      </section>
    </>
  );
}
