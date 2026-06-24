import Image from "next/image";
import { courses, getOrganization } from "@/lib/courses";

export function HeroShowcase() {
  const course = courses[0];
  const ownerOrg = getOrganization(course.organizationSlugs[0]);
  const watched = Math.round((course.lessons * course.progress) / 100);
  const lessons = course.modules.flatMap((module) => module.lessons).slice(0, 3);

  return (
    <div className="heroShowcase" aria-hidden="true">
      <span className="showcaseGlow" />

      <div className="showcaseStage">
        <article className="showcaseCard" data-accent={course.accent}>
          <div className="showcaseCover">
            <div className="showcaseCoverTop">
              <span className="showcaseBrandGroup">
                <Image
                  className="showcaseBrand"
                  src="/brand/sacf-app-icon-v2.png"
                  alt="SACF University"
                  width={40}
                  height={40}
                />
                {ownerOrg?.brandLogo ? (
                  <Image
                    className="showcaseBrand showcaseTenantBrand"
                    src={ownerOrg.brandLogo}
                    alt={ownerOrg.name}
                    width={40}
                    height={40}
                  />
                ) : null}
              </span>
              <span className="showcaseTag">{course.vertical}</span>
            </div>
            <span className="showcasePlay">
              <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
                <path d="M8 5v14l11-7z" fill="currentColor" />
              </svg>
            </span>
            <div className="showcaseCoverBottom">
              <span>
                Aula {watched} de {course.lessons}
              </span>
              <span>{course.duration}</span>
            </div>
          </div>

          <div className="showcaseBody">
            <p className="eyebrow">{course.status}</p>
            <h3>{course.title}</h3>
            <div className="showcaseMeta">
              <span>{course.level}</span>
              <span>{course.duration}</span>
              <span>{course.language}</span>
            </div>
            <div className="progressTrack">
              <div className="progressFill" style={{ width: `${course.progress}%` }} />
            </div>
            <p className="showcaseProgressLabel">
              {course.progress}% concluído · {watched}/{course.lessons} aulas
            </p>
            <ul className="showcaseLessons">
              {lessons.map((lesson, index) => (
                <li key={lesson} className={index < 2 ? "done" : "active"}>
                  <span className="showcaseDot" />
                  {lesson}
                </li>
              ))}
            </ul>
          </div>
        </article>

        <div className="showcaseChip showcaseChipTop">
          <span className="showcaseChipIcon">✓</span>
          <span className="showcaseChipText">
            <strong>Certificado emitido</strong>
            <small>{course.certificate}</small>
          </span>
        </div>

        <div className="showcaseChip showcaseChipBottom">
          <strong>+128</strong>
          <small>certificados ativos na plataforma</small>
        </div>
      </div>
    </div>
  );
}
