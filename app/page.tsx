import Link from "next/link";
import Image from "next/image";
import { CourseCard } from "@/components/course-card";
import { getCourses } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function Home() {
  const courses = await getCourses();
  const activeCourses = courses.filter((course) => course.status !== "Concluído").length;
  const certificateCourses = courses.filter((course) => course.certificate !== "Sem certificado").length;
  const totalLessons = courses.reduce((sum, course) => sum + course.lessons, 0);

  return (
    <>
      <section className="productHero">
        <div className="productHeroCopy">
          <Image
            className="academyHeroLogo"
            src="/brand/sacf-academy-horizontal-onDark.png"
            alt="SACF Academy"
            width={520}
            height={293}
            priority
          />
          <p className="eyebrow">Educação corporativa privada</p>
          <h1>SACF Academy</h1>
          <p className="lead">
            Treinamento profissionalizante, certificação verificável e reciclagem em uma plataforma
            privada para empresas que precisam controlar capacitação operacional.
          </p>
          <div className="productHeroActions">
            <Link className="button" href="/cadastro">
              Contratar para minha empresa
            </Link>
            <Link className="buttonGhost" href="/login">
              Entrar na plataforma
            </Link>
          </div>
        </div>

        <aside className="productPreview" aria-label="Exemplo da plataforma SACF Academy">
          <div className="previewWindow">
            <div className="previewSidebar">
              <Image
                className="previewLogoImage"
                src="/brand/sacf-academy-symbol.png"
                alt=""
                width={64}
                height={64}
              />
              <span data-active="true">Visão geral</span>
              <span>Cursos</span>
              <span>Usuários</span>
              <span>Certificados</span>
            </div>
            <div className="previewMain">
              <div className="previewTop">
                <div>
                  <small>Ambiente da empresa</small>
                  <strong>Treinamentos críticos</strong>
                </div>
                <span>Admin</span>
              </div>
              <div className="previewHeroCard">
                <div>
                  <small>Compliance operacional</small>
                  <strong>86%</strong>
                  <span>das trilhas obrigatórias em dia</span>
                </div>
                <div className="previewOrb" />
              </div>
              <div className="previewGrid">
                <div>
                  <strong>128</strong>
                  <span>certificados ativos</span>
                </div>
                <div>
                  <strong>12m</strong>
                  <span>reciclagem padrão</span>
                </div>
              </div>
              <div className="previewList">
                <div>
                  <span>NR e segurança</span>
                  <strong>92%</strong>
                </div>
                <div>
                  <span>Onboarding técnico</span>
                  <strong>74%</strong>
                </div>
                <div>
                  <span>Certificados vencendo</span>
                  <strong>18</strong>
                </div>
              </div>
            </div>
          </div>
        </aside>

        <div className="heroOrbit" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>
      </section>

      <section className="productStory">
        <div>
          <p className="eyebrow">Operação com evidência</p>
          <h2>Uma camada de treinamento para empresas que precisam provar preparo, reciclagem e conformidade.</h2>
          <Image
            className="academySeal"
            src="/brand/sacf-academy-seal-onDark.png"
            alt="Selo SACF Academy"
            width={260}
            height={260}
          />
        </div>
        <div className="storyCards">
          <div>
            <span>01</span>
            <strong>Implantação assistida</strong>
            <p>A SACF cria o ambiente inicial e libera o administrador da empresa com a estrutura pronta para operar.</p>
          </div>
          <div>
            <span>02</span>
            <strong>Treinamento por função</strong>
            <p>Usuários recebem trilhas conforme área, risco, idioma, grupo e obrigatoriedade.</p>
          </div>
          <div>
            <span>03</span>
            <strong>Certificados rastreáveis</strong>
            <p>Gestão de validade, vencimento e reciclagem sem depender de planilhas soltas.</p>
          </div>
        </div>
      </section>

      <section className="productMetrics" aria-label="Indicadores">
        <div>
          <strong>{courses.length}</strong>
          <span>cursos ativos</span>
        </div>
        <div>
          <strong>{activeCourses}</strong>
          <span>disponíveis agora</span>
        </div>
        <div>
          <strong>{certificateCourses}</strong>
          <span>com certificação</span>
        </div>
        <div>
          <strong>{totalLessons}</strong>
          <span>aulas estruturadas</span>
        </div>
      </section>

      <section className="productWhy">
        <div className="sectionHead">
          <div>
            <p className="eyebrow">Por que a plataforma existe</p>
            <h2>Treinamento crítico não pode depender de planilhas, arquivos soltos e memória operacional.</h2>
          </div>
        </div>
        <div className="productFeatureGrid">
          <article>
            <span>01</span>
            <h3>Controle por empresa</h3>
            <p>Ambientes isolados, usuários, grupos, cursos privados e identidade da empresa.</p>
          </article>
          <article>
            <span>02</span>
            <h3>Certificação verificável</h3>
            <p>Registro de conclusão, validade, vencimento e reciclagem por curso e função.</p>
          </article>
          <article>
            <span>03</span>
            <h3>Biblioteca SACF</h3>
            <p>Cursos oficiais que podem ser atribuídos, adaptados e combinados com conteúdos internos.</p>
          </article>
          <article>
            <span>04</span>
            <h3>Visão operacional</h3>
            <p>Relatórios para acompanhar adesão, pendências, certificados e risco de vencimento.</p>
          </article>
        </div>
      </section>

      <section className="productFlow">
        <div>
          <p className="eyebrow">Modelo da plataforma</p>
          <h2>Uma plataforma SACF. Um ambiente privado para cada empresa.</h2>
          <p>
            A SACF mantém a metodologia, os cursos oficiais e a governança de certificação. Cada
            empresa configura usuários, trilhas, permissões e conteúdos próprios.
          </p>
        </div>
        <div className="flowStack">
          <div>
            <span>SACF</span>
            <strong>Biblioteca oficial, certificações e governança</strong>
          </div>
          <div>
            <span>Empresa</span>
            <strong>Cursos privados, grupos, identidade e permissões</strong>
          </div>
          <div>
            <span>Usuário</span>
            <strong>Trilhas liberadas, progresso e certificados</strong>
          </div>
        </div>
      </section>

      <section className="productCourses">
        <div className="sectionHead">
          <div>
            <p className="eyebrow">Biblioteca SACF</p>
            <h2>Cursos oficiais que empresas podem atribuir, adaptar e certificar.</h2>
            <p>
              A biblioteca dá a base da SACF. O ambiente privado permite complementar com treinamentos
              internos e regras de acesso por função.
            </p>
          </div>
          <Link className="buttonGhost" href="/cadastro">
            Solicitar implantação
          </Link>
        </div>
        <div className="grid">
          {courses.slice(0, 4).map((course) => (
            <CourseCard course={course} href={`/catalogo/${course.slug}`} key={course.slug} />
          ))}
        </div>
      </section>

      <section className="productCta">
        <p className="eyebrow">SACF Academy</p>
        <h2>Leve treinamento, evidência e certificação para dentro da operação.</h2>
        <p>Uma experiência privada, premium e pronta para crescer com empresas, parceiros e equipes.</p>
        <div className="productHeroActions">
          <Link className="button" href="/cadastro">
            Solicitar implantação
          </Link>
          <Link className="buttonGhost" href="/login">
            Entrar na plataforma
          </Link>
        </div>
      </section>
    </>
  );
}
