"use client";

import Image from "next/image";
import Link from "next/link";
import { CourseCover } from "@/components/course-cover";
import { useLocale } from "@/components/locale-provider";
import type { Course } from "@/lib/courses";

export function CourseCard({
  course,
  href,
  showTenantBrand = false
}: {
  course: Course;
  href: string;
  showTenantBrand?: boolean;
}) {
  const { dict } = useLocale();
  return (
    <Link className="courseCard" data-accent={course.accent} href={href}>
      <CourseCover course={course} showTenantBrand={showTenantBrand} />
      <div className="courseBody">
        <p className="courseInstructor">{course.instructor}</p>
        <h3>{course.title}</h3>
        <div className="courseMeta">
          <span>
            {course.lessons} {dict.courseCard.lessons}
          </span>
          <span className="courseMetaDot" />
          <span>{course.duration}</span>
          <span className="courseMetaDot" />
          <span>{course.language}</span>
        </div>

        {course.progress > 0 ? (
          <div className="courseProgress">
            <div className="progressTrack">
              <div className="progressFill" style={{ width: `${course.progress}%` }} />
            </div>
            <span>{course.progress}%</span>
          </div>
        ) : null}

        <div className="courseFoot">
          <span className="courseCert">{course.certificate}</span>
          <span className="courseStatus" data-status={course.status}>
            {course.status}
          </span>
        </div>
      </div>
    </Link>
  );
}

export function CoursePreviewPanel({ label }: { label?: string }) {
  const { dict } = useLocale();
  return (
    <div className="lessonPreview">
      <Image src="/brand/sacf-academy-horizontal-onDark.png" alt="SACF Academy" width={170} height={96} />
      <div>
        <p className="eyebrow">{label ?? dict.courseCard.safeLesson}</p>
        <h3>{dict.courseCard.protectedContentTitle}</h3>
        <p>{dict.courseCard.protectedContentBody}</p>
      </div>
    </div>
  );
}
