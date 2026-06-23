import Image from "next/image";
import Link from "next/link";
import type { Course } from "@/lib/courses";

export function CourseCard({ course, href }: { course: Course; href: string }) {
  return (
    <Link className="courseCard" data-accent={course.accent} href={href}>
      <div className="courseCover">
        <div className="courseBrandRow">
          <Image className="courseLogo" src="/brand/zasso-logo.png" alt="Zasso" width={64} height={64} />
          <Image className="courseSacfMark" src="/brand/sacf-app-icon-v2.png" alt="SACF" width={34} height={34} />
        </div>
        <span>{course.vertical}</span>
      </div>
      <div className="courseBody">
        <h3>{course.title}</h3>
        <p>{course.summary}</p>
        <div className="meta">
          <span>{course.level}</span>
          <span>{course.duration}</span>
          <span>{course.certificate}</span>
        </div>
        <div className="progressTrack">
          <div className="progressFill" style={{ width: `${course.progress}%` }} />
        </div>
      </div>
    </Link>
  );
}

export function CoursePreviewPanel({ label = "Aula segura" }: { label?: string }) {
  return (
    <div className="lessonPreview">
      <Image src="/brand/sacf-lockup-white.png" alt="SACF" width={160} height={48} />
      <div>
        <p className="eyebrow">{label}</p>
        <h3>Conteudo protegido por empresa</h3>
        <p>Video, anexos e progresso ficam disponiveis somente para usuarios autorizados.</p>
      </div>
    </div>
  );
}
