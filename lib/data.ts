import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import type { Course } from "@/lib/courses";

const courseInclude = {
  modules: {
    orderBy: { position: "asc" },
    include: { lessons: { orderBy: { position: "asc" } } }
  },
  visibilityRules: { include: { organization: true, group: true } },
  _count: { select: { lessons: true } }
} satisfies Prisma.CourseInclude;

type CourseRow = Prisma.CourseGetPayload<{ include: typeof courseInclude }>;

function formatDuration(minutes: number | null): string {
  if (!minutes) return "";
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h && m) return `${h}h ${m}min`;
  if (h) return `${h}h`;
  return `${m}min`;
}

function certificateLabel(course: CourseRow): string {
  if (course.mandatory) return "Obrigatório";
  if (course.certificateValidityDays === 365) return "Validade 12 meses";
  if (course.certificateValidityDays === 730) return "Validade 24 meses";
  if (course.certificateValidityDays) return `Validade ${Math.round(course.certificateValidityDays / 30)} meses`;
  if (course.certificateEnabled) return "Certificado";
  return "Sem certificado";
}

function accentFor(vertical: string): string {
  const v = vertical.toLowerCase();
  if (v.includes("mec")) return "cyan";
  if (v.includes("elétr") || v.includes("eletr") || v.includes("tens")) return "violet";
  if (v.includes("trein")) return "green";
  return "blue";
}

function mapCourse(course: CourseRow): Course {
  const organizationSlugs = Array.from(
    new Set(
      course.visibilityRules
        .filter((rule) => rule.ruleType === "organization" && rule.organization)
        .map((rule) => rule.organization!.slug)
    )
  );
  const accessGroups = Array.from(
    new Set(
      course.visibilityRules
        .filter((rule) => rule.ruleType === "group" && rule.group)
        .map((rule) => rule.group!.slug)
    )
  );

  return {
    slug: course.slug,
    title: course.title,
    organizationSlugs,
    accessGroups,
    vertical: course.vertical,
    level: course.level,
    language: course.language,
    duration: formatDuration(course.workloadMinutes),
    lessons: course._count.lessons,
    progress: 0,
    certificate: certificateLabel(course),
    status: "Disponível",
    accent: accentFor(course.vertical),
    summary: course.shortDescription ?? course.description ?? "",
    audience: course.targetAudience ?? "",
    instructor: course.instructorName ?? "",
    modules: course.modules.map((module) => ({
      title: module.title,
      lessons: module.lessons.map((lesson) => lesson.title)
    }))
  };
}

export async function getCourses(): Promise<Course[]> {
  const rows = await prisma.course.findMany({
    where: { status: "published" },
    include: courseInclude,
    orderBy: { createdAt: "asc" }
  });
  return rows.map(mapCourse);
}

export async function getCourseBySlug(slug: string): Promise<Course | null> {
  const row = await prisma.course.findFirst({
    where: { slug, status: "published" },
    include: courseInclude
  });
  return row ? mapCourse(row) : null;
}
